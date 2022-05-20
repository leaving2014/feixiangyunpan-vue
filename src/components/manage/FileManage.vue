<template>
  <div
    class="main-list file-manage"
  >
    <div class="file-list-toolbar__wrapper">
      <div
        class="nd-file-list-toolbar nd-file-list-toolbar__actions inline-block-v-middle"
      >
        <span>文件搜索:  </span>
        <el-input
          style="display: inline-block; width: 200px;margin-right: 50px;"
          placeholder="请输入搜索内容按回车键搜索"
          v-model="searchKeyWords"
          @clear="clearSearchKeyWords"
          @keyup.enter.native="search"
          clearable>
        </el-input>
        <el-checkbox v-model="onlyShowFile" v-show="$route.query.category==='all'">仅显示文件</el-checkbox>

        <!--默认功能条-->
        <div
          class="btn-group inline-block-v-middle theme-primary-text"
          v-if="this.selectedFileCount === 0"
        >
        </div>
        <!--选中文件功能梯条-->
        <div class="btn-group inline-block-v-middle theme-primary-text" v-else>
          <!--下载-->
          <button type="button" class="u-button toolbar-item is-need-left-sep">
            <a
              :href="getDownloadFilePath(this.fileList[this.selectFileIndex])"
              class="theme-primary-text"
            >
              <i class="iconfont icon-xiazai"></i>
              <span class="toolbar_text theme-primary-text">下载</span>
            </a>
          </button>
          <!--重命名-->
          <button
            class="u-button toolbar-item is-need-left-sep"
            v-show="this.selectedFileCount === 1"
            type="button"
            @click="renameFile"
          >
            <i class="iconfont icon-zhongmingming"></i>
            <span class="toolbar_text">重命名</span>
          </button>

          <button
            type="button"
            :id="index"
            class="u-button toolbar-item is-need-left-sep"
            v-for="(item, index) in fileToolBarList"
            @click="fileOption(item.methodName)"
            :key="item.name"
          >
            <i class="iconfont" :class="item.iconClassName"></i>
            <span class="toolbar_text">{{ item.name }}</span>
          </button>
        </div>
      </div>
      <!--搜索-->
      <!--<div class="file-list-toolbar__search inline-block-v-middle">-->
      <!--  <div class="u-input u-input&#45;&#45;primary u-input&#45;&#45;small u-input&#45;&#45;suffix">-->
      <!--    <input-->
      <!--      type="text"-->
      <!--      class="search_input u-input__inner"-->
      <!--      placeholder="搜索文件"-->
      <!--      autocomplete="off"-->
      <!--      v-model="searchKeyWords"-->
      <!--      @keyup.enter="search()"-->
      <!--    />-->
      <!--    <span class="u-input__suffix">-->
      <!--      <span class="u-input__suffix-inner">-->
      <!--        <i-->
      <!--          class="iconfont icon-sousuo"-->
      <!--          v-if="$route.query.search === undefined"-->
      <!--          @click="search"-->
      <!--        ></i>-->
      <!--        <i-->
      <!--          class="iconfont icon-guanbi"-->
      <!--          v-if="$route.query.search !== undefined"-->
      <!--          @click="back('/'), (searchKeyWords = '')"-->
      <!--        ></i>-->
      <!--      </span>-->
      <!--    </span>-->
      <!--  </div>-->
      <!--</div>-->
    </div>
    <!--文件路径导航条-->
    <div class="main-list__nav file-main__nav grid">
      <!--导航条左-->
      <div class="file-main__nav-left">
        <div
          v-if="
            $route.query.filePath !== undefined ||
            $route.query.search !== undefined
          "
        >
          <span class="file-selector__nav-item">
            <span
              class="file-selector__nav-item-title text-ellip"
              @click="back($route.query.filePath)"
            >返回上一级</span
            >
            <span class="file-selector__nav-item-sep">|</span>
          </span>
          <span class="file-selector__nav-item">
            <span
              class="file-selector__nav-item-title text-ellip"
              @click="back('/')"
              :style="{
                color:
                  $route.query.search !== undefined ? '#06a7ff !important' : ''
              }"
            >全部文件
            </span>
            <span class="file-selector__nav-item-sep">></span>
            <!--搜索导航显示-->
            <span
              class="file-selector__nav-item"
              v-if="$route.query.search !== undefined"
            >
              <span
                class="file-selector__nav-item-sep"
                style="display: inline-block"
              >></span
              >
              <span
                class="file-selector__nav-item-title text-ellip is-current-nav"
              >搜索:
                {{ $route.query.search }}
              </span>
            </span>
          </span>
          <template v-if="this.$route.query.filePath !== undefined">
            <span
              class="file-selector__nav-item"
              v-for="(item, index) in this.$route.query.filePath
                .split('/')
                .slice(1)"
              :key="item"
            >
              <span
                class="file-selector__nav-item-title text-ellip is-current-nav"
                :path="fullPath.split('/')"
                @click="navigate(index)"
                :index="index"
              >{{ item }}</span
              >
              <span class="file-selector__nav-item-sep">></span>
            </span>
          </template>
        </div>
        <div v-if="$route.path === '/manage'">
          <span class="title">{{
              this.getIndexPageTitle($route.query.category)
            }}</span>
        </div>
      </div>
      <!--导航条右-->
      <div class="file-main__nav-right">
        <span class="file-main__nav-right-count">
          已全部加载，共{{ this.fileList.length }}个
        </span>
        <i
          class="iconfont cursor-p file-main__nav-right-icon inline-block-v-middle"
          :class="
            displayMode === 'block'
              ? 'icon-xianshifangshi_lie'
              : 'icon-xianshifangshi_kuai'
          "
          @click="selectDisplayMode(displayMode)"
        ></i>
        <i
          class="iconfont icon-shuaxin cursor-p file-main__nav-right-icon inline-block-v-middle"
          @click="refreshFileList"
          style="margin-left: 5px"
          title="刷新文件列表"
        ></i>
      </div>
    </div>
    <!--文件显示  缩略图显示-->
    <div
      class="file-grid-list clearfix main-list__grid"
      v-show="displayMode === 'block'"
    >
      <!--文件选择提示-->
      <div class="file-grid-list__nav">
        <label
          class="u-checkbox nd-file-grid-list__select-all"
          :class="selectAllFiles === true ? 'is-checked' : ''"
        >
          <span
            class="u-checkbox__input"
            :class="selectAllFiles === true ? 'is-checked' : ''"
          >
            <span class="u-checkbox__inner"></span>
            <input
              type="checkbox"
              aria-hidden="false"
              @click.stop="selectAll($event)"
              class="u-checkbox__original"
              value=""
            />
          </span>
          <span class="u-checkbox__label">{{
              this.selectedFileCount > 0
                ? '已选择' + `${this.selectedFileCount}` + '个文件/文件夹'
                : '全选'
            }}</span>
        </label>
        <div class="clear"></div>
      </div>
      <!-- -->
      <!--文件显示列表  缩略图显示-->
      <div
        class="file-grid-list__body show-mode-block mouse-choose-list"
        v-contextmenu:contextmenu
        style=""
      >
        <div
          class="mouse-choose-box"
          style="
            padding-top: 0px;
            padding-bottom: 20px;
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
          "
        >
          <!--&gt;@click.stop="enterFolder(index, '/'+item.fileName, $event)"-->
          <!--@click.stop="clickActions(getClickActions(item),{index:index}, '/'+item.fileName, {e:$event})"-->
          <!--@contextmenu.prevent="openMenu($event, item, index)"-->
          <!--showContentMenuType === 0 ? 'blankMenu' : showContentMenuType ===1 ? 'singleMenu': 'multiMenu'-->
          <!--@contextmenu.prevent="showContentMenuType(index)"-->
          <div
            class="grid-list__item text-center cursor-p"
            v-for="(item, index) in sortFileList"
            v-contextmenu:contextmenu
            @contextmenu.prevent="showContentMenuType(index)"
            :fid="item.id"
            :key="'id' + index"
            :class="selectedFile[index] === true ? 'is-checked' : ''"
          >
            <!--顶部操作功能-->
            <div class="grid-list__item-top">
              <label
                class="u-checkbox"
                :id="selectedFile[index] === true ? 'is-checked' : ''"
                :class="[selectedFile[index] === true ? 'is-checked' : '']"
              >
                <span
                  class="u-checkbox__input"
                  :class="[
                    selectedFile[index] === true ? 'is-checked' : '',
                    selectAllFiles === true ? 'is-checked' : ''
                  ]"
                >
                  <span
                    class="u-checkbox__inner"
                    @click.stop="selectFile(index, $event)"
                  ></span>
                  <!--@click.stop="selectFile(index, $event)"-->
                  <input
                    type="checkbox"
                    aria-hidden="false"
                    class="u-checkbox__original"
                    value=""
                  />
                </span>
              </label>
              <!--<div-->
              <!--  class="file-list__line-action theme-primary-text grid-list__item-list-action"-->
              <!--&gt;-->
              <!--  <i-->
              <!--    title="更多"-->
              <!--    class="iconfont icon-qita u-tooltip u-icon u-icon-more cursor-p file-list__line-action-item"-->
              <!--    @click="showContentMenuType(index)"-->
              <!--  ></i>-->
              <!--</div>-->
            </div>
            <!--文件显示主体-->
            <!--clickActions(getClickFileType(item) !== undefined?getClickFileType(item):'' ,-->
            <div draggable="true" @click="clickActions(index, item)">
              <div class="file-list-drag-copy">
                <div class="file-list-drag-copy__item is-id-1">
                  <!--<i class="iconfont icon-wenjianjia1"></i>-->
                  <img
                    src="@/assets/files/folder.png"
                    class="file-list-drag-copy__item-title-icon img-before-icon iconfont icon-pure-color"
                  />
                  <span
                    class="file-list-drag-copy__item-title-text inline-block-v-middle text-ellip"
                  >{{ item }}</span
                  >
                </div>
              </div>
              <div class="grid-list__item-icon-wrapper">
                <img
                  v-if="item.fileType === 1"
                  :data-source="getRowImageSrc(item)"
                  class="nd-grid-list__item-icon img-before-icon iconfont icon-pure-color v-viewer"
                  :src="setFileImg(item)"
                />
                <img
                  v-else
                  class="nd-grid-list__item-icon img-before-icon iconfont icon-pure-color"
                  :src="setFileImg(item)"
                />
              </div>
              <div class="u-tooltip">
                <p class="grid-list__item-title text-ellip">
                  <!--item.fileName-->
                  {{ item.fileName !== undefined ? item.fileName : '' }}
                </p>
                <p class="grid-list__item-desc text-ellip">
                  {{ item.fileUpdateTime.slice(5) }}
                </p>
                <p class="grid-list__item-desc text-ellip">
                  {{ item.deleted === 0 ? '' : '回收站' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--文件显示 列表显示-->
    <div
      class="main-filelist main-list__table"
      v-show="displayMode === 'list'"
      v-contextmenu:contextmenu
    >
      <div class="table is-show-header">
        <div class="table__header">
          <table class="table__header-table">
            <!--<colgroup>-->
            <!--  <col width="6%">-->
            <!--  <col width="47%">-->
            <!--  <col width="33%">-->
            <!--  <col width="12%">-->
            <!--</colgroup>-->
            <colgroup>
              <col width="4%" />
              <col width="47%" />
              <col width="20%" />
              <col width="10%" />
              <col width="10%" />
              <col width="7%" />
            </colgroup>
            <thead>
            <tr class="table__header-row">
              <th class="table__header-th text-center table__header-select">
                <label
                  class="u-checkbox file-grid-list__select-all"
                  :class="selectAllFiles === true ? 'is-checked' : ''"
                >
                    <span
                      class="u-checkbox__input"
                      :class="selectAllFiles === true ? 'is-checked' : ''"
                    >
                      <span class="u-checkbox__inner"></span>
                      <input
                        type="checkbox"
                        aria-hidden="false"
                        class="u-checkbox__original"
                        @click.stop="selectAll($event)"
                        value=""
                      />
                    </span>
                  <span class="u-checkbox__label title">{{
                      this.selectedFileCount > 0
                        ? '已选择' +
                        `${this.selectedFileCount}` +
                        '个文件/文件夹'
                        : ''
                    }}</span>
                </label>
              </th>
              <th class="table__header-th cursor-p is-name">
                <div class="text-ellip content inline-block-v-middle" @click="changeOrder('fileName')">
                    <span v-show="this.selectedFileCount === 0" class="title"
                    >文件名</span
                    >
                  <div class="nd-sort" v-show="orderColumn=='fileName'">
                    <i class="iconfont icon icon-shangsanjiaoxing"
                       :class="order==='asc'?'active':''"></i>
                    <i class="iconfont icon icon-xiasanjiaoxing"
                       :class="order==='desc'?'active':''"></i>
                  </div>
                </div>
              </th>
              <th class="table__header-th cursor-p">
                <div class="text-ellip content inline-block-v-middle" @click="changeOrder('fileUpdateTime')">
                  <span class="title">修改时间</span>
                  <div class="nd-sort" v-show="orderColumn=='fileUpdateTime'">
                    <i class="iconfont icon icon-shangsanjiaoxing"
                       :class="order==='asc'?'active':''"></i>
                    <i class="iconfont icon icon-xiasanjiaoxing"
                       :class="order==='desc'?'active':''"></i>
                  </div>
                </div>
              </th>
              <th class="table__header-th cursor-p">
                <div class="text-ellip content inline-block-v-middle" @click="changeOrder('fileSize')">
                  <span class="title">大小</span>
                  <div class="nd-sort" v-show="orderColumn=='fileSize'">
                    <i class="iconfont icon icon-shangsanjiaoxing"
                       :class="order==='asc'?'active':''"></i>
                    <i class="iconfont icon icon-xiasanjiaoxing"
                       :class="order==='desc'?'active':''"></i>
                  </div>
                </div>
              </th>
              <th class="table__header-th cursor-p">
                <div class="text-ellip content inline-block-v-middle" @click="changeOrder('userId')">
                  <span class="title">用户</span>
                  <div class="nd-sort" v-show="orderColumn=='userId'">
                    <i class="iconfont icon icon-shangsanjiaoxing"
                       :class="order==='asc'?'active':''"></i>
                    <i class="iconfont icon icon-xiasanjiaoxing"
                       :class="order==='desc'?'active':''"></i>
                  </div>
                </div>
              </th>
              <th class="table__header-th cursor-p">
                <div class="text-ellip content inline-block-v-middle" @click="changeOrder('status')">
                  <span class="title">审核状态</span>
                  <div class="nd-sort" v-show="orderColumn=='status'">
                    <i class="iconfont icon icon-shangsanjiaoxing"
                       :class="order==='asc'?'active':''"></i>
                    <i class="iconfont icon icon-xiasanjiaoxing"
                       :class="order==='desc'?'active':''"></i>
                  </div>
                </div>
              </th>
            </tr>
            </thead>
          </table>
        </div>
        <!--文件列表主体-->
        <div class="table__body mouse-choose-list">
          <!--<colgroup>-->
          <!--  <col width="6%">-->
          <!--  <col width="40%">-->
          <!--  <col width="22%">-->
          <!--  <col width="32%">-->
          <!--</colgroup>-->
          <table class="table__body-table mouse-choose-box">
            <colgroup>
              <col width="4%" />
              <col width="47%" />
              <col width="20%" />
              <col width="10%" />
              <col width="10%" />
              <col width="7%" />
            </colgroup>
            <tbody>
            <!--@contextmenu.prevent="openMenu($event, item, index)"-->
            <tr
              :data-id="item.id"
              class="table__body-row mouse-choose-item"
              :class="selectedFile[index] === true ? 'is-checked' : ''"
              v-contextmenu:contextmenu
              @contextmenu.prevent="showContentMenuType(index)"
              :index="index"
              :fid="item.id"
              :key="'id' + index"
              v-for="(item, index) in sortFileList"
            >
              <td class="text-center is-select">
                <label
                  class="u-checkbox"
                  :id="selectedFile[index] === true ? 'is-checked' : ''"
                  :class="[
                      selectedFile[index] === true ? 'is-checked' : '',
                      selectedFile[index] === true ? 'is-checked' : ''
                    ]"
                >
                    <span
                      class="u-checkbox__input"
                      :class="[
                        selectedFile[index] === true ? 'is-checked' : '',
                        selectAllFiles === true ? 'is-checked' : ''
                      ]"
                    >
                      <span
                        class="u-checkbox__inner"
                        @click.stop="selectFile(index, $event)"
                      ></span>
                      <!--@click.stop="selectFile(index, $event)"-->
                      <input
                        type="checkbox"
                        aria-hidden="false"
                        class="u-checkbox__original"
                        value=""
                      />
                    </span>
                </label>
              </td>
              <!--文件名-->
              <td
                class="text-ellip table__td"
                @click="clickActions(index, item)"
              >
                <div class="list-name cursor-p">
                  <div class="pointer-events-all cursor-p">
                    <img
                      v-if="1 === 1"
                      :data-source="getRowImageSrc(item)"
                      class="list-name__title-icon img-before-icon iconfont icon-pure-color v-viewer"
                      :src="setFileImg(item)"
                    />
                    <img
                      v-else
                      class="list-name__title-icon img-before-icon iconfont icon-pure-color"
                      :src="setFileImg(item)"
                    />
                    <a
                      :title="item.fileName"
                      class="list-name__title-text inline-block-v-middle text-ellip"
                    >
                      {{ item.fileName }}
                    </a>
                  </div>
                </div>
              </td>
              <!--修改时间-->
              <td class="text-ellip nd-table__td normal-column">
                <div class="file-list-time-column">
                  <p class="column-content-hide">{{ item.fileUpdateTime }}</p>
                  <div
                    class="nd-file-list__line-action theme-primary-text column-content-show"
                  >
                    <i
                      title="分享"
                      class="inline-block-v-middle cursor-p u-icon file-list__line-action-item u-icon-share"
                    ></i>
                    <i
                      title="下载"
                      class="inline-block-v-middle cursor-p u-icon file-list__line-action-item u-icon-share"
                    ></i>
                    <i
                      title="更多"
                      class="inline-block-v-middle cursor-p u-icon file-list__line-action-item u-icon-share"
                    ></i>
                  </div>
                </div>
              </td>
              <!--大小-->
              <td class="text-ellip nd-table__td normal-column">
                <section>
                    <span v-if="item.isDir === 0">{{
                        item.fileSize | storageTrans
                      }}</span>
                  <span v-else>-</span>
                </section>
              </td>
              <!--用户-->
              <td class="text-ellip nd-table__td normal-column">
                <section>
                  {{ item.user.userName }}
                </section>
              </td>
              <!--审核状态-->
              <td class="text-ellip nd-table__td normal-column">
                <section>
                  <!--文件审核(-1:未审核,0:审核中,1:审核通过)-->
                  <span :class="item.audit ===-1? 'warn':item.audit ===1?'audit':'doing'">{{
                      item.audit === -1 ? '审核未通过' : item.audit === 0 ? '审核中' : item.audit === 1 ? '审核通过' : '-'
                    }}</span>
                </section>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <!--无文件显示-->
        <div class="table__body-empty" style="display: none"></div>
      </div>
    </div>

    <Loading v-show="showLoading" :text="this.loadingText"></Loading>
    <!--文件详情-->
    <ManageFileInfo
      :file-list="fileList"
      :file="fileList[selectFileIndex]"
      :fullPath="selectFullPath"
      :fullPathArr="fullPath.split('/').slice(1)"
      :selectFileIndex="selectFileIndex"
      :selectedFileCount="selectedFileCount"
    ></ManageFileInfo>

    <!--分页-->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size=this.pageSize
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

    <!--<div style="width: 100%; position: fixed; bottom: 50px;left: 30px;z-index: 500;" v-show="false">-->

    <!--  <uploader :options="options" :autoStart="false"-->
    <!--            :fileStatusText="{success: '上传成功',error: '上传失败',uploading: '正在上传',paused: '暂停上传',waiting: '等待上传'}"-->
    <!--            @file-success="onFileSuccess" @file-added="fileAdded" @file-error="onFileError"-->
    <!--            class="uploader-example">-->
    <!--    <uploader-unsupport></uploader-unsupport>-->
    <!--    <uploader-drop>-->
    <!--      <uploader-btn :attrs="attrs" single>上传</uploader-btn>-->
    <!--    </uploader-drop>-->
    <!--    <uploader-list></uploader-list>-->
    <!--  </uploader>-->
    <!--</div>-->

    <v-contextmenu class="contextmenu" ref="contextmenu" style="width: 120px">
      <!--空白处菜单-->
      <template v-if="selectedFileCount === 0">
        <v-contextmenu-submenu title="查看">
          <v-contextmenu-item
            class="contextmenu-item"
            @click="selectDisplayMode(displayMode)"
          >
            <span
              class="menu__item-select-icon inline-block-v-middle"
              v-show="displayMode === 'list'"
              :class="displayMode === 'list' ? 'active' : ''"
            >
            </span>
            <span class="menu-text">列表</span>
          </v-contextmenu-item>
          <v-contextmenu-item
            class="contextmenu-item"
            @click="selectDisplayMode(displayMode)"
          >
            <span
              class="menu__item-select-icon inline-block-v-middle"
              v-show="displayMode === 'block'"
              :class="displayMode === 'block' ? 'active' : ''"
            >
            </span>
            <span class="menu-text">缩略图</span>
          </v-contextmenu-item>
        </v-contextmenu-submenu>

        <v-contextmenu-item @click="getFiles()"
        >刷新
        </v-contextmenu-item
        >
        <!--<v-contextmenu-item @click="createFolder()"-->
        <!--&gt;新建文件夹-->
        <!--</v-contextmenu-item-->
        <!--&gt;-->
      </template>

      <!--单文件右键菜单-->
      <template v-if="selectedFileCount === 1">
        <v-contextmenu-item
          @click="menuMethods(item.methodName)"
          style="margin: 3px 0"
          v-for="item in singleMenuList"
          :key="item.id"
        >
          <i
            class="iconfont v-contextmenu-submenu__icon"
            :class="item.iconClassName"
          ></i>
          {{ item.name }}
        </v-contextmenu-item>

        <v-contextmenu-item style="margin: 3px 0">
          <a
            :href="getDownloadFilePath(this.fileList[this.selectFileIndex])"
            style="color: #333"
          >
            <i class="iconfont icon-xiazai v-contextmenu-submenu__icon"></i>下载
          </a>
        </v-contextmenu-item>
        <v-contextmenu-item style="margin: 3px 0" v-if="this.fileList[this.selectFileIndex].fileType === 1"
                            @click="cosAudit">
          <i class="iconfont icon-shenhe v-contextmenu-submenu__icon"></i>腾讯云审核
        </v-contextmenu-item>
        <v-contextmenu-item style="margin: 3px 0" v-if="this.fileList[this.selectFileIndex].deleted===0"
                            @click="deleteFile">
          <i class="iconfont icon-shanchu v-contextmenu-submenu__icon"></i>删除
        </v-contextmenu-item>
        <v-contextmenu-item style="margin: 3px 0" v-if="this.fileList[this.selectFileIndex].deleted===1"
                            @click="deleteFileComplete">
          <i class="iconfont icon-shanchu v-contextmenu-submenu__icon"></i>彻底删除
        </v-contextmenu-item>
        <v-contextmenu-item style="margin: 3px 0"
                            @click="changeAudit()">
          <i class="iconfont icon-shenhe v-contextmenu-submenu__icon"></i>{{
            fileList[selectFileIndex].audit === 1 ? '审核不通过' : '审核通过' }}
        </v-contextmenu-item>
      </template>

      <!--多文件右键菜单-->
      <template v-if="selectedFileCount > 1">
        <!--<v-contextmenu-item>多个文件右键</v-contextmenu-item>-->
        <v-contextmenu-item
          @click="menuMethods(item.methodName)"
          style="margin: 3px 0"
          v-for="item in multiMenuList"
          :key="item.id"
        >
          <i
            class="iconfont v-contextmenu-submenu__icon"
            :class="item.iconClassName"
          ></i>
          {{ item.name }}
        </v-contextmenu-item>
        <v-contextmenu-item style="margin: 3px 0">
          <a
            :href="getDownloadFilePath(this.fileList[this.selectFileIndex])"
            style="color: #333"
          >
            <i class="iconfont icon-xiazai v-contextmenu-submenu__icon"></i>下载
          </a>
        </v-contextmenu-item>
      </template>
    </v-contextmenu>

  </div>
</template>

<script>
import ManageFileInfo from '@/components/manage/manageFileInfo/ManageFileInfo'
// import ContextMenu from '@/components/common/contextMenu/ContextMenu.vue'
import Loading from '@/components/common/loading/Loading'
import Bus from '@/libs/bus'
import { getUserInfo } from '@/request/user'
import { blankMenuList, conversionExtList, defaultMenuList, multiMenuList } from '@/libs/map'
import {
  batchDeleteFile, deleteFile,
  getFileListByType, renameFile
} from '@/request/file'
import { deleteRecycleFile, getCosFileAudit, getFiles, getFilesByType, updateFileAudit } from '@/request/manage'
import Config from '@/config'
import viewerApi from '@/components/play/imagePreview/api'

export default {
  name: 'FileManage',
  props: {},
  components: {
    ManageFileInfo,
    // ContextMenu,
    Loading
  },
  data () {
    return {
      defaultMenuList,
      multiMenuList,
      blankMenuList,
      conversionExtList,
      onlyShowFile: true,
      keyword: '',
      // 分页
      currentPage: 1,
      loadingText: '加载中...',
      // 文件总数
      total: 0,
      // 总页数
      pageCount: 0,
      // 分页大小
      pageSize: 20,
      pageNum: 1,
      // 显示加载动画
      showLoading: false,
      fileName: '',
      // 打开文件索引
      openFileIndex: -1,
      // 获取文件的全路径
      fullPath: '',
      selectFullPath: '',
      // 当前所在路径
      currentPath: '',
      showMenu: false,
      imageList: [],
      // 右键菜单弹窗左边距离
      searchKeyWords: '',
      menuType: 1,
      menuFileIndex: -1,
      path: '/',
      // 选中文件数量
      selectedFileCount: 0,
      // 当前点击文件索引
      selectFileIndex: -1,
      // 选中文件记录 长度为文件数量,true选中,false未选中
      selectedFile: [],
      // 是否选中所有文件
      selectAllFiles: false,
      // 选中文件对象数组
      selectFileArray: [],
      // 文件列表
      fileList: [],
      // 排序文件列表
      sortFileList: [],
      // 选中文件列表 包含file所有信息
      selectFileList: [],
      // 选中文件id列表
      selectFileIdList: [],
      // 文件显示方式 默认block,可选值list
      displayMode: 'block',
      fileToolBarList: [
        // {
        //   id: 2,
        //   name: '下载',
        //   iconClassName: 'icon-xiazai',
        //   methodName: 'download'
        // },
        // {
        //   id: 3,
        //   name: '分享',
        //   iconClassName: 'icon-fenxiang1',
        //   methodName: 'shareFile'
        // },
        // {
        //   id: 4,
        //   name: '复制',
        //   iconClassName: 'icon-fuzhi',
        //   methodName: 'copyFile'
        // },
        // {
        //   id: 5,
        //   name: '移动',
        //   iconClassName: 'icon-yidong',
        //   methodName: 'moveFile'
        // },
        // {
        //   id: 6,
        //   name: '重命名',
        //   iconClassName: 'icon-zhongmingming',
        //   methodName: 'renameFile'
        // },
        {
          id: 7,
          name: '删除',
          iconClassName: 'icon-shanchu',
          methodName: 'deleteFile'
        }
      ],
      singleMenuList: [
        {
          id: 1,
          name: '打开',
          iconClassName: 'icon-openl',
          methodName: 'menuOpen',
          count: 1
        },
        // {
        //   id: 2,
        //   name: '下载',
        //   iconClassName: 'icon-xiazai',
        //   methodName: 'menuDownload'
        // },
        // {
        //   id: 3,
        //   name: '分享',
        //   iconClassName: 'icon-fenxiang1',
        //   methodName: 'shareFile'
        // },
        // {
        //   id: 4,
        //   name: '复制',
        //   iconClassName: 'icon-fuzhi',
        //   methodName: 'copyFile'
        // },
        // {
        //   id: 5,
        //   name: '移动',
        //   iconClassName: 'icon-yidong',
        //   methodName: 'moveFile'
        // },
        {
          id: 6,
          name: '重命名',
          iconClassName: 'icon-zhongmingming',
          methodName: 'renameFile'
        }
        // {
        //   id: 7,
        //   name: '删除',
        //   iconClassName: 'icon-shanchu',
        //   methodName: 'deleteFile'
        // },
        // {
        //   id: 8,
        //   name: '彻底删除',
        //   iconClassName: 'icon-shanchu',
        //   methodName: 'deleteFileCompletely'
        // }
      ],
      orderColumn: '',
      order: ''
    }
  },
  watch: {
    pageNum: function() {
      this.getFiles()
    },
    pageSize: function() {
      this.getFiles()
    },
    onlyShowFile: function() {
      this.getFiles()
    },
    '$route.query.category': function() {
      // 加载新文件列表时重置数据为空,开始呢 加载动画
      this.fileList.length = 0
      this.sortFileList.length = 0
      this.showLoading = true
      this.total = 0
      this.pageCount = 0
      this.selectedFileCount = 0
      // 只要categoryId的值发生变化,这个方法就会被调用
      if (this.$route.query.category === 'all') {
        this.getFiles()
      } else {
        const data = {
          fileType: this.$route.query.category,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
        this.getFilesByType(data)
      }
    }
  },
  computed: {},
  created () {
    if (this.$route.query.category === undefined) {
      this.$router.push({
        path: '/manage/files',
        query: {
          category: 'all'
        }
      })
    }

    if (this.$route.query.category !== undefined) {
      this.selectedFileCount = 0
      // 只要categoryId的值发生变化,这个方法就会被调用
      if (this.$route.query.category === 'all') {
        this.fullPath = ''
        this.currentPath = ''
        this.getFiles()
        // getFiles({
        //   query: this.keyword,
        //   filePath: this.fullPath,
        //   onlyFile: this.onlyShowFile,
        //   pageNum: this.currentPage,
        //   pageSize: this.pageSize
        // }).then(res => {
        //   this.fileList = res.data.list
        //   this.total = res.data.total
        //   this.sortFileList = this.fileList.sort(this.compare('isDir', -1))
        //   // this.fileList.forEach(item => {
        //   //   item.isChecked = false
        //   // })
        // })
        // this.getFileList(this.fullPath)
      } else {
        const data = {
          fileType: this.$route.query.category,
          currentPage: this.$store.state.currentPage,
          pageCount: this.$store.state.pageCount
        }
        getFileListByType(data).then((res) => {
          if (res.code === 0) {
            this.fileList.length = 0
            this.sortFileList = 0
            this.fileList = res.data.list
            this.sortFileList = res.data.list
            this.$store.commit('updateFileList', this.fileList)
            this.selectedFile = new Array(this.fileList.length).fill(false)
          } else {
            this.$toast.error(res.msg)
          }
        })
      }
    }
  },
  mounted () {
    this.displayMode = this.$store.state.displayMode
    this.imageList = this
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
    },
    handleCurrentChange (val) {
      this.pageNum = val
    },
    changeOrder (column) {
      if (column !== this.orderColumn) {
        this.order = 'desc'
      } else {
        if (this.order == '') {
          this.order = 'desc'
        } else if (this.order == 'desc') {
          this.order = 'asc'
        } else if (this.order == 'asc') {
          this.order = 'desc'
        }
      }
      this.orderColumn = column
      this.sortFileList = this.generateNewList(this.orderColumn, this.order, this.sortFileList)
      // this.getShareLists()
    },
    /**
     * 刷新文件列表
     */
    refreshFileList () {
      this.getFiles()
    },
    getFiles () {
      getFiles({
        filePath: this.fullPath,
        query: this.searchKeyWords,
        onlyFile: this.onlyShowFile,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      ).then((res) => {
        if (res.code === 0) {
          this.fileList = res.data.list
          this.sortFileList = this.fileList.sort(this.compare('isDir', -1))
          this.total = res.data.total
          this.showLoading = false
          this.init()
        } else {
          this.$toast.error(res.msg)
        }
      })
    },
    getFilesByType () {
      getFilesByType({
        fileType: this.$route.query.category,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then((res) => {
        if (res.code === 0) {
          this.fileList = res.data.list
          this.sortFileList = res.data.list
          this.total = res.data.total
          this.showLoading = false
        } else {
          this.$toast.error(res.msg)
        }
      })
    },
    menuMethods (method) {
      this[method]()
    },
    // 打开
    menuOpen: function() {
      console.log('打开')
      const index = this.$store.state.selectFileIndex
      this.clickActions(index, this.fileList[index])
    },
    // 文件重命名
    menuRename: function() {
      console.log('重命名')
      this.renameFile()
      // bus.$emit('renameFileName', this.$store.state.fileList[this.$store.state.selectFileIndex].fileName)
    },
    // 删除文件
    menuDelete: function() {
      console.log('删除文件')
      this.deleteFile()
    },
    // 刷新页面
    menuRefresh: function() {
      if (this.$route.query.category === 'all') {
        this.getFiles()
      } else {
        this.getFilesByType(this.$route.query.category)
      }
    },
    showContentMenuType (index) {
      // const _this = this
      this.selectFileIndex = index
      this.item = this.fileList[index]
      if (this.selectedFile[index] === true) {
      } else {
        this.init()
      }
      if (this.getSelectedFileIndex(this.selectedFile, index) === index) {
        this.selectFile(index)
      } else if (this.selectedFileCount === 0) {
        this.selectFile(index)
      }
      return this.$store.state.selectFileCount
    },
    getViewer (viewer) {
      if (this.viewer) {
        this.$nextTick(() => {
          console.log(viewer)
          viewer.show()
        })
      } else { // 先定义这个变量为空，防止第一次页面加载的时候就出现遮罩层
        this.viewer = viewer
      }
    },
    getUserInfo () {
      getUserInfo().then((res) => {
        console.log(res)
        if (res.code === 0) {
          localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo))
          localStorage.setItem('userStorage', JSON.stringify(res.data.userStorage))
          this.$store.commit('updateIsLogin', true)
          this.$store.commit('updateUserInfo', res.data.userInfo)
          this.$store.commit('updateUserStorage', res.data.userStorage)
        } else {
          this.$toast.error(res.msg)
        }
      })
    },
    // 文件搜索
    search () {
      this.getFiles()
    },
    clearSearchKeyWords () {
      this.searchKeyWords = ''
      this.getFiles()
    },
    // test方法
    async test () {
    },
    init () {
      this.selectedFileCount = 0
      this.selectFileIndex = -1
      this.selectedFile = new Array(this.fileList.length).fill(false)
    },
    // 点击不同文件实现不同的功能
    clickActions: function(index, item) {
      console.log('==index:' + index + '==fileName:' + item.fileName)
      this.handleFilePreview(index, item, this.fileList)
    },
    previewImgObject (index, imageList) {
      const $viewer = viewerApi({
        options: {
          toolbar: true,
          url: 'data-source',
          initialViewIndex: index
        },
        images: imageList
      })
      console.log($viewer)
    },
    // 文件夹
    folder: function(index, fileName, e) {
      console.log('点击目录:' + fileName)
      this.$toast.success('管理员不支持文件夹打开')
      // this.enterFolder(index, '/' + fileName, e)
    },
    // 路径导航
    navigate (index) {
      const routerLength = this.$route.query.filePath.split('/').length
      // 判断点击导航是否是最后一个,即当前路径,不是最后一个则回退
      if (routerLength - 2 - index !== 0) {
        this.$router.go(-(routerLength - 2 - index))
      }
    },
    // 返回上一级目录
    back (path) {
      this.searchKeyWords = ''
      this.showLoading = true
      this.selectedFileCount = 0
      this.selectAllFiles = false
      if (path === '/') {
        // this.getFileList('/')
        this.$router.push({
          path: '/manage',
          query: {
            category: 'all'
          }
        })
        this.getFiles()
      } else {
        this.$router.go(-1)
        this.$nextTick(function() {
          // this.getFileList(this.$store.state.fullPath)
        })
      }
    },
    // 打开右键菜单
    openMenu (e, item, index) {
      this.e = e
      this.selectFileIndex = index
      this.item = this.fileList[index]
      if (this.selectedFile[index] === true) {
      } else {
        this.init()
      }
      this.menuLeft = e.screenX
      this.menuTop = e.screenY - 110
      if (this.getSelectedFileIndex(this.selectedFile, index) === index) {
        this.selectFile(index)
      } else if (this.selectedFileCount === 0) {
        this.selectFile(index)
      }
      this.showMenu = true
    },
    // 选择文件
    selectFile (index) {
      this.selectFileIndex = index
      // e.stopImmediatePropagation()
      if (this.selectAllFiles === true) {
        this.selectAllFiles = false
      }
      if (this.selectedFile[index] == false) {
        this.selectedFileCount += 1
        this.selectedFile[index] = true
        this.$store.commit('updateSelectFileCount', this.selectedFileCount)
        // 判断是否所有都选则
        if (
          this.selectedFile.filter((file) => file == true).length ===
          this.fileList.length
        ) {
          this.selectAllFiles = true
        } else {
          this.selectAllFiles = false
        }
      } else {
        this.selectedFileCount -= 1
        this.selectedFile[index] = false
        this.$store.commit('updateSelectFileCount', this.selectedFileCount)
      }

      if (this.selectedFileCount === 1) {
        this.$store.commit('updateSelectFileIndex', index)
        // 选中文件为1 且路径为空时
        if (this.$route.query.filePath === undefined) {
          this.selectFullPath = '/' + this.fileList[index].fileName
          this.$store.commit('updateSelectFullPath', this.selectFullPath)
        } else {
          // 路径不为空时
          this.selectFullPath =
            this.$route.query.filePath + '/' + this.fileList[index].fileName
          this.$store.commit('updateSelectFullPath', this.selectFullPath)
        }
        this.selectFileIndex = this.getSelectedFileIndex(
          this.selectedFile,
          true
        )
      } else {
        this.selectFileIndex = -1
      }
    },
    // 获取选中文件索引
    getSelectedFileIndex (arrays, obj) {
      let i = arrays.length
      while (i--) {
        if (arrays[i] === obj) {
          return i
        }
      }
      return false
    },
    // 选择全部文件
    selectAll (e) {
      if (this.selectAllFiles === true) {
        // 取消选中所有
        this.selectedFileCount = 0
        this.$store.commit('updateSelectFileCount', this.fileList.length)
        this.selectedFile = new Array(this.fileList.length).fill(false)
      } else {
        this.selectedFileCount = this.fileList.length
        this.$store.commit('updateSelectFileCount', this.fileList.length)
        this.selectedFile = new Array(this.fileList.length).fill(true)
      }
      this.selectAllFiles = !this.selectAllFiles
    },
    /**
     * 打开目录
     * @param index 选择的文件索引
     * @param path 当前选中的文件目录 如根目录下的 '我的音乐'为 '/我的音乐'
     * @param e 点击事件
     */
    enterFolder (index, path) {
      this.$toast.success('管理员不支持打开目录')
      return
      // eslint-disable-next-line no-unreachable
      this.showLoading = true
      this.selectedFileCount = 0
      this.selectAllFiles = false
      var prePath = ''
      // 在根目录下 目录前缀为 '/',则重置前缀为空,由于参数path是带 '/'的,防止目录多一个'/'
      if (this.$store.state.fullPath === '/') {
        prePath = ''
      } else {
        prePath = this.$store.state.fullPath
      }
      this.fullPath = prePath + path
      this.currentPath = path
      // console.log('fullPath:' + this.fullPath)
      // console.log('currentPath:' + this.currentPath)
      this.$router.push({
        path: '/manage',
        query: {
          category: 'all',
          filePath: this.fullPath
        }
      })
    },
    // 腾讯文件审核
    cosAudit () {
      this.$toast.success('获取文件审核结果中,请稍后...', -1)
      getCosFileAudit({
        id: this.fileList[this.selectFileIndex].id,
        detectUrl: Config.serverPort ? this.getImageCompleteUrl(this.fileList[this.selectFileIndex]) : ''
      }).then(res => {
        if (res.code === 0) {
          if (res.data.status === 1) {
            Bus.$emit('toastMsg', '文件: ' + this.fileList[this.selectFileIndex] + ' 审核状态: 通过')
            // this.$toast.success(res.msg + ' 审核状态: 通过')
          } else {
            Bus.$emit('toastMsg', res.msg + ' 审核状态: 通过')
            this.$toast.success('文件: ' + this.fileList[this.selectFileIndex] + ' 审核状态: 不通过')
          }
          Bus.$emit('closeToast', false)
        }
        console.log(res)
      })
    },
    // 重命名文件
    renameFile () {
      this.$bus.$emit('sendOperationFile', this.fileList[this.selectFileIndex])
      this.$store.commit('updateRenameFileName', this.fileList[this.selectFileIndex].fileName)
      Bus.$emit('fileName', this.fileList[this.selectFileIndex].fileName)
      this.$confirmBox({
        title: '重命名文件',
        showType: 3,
        file: this.fileList[this.selectFileIndex],
        operation: 'rename'
      })
        .then((res) => {
          console.log(res)
          // var fileName = this.fileList[this.selectFileIndex].fileExt !== null
          //   ? this.$store.state.renameFileName + '.' + this.fileList[this.selectFileIndex].fileExt : this.$store.state.renameFileName
          if (res.fileName <= 0) {
            this.$toast.error('文件名不能为空')
            return
          }
          const data = {
            fileId: this.fileList[this.selectFileIndex].id,
            fileName: res.fileName,
            filePath: res.filePath
          }
          renameFile(data).then((res) => {
            console.log(res)
            if (res.code === 0) {
              this.getFileList(this.fullPath, true)
              this.$toast.success(res.msg)
            } else {
              this.$toast.error(res.msg)
            }
          })
        })
        .catch(() => {
          console.log('取消')
        })
    },
    // 删除文件 单个
    deleteFile () {
      this.$confirmBox({
        title: '删除文件',
        msg: '确定删除这' + this.$store.state.selectFileCount + '个项目吗',
        showType: 0
      })
        .then(() => {
          console.log('确认删除')
          if (this.selectedFileCount === 1) {
            const data = {
              id: this.fileList[this.selectFileIndex].id
            }
            deleteFile(data).then((res) => {
              console.log(res)
              if (res.code === 0) {
                this.init()
                this.$store.commit('updateUserStorage', res.data.userStorage)
                if (this.$route.query.category === 'all') {
                  this.getFileList(this.fullPath, true)
                } else {
                  this.getFileListByType(this.$route.query.category)
                }
                this.$toast.success('删除成功')
              } else {
                this.$toast.error(res.msg)
              }
            })
          } else {
            // 批量删除
            // const data = {
            //   // this.selectFileIdList
            //   // filePath: this.filePath,
            // }
            batchDeleteFile(this.selectFileIdList).then((res) => {
              console.log(res)
              if (res.code === 0) {
                this.getFileList(this.fullPath, true)
                this.selectedFile = new Array(this.fileList.length).fill(false)
                this.$toast.success('删除成功')
              } else {
                this.$toast.error(res.msg)
              }
            })
          }
        })
        .catch(() => {
          console.log('取消删除')
        })
    },
    // 删除文件(回收站)
    deleteFileComplete () {
      deleteRecycleFile({
        id: this.fileList[this.selectFileIndex].id
      }).then((res) => {
        console.log(res)
        if (res.code === 0) {
          this.getFileList(this.fullPath, true)
          this.selectedFile = new Array(this.fileList.length).fill(false)
          this.$toast.success('删除成功')
        } else {
          this.$toast.error(res.msg)
        }
      })
    },
    // 文件展示方式
    selectDisplayMode (mode) {
      if (mode == 'block') {
        this.displayMode = 'list'
        window.localStorage.setItem('display', 'list')
        this.$store.commit('updateDisplayMode', 'list')
      } else if (mode == 'list') {
        this.displayMode = 'block'
        window.localStorage.setItem('display', 'block')
        this.$store.commit('updateDisplayMode', 'block')
      }
    },
    toolOperation: function(itemMethods) {
      this[itemMethods]()
    },
    fileOption: function(itemMethods) {
      this[itemMethods]()
    },
    // 获取文件列表(通过文件分类)
    async getFileListByType (type) {
      const data = {
        fileType: this.$route.query.category,
        currentPage: this.$store.state.currentPage,
        pageCount: this.$store.state.pageCount
      }
      getFileListByType(data).then((res) => {
        console.log(res)
        if (res.code === 0) {
          this.fileList.length = 0
          this.sortFileList = 0
          this.fileList = res.data.list
          this.sortFileList = res.data.list
          this.$store.commit('updateFileList', this.fileList)
          this.selectedFile = new Array(this.fileList.length).fill(false)
          // this.pageData.total = res.data.total
          // this.loading = false
          // 计算总页数
          // 关闭动画
          this.showLoading = false
          if (this.total === 0) {
            this.total = res.data.total
            this.pageCount = Math.ceil(this.total / this.$store.state.pageSize)
            console.log('总页数' + this.pageCount)
          }
        } else {
          this.$toast.error(res.msg)
          this.showLoading = false
          this.$toast.error(res.msg)
        }
      })
    },
    changeAudit: function(item) {
      updateFileAudit({
        audit: this.fileList[this.selectFileIndex].audit === 1 ? -1 : 1,
        fileId: this.fileList[this.selectFileIndex].id
      }).then((res) => {
        console.log(res)
        if (res.code === 0) {
          this.$toast.success('操作成功')
          this.getFiles()
        } else {
          this.$toast.error(res.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.table__body {
  height: calc(100% - 60px);
}

.audit {
  color: #00b3ff;
}
</style>
