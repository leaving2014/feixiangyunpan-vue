<template>
  <div class="code-preview-main" v-show="visible">
    <div class="code-preview-wrapper">
      <!--<div class="header">-->
      <!--  <div class="header-file-name text-ellip">-->
      <!--    <h3>{{ fileInfo.fileName }}</h3>-->
      <!--  </div>-->
      <!--  <div class="desc text-ellip">-->
      <!--    <h3>在线编辑</h3>-->
      <!--  </div>-->
      <!--  <i class="iconfont icon-guanbi cursor-p" @click="closeCodePreview()"></i>-->
      <!--  &lt;!&ndash;<div class="menu">&ndash;&gt;-->
      <!--  &lt;!&ndash;  &ndash;&gt;-->
      <!--  &lt;!&ndash;</div>&ndash;&gt;-->
      <!--</div>-->
      <!-- 顶部信息栏 & 工具栏 -->
      <div class="tip-wrapper" v-if="visible">
        <div class="name" :title="fileInfo.fileName">
          {{ fileInfo.fileName }}
          <span class="un-save" v-show="isModify">（未保存）</span>
        </div>
        <div class="editor-preveiw">在线编辑 & 预览</div>
        <div class="tool-wrapper">
          <a
            class="item download-link"
            target="_blank"
            :href="getDownloadFilePath(fileInfo)"
            :download="getFileNameComplete(fileInfo)"
          >
            <i class="iconfont icon-xiazai" title="下载"></i>
          </a>
          <i
            class="item iconfont icon-guanbi"
            title="关闭预览"
            @click="closeCodePreview"
          ></i>
        </div>
      </div>

      <div
        class="preview-body"
        style="box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px"
      >
        <!--编辑器配置工具栏-->
        <div class="operate-wrapper">
          <i
            class="save-icon iconfont icon-baocun"
            title="保存（ctrl+s）"
            v-show="isModify"
            @click="handleModifyFileContent"
          ></i>
          <el-form
            class="editor-set-form"
            :model="codeMirrorOptions"
            :inline="true"
            size="small"
            label-position="right"
            label-suffix=":"
          >
            <!--自动换行-->
            <div class="line-wrapper auto-wrap inline-block-v-middle">
              <label
                class="u-checkbox nd-file-grid-list__select-all"
                :class="
                  codeMirrorOptions.lineWrapping === true ? 'is-checked' : ''
                "
              >
                <span
                  class="u-checkbox__input"
                  :class="
                    codeMirrorOptions.lineWrapping === true ? 'is-checked' : ''
                  "
                >
                  <span class="u-checkbox__inner"></span>
                  <input
                    type="checkbox"
                    aria-hidden="false"
                    v-model="codeMirrorOptions.lineWrapping"
                    @change="handleChangeCodeMirrorOption"
                    class="u-checkbox__original"
                    value=""
                  />
                </span>
                <span class="u-checkbox__label">自动换行</span>
              </label>
            </div>

            <el-form-item label-width="0px" class="font-size">
              <el-select v-model="codeMirrorCustomOptions.fontSize" filterable>
                <el-option
                  v-for="(item, index) in fontSizeList"
                  :key="index"
                  :value="item"
                  :label="`${item} px`"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label-width="80px" label="代码语言" class="lanaguage">
              <el-select
                v-model="codeMirrorOptions.mode"
                filterable
                @change="handleChangeCodeMirrorOption"
              >
                <el-option
                  style="z-index: 3999"
                  v-for="(value, key, index) in fileSuffixCodeModeMap"
                  :key="index"
                  :value="value[1].mime"
                  :label="value[1].language"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="主题" label-width="56px" class="theme">
              <el-select
                v-model="codeMirrorOptions.theme"
                filterable
                @change="handleChangeCodeMirrorOption"
              >
                <el-option value="default" label="default"></el-option>
                <el-option
                  style="z-index: 3999"
                  v-for="(item, index) in codeMirrorThemeList"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <codemirror
          class="code-editor"
          ref="codemirrorRef"
          v-model="codeMirrorText"
          :options="codeMirrorOptions"
          v-loading="codeMirrorLoading"
          v-if="isShow"
          :style="`font-size: ${codeMirrorCustomOptions.fontSize}px;`"
        />
      </div>
    </div>

    <!--<codemirror v-model="code" :options="cmOptions" />-->

    <!-- Or manually control the data synchronization -->

    <!-- Nuxt.js -->
    <!--<client-only placeholder="Codemirror Loading...">-->
    <!--  <codemirror-->
    <!--    ref="cmEditor"-->
    <!--    :value="code"-->
    <!--    :options="cmOptions"-->
    <!--    @ready="onCmReady"-->
    <!--    @focus="onCmFocus"-->
    <!--    @input="onCmCodeChange"-->
    <!--  />-->
    <!--</client-only>-->
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css' // codemirror 样式
import './theme.js' //  codemirror 高亮代码主题
import './mode.js' // codemirror 的解析语言模式
import './fold.js' //  codemirror 的代码折叠功能相关
import { codeMirrorThemeList, fileSuffixCodeModeMap, fontSizeList } from '@/libs/map.js'
// 文件修改相关
import store from '@/store/index.js'
import { getFilePreview, modifyFileContent } from '@/request/file'

export default {
  name: 'CodePreview',
  props: {
    show: {
      type: Boolean
    },
    file: {
      type: Object
    }
  },
  components: {
    codemirror
  },
  data () {
    return {
      fontSizeList,
      fileSuffixCodeModeMap,
      codeMirrorThemeList,
      visible: false, // 代码预览遮罩层组件是否显示
      originalCodeText: '', // 代码原本的文本
      codeMirrorText: '', // 代码实时修改的文本
      codeMirrorLoading: false, // 代码内容是否加载中
      // codemirror 配置项，参考 https://codemirror.net/doc/manual.html#config
      codeMirrorOptions: {
        tabSize: 4, //  制表符的宽度。默认为 4。
        mode: 'text/html', //  解析当前代码的模式，参考 https://codemirror.net/mode/ 每种语言的示例页面的底部都有对应的 MIME 类型，如果当前文件后缀没有匹配的语言，按照 html 来解析
        theme: 'default', //  代码高亮主题色，其他主题色参考 https://codemirror.net/theme/
        lineNumbers: true, //  是否在编辑器左侧显示行号
        line: true,
        autoCloseBrackets: true, //  自动补全括号
        foldGutter: true, //  创建带有指示可折叠块的标记的装订线
        lineWrapping: true, //  长行处理：false 滚动 | true 换行
        // 额外的装订线
        gutters: [
          'CodeMirror-linenumbers',
          'CodeMirror-foldgutter',
          'CodeMirror-lint-markers'
        ]
      },
      isShow: true, //  codemirror 是否展示
      // codemirror 自定义配置项
      codeMirrorCustomOptions: {
        fontSize: 14
      }
    }
  },
  watch: {
    // 监听代码查看组件 显隐状态变化
    visible (val) {
      if (val) {
        // codemirror 解析模式设置
        let fileSuffix = this.fileInfo.fileExt.toLowerCase()
        if (fileSuffix === 'yaml') {
          fileSuffix = 'yml'
        }
        if (this.fileSuffixCodeModeMap.has(fileSuffix)) {
          this.codeMirrorOptions.mode =
            this.fileSuffixCodeModeMap.get(fileSuffix).mime
        }
        // codemirror 主题获取
        this.codeMirrorOptions.theme =
          localStorage.getItem('qiwen_file_codemirror_theme') || 'default'
        this.getCodeText()
        // 添加键盘 Esc 事件
        this.$nextTick(() => {
          document.addEventListener('keyup', (e) => {
            if (e.keyCode === 27) {
              this.closeCodePreview()
            }
          })
        })
      } else {
        document.removeEventListener('keyup', (e) => {
          if (e.keyCode === 27) {
            this.closeCodePreview()
          }
        })
      }
    },
    // 监听主题变化
    'codeMirrorOptions.theme' (val) {
      // localStorage.setItem('qiwen_file_codemirror_theme', val)
    }
  },
  created () {
  },
  computed: {
    // 屏幕宽度
    screenWidth () {
      return store.state.common.screenWidth
    },
    // 是否修改
    isModify () {
      return this.originalCodeText !== this.codeMirrorText
    }
  },
  mounted () {
    // console.log('the current CodeMirror instance object:', this.codemirror)
    // you can use this.codemirror to do something...
  },
  methods: {
    /**
     * 获取代码文本内容
     */
    getCodeText () {
      this.codeMirrorLoading = true
      getFilePreview({
        id: this.fileInfo.identifier,
        time: new Date(this.fileInfo.fileCreateTime.valueOf()).getTime(),
        fileType: this.fileInfo.fileType,
        extensionName: this.fileInfo.fileExt
      }).then((res) => {
        this.codeMirrorLoading = false
        this.originalCodeText =
          typeof res === 'object' ? JSON.stringify(res) : res.toString()
        this.codeMirrorText = this.originalCodeText
      })
    },
    /**
     * 修改代码文本内容
     */
    handleModifyFileContent () {
      console.log('触发了修改')
      if (!this.isModify) {
        return false
      }
      this.codeMirrorLoading = true
      modifyFileContent({
        fileId: this.fileInfo.id,
        fileContent: this.codeMirrorText
      })
        .then((res) => {
          this.codeMirrorLoading = false
          if (res.success) {
            this.$message.success('已保存')
            this.getCodeText()
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((err) => {
          this.codeMirrorLoading = false
          this.$message.error(err.message)
        })
    },
    /**
     * codemirror 配置项改变时触发
     */
    handleChangeCodeMirrorOption () {
      this.isShow = false
      this.isShow = true
    },
    /**
     * 关闭代码预览
     */
    closeCodePreview () {
      this.visible = false
      this.callback('cancel')
    }
  }
}
</script>

<style lang="less">
.code-preview-main {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  background: rgba(0, 0, 0, 0.3);
  margin: 0;
  z-index: 2999;

  .iconfont:hover {
    color: #06a7ff;
  }

  .code-preview-wrapper {
    margin: 56px auto 0 auto;
    width: 90vw;
    height: calc(100vh - 80px);

    .tip-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 2;
      background: rgba(0, 0, 0, 0.5);
      padding: 0 48px;
      width: 100%;
      height: 48px;
      line-height: 48px;
      color: #fff;
      font-size: 16px;
      display: flex;
      justify-content: space-between;

      .name {
        flex: 1;
        padding-right: 16px;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        .un-save {
          color: #e6a23c;
          font-size: 14px;
        }
      }

      .tool-wrapper {
        flex: 1;
        display: flex;
        justify-content: flex-end;

        .item {
          margin-left: 16px;
          height: 48px;
          line-height: 48px;
          cursor: pointer;

          &:hover {
            opacity: 0.7;
          }
        }

        .download-link {
          color: inherit;
          font-size: 18px;
        }

        .text-wrapper {
          .text {
            margin-right: 8px;
          }
        }
      }
    }

    .preview-body {
      margin: 56px auto 0 auto;
      min-width: 260px;
      margin: 56px auto 0 auto;
      width: 90vw;
      height: calc(100vh - 80px);

      .operate-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 8px 8px 0 0;
        border-bottom: 1px solid #dcdfe6;
        padding: 8px 16px;
        background: #fff;

        .save-icon {
          font-size: 20px;
          cursor: pointer;
          color: #909399;
          font-weight: 550;

          &:hover {
            opacity: 0.5;
          }
        }

        .editor-set-form {
          flex: 1;
          text-align: right;

          .auto-wrap {
            height: 30px;
            margin-right: 10px;
            text-align: right;
            line-height: 40px;
            vertical-align: middle;
          }

          .el-form-item {
            margin-bottom: 0;

            &.font-size {
              .el-form-item__content {
                .el-select {
                  width: 96px;
                }
              }
            }

            &.lanaguage {
              .el-form-item__content {
                .el-select {
                  width: 120px;
                }
              }
            }

            &.theme {
              .el-form-item__content {
                .el-select {
                  width: 190px;
                }
              }
            }
          }
        }
      }

      .code-editor {
        height: calc(100vh - 160px) !important;

        .CodeMirror {
          border-radius: 0 0 8px 8px;
          height: inherit !important;
          font-size: inherit !important;

          .CodeMirror-vscrollbar,
          .CodeMirror-hscrollbar {
            display: none !important;
          }

          .CodeMirror-scroll {
            width: 100%;
            padding: 8px 0 0 0;
            line-height: 1.5;
            font-size: inherit;
            //setScrollbar(12px, transparent, #C0C4CC);
          }
        }
      }
    }
  }
}
</style>
