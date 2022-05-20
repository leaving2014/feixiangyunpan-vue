<template>
  <div class="excel-editor-main">
    <div class="excel-header text-elip inline-block-v-middle">
      <div class="head-title text-elip inline-block-v-middle">
        <!--{{ activeFileObj.fileName }}-->
      </div>
      <div class="header-right inline-block-v-middle">
        <!--<input id="importExcel_input"-->
        <!--       style="display: inline-block;position: absolute;right: 100px"-->
        <!--       @change="importExcel"-->
        <!--       type="file" name="file" placeholder="导入文件" />-->
        <span title="协作编辑"><i class="iconfont" @click="collaborateEdit"
                              :class="collaborate ? 'icon-siyou1' : 'icon-xietongbianji'"></i></span>

        <a :href="getDownloadFilePath(fileInfo)" title="下载">
          <i class="iconfont icon-xiazai">
          </i>
        </a>
        <i class="iconfont icon-guanbi" @click="handleClosePreview"></i>
      </div>
    </div>


    <div id="luckysheet" style="z-index: 5999">
    </div>
  </div>
</template>

<script>
import LuckyExcel from 'luckyexcel'
import {
  changeCollaborative,
  checkExcelData,
  createExcelOnline,
  exportExcel, getExcelOnlineData,
  getExcelPreview, saveExcelData,
  updateExcel
} from '@/request/file'
import Config from '@/config'

var websocket = null
var luckysheet = window.luckysheet

// import axios from 'axios'
// import { exportExcel } from './export.js'
var saveButton
var downloadButton
export default {
  name: 'ExcelEditor',
  props: {},
  components: {},
  data () {
    return {
      visible: false,
      excelFile: File,
      fileInfo: {},
      sheet: {},
      userInfo: {},
      collaborate: false,
      options: {
        container: 'luckysheet', // luckysheet为容器id
        // column: 20, // 空表格默认的列数量
        // row: 20, // 空表格默认的行数据量
        title: '新建在线文档.xlsx', // 表格标题
        lang: 'zh', // 设定表格语言
        allowEdit: true, // 作用：是否允许前台编辑
        // allowUpdate: true,
        allowCopy: true, // 是否允许拷贝
        // 允许更新
        allowUpdate: true,
        allowUndo: true, // 是否允许撤销
        // 允许编辑
        showtoolbar: true, // 是否第二列显示工具栏
        showinfobar: true, // 是否显示顶部名称栏
        showsheetbar: true, // 是否显示底部表格名称区域
        showstatisticBar: true, // 是否显示底部计数栏
        pointEdit: true, // 是否是编辑器插入表格模式
        pointEditUpdate: null, // 编辑器表格更新函数
        // myFolderUrl: "/",//作用：左上角<返回按钮的链接
        // forceCalculation: false,
        loadUrl: '',
        showBack: false,
        // updateUrl: "ws://localhost:8080/office/sheet"
        myFolderUrl: 'http://' + window.location.host + '/#/index?category=all', // 作用：左上角<返回按钮的链接
        functionButton: '<button id="saveButton" class="btn btn-primary" οnclick="clicks()" style="padding:3px 6px;font-size: 12px;margin-right: 10px;">保存</button> <button id="downloadButton" class="btn btn-primary btn-danger" style=" padding:3px 6px; font-size: 12px; margin-right: 85px;" οnclick="downExcelData()">下载</button>',
        // functionButton: '<button id="" class="btn btn-primary" style="padding:3px 6px;font-size: 12px;margin-right: 10px;">导入</button> ' +
        //   '<button class="btn btn-primary"style="padding:3px 6px;font-size: 12px;margin-right: 10px;margin-right: 150px" οnclick="downExcelData(this)">导出</button>',
        data: [
          {
            name: 'cell',
            color: '',
            index: 1,
            status: 0,
            order: 1,
            celldata: [
              {
                r: 0, // 行
                c: 0, // 列
                v: '姓名' // 值
              },
              {
                r: 1, // 行
                c: 0, // 列
                v: '张三' // 值
              },
              {
                r: 2, // 行
                c: 0, // 列
                v: '李四' // 值
              },
              {
                r: 3, // 行
                c: 0, // 列
                v: '王五' // 值
              },
              {
                r: 0,
                c: 1,
                v: '年龄'
              },
              {
                r: 1,
                c: 1,
                v: '1'
              },
              {
                r: 2,
                c: 1,
                v: '2'
              },
              {
                r: 3,
                c: 1,
                v: '3'
              }
            ],
            config: {}
          },
          {
            name: 'Sheet2',
            color: '',
            index: 1,
            status: 0,
            order: 1,
            celldata: [],
            config: {}
          },
          {
            name: 'Sheet3',
            color: '',
            index: 2,
            status: 0,
            order: 2,
            celldata: [],
            config: {}
          }
        ]
      }
    }
  },
  watch: {
    // visible (val) {
    //   if (val) {
    //     this.getExcelFile()
    //   }
    // }
  },
  computed: {
    fileId () {
      return this.$route.query.fid
    },
    type () {
      return this.$route.query.type
    },
    index () {
      return this.$route.query.index
    }
  },
  created () {
    if (this.$store.state.isLogin) {
      this.userInfo = this.$store.state.userInfo
    } else {
      this.userInfo = {
        userName: '游客'
      }
    }
    var index = this.$route.query.index
    this.fileInfo = this.$store.state.fileList[index]
    if (this.index) {
      this.init()
      console.log('打开Excel文件')
    } else {
      console.log('在线文档')
      if (this.type == 2) {
        // 创建在线文档初始化
        this.createOnlineInit()
      } else {
        // 协同编辑初始化
        this.coEditing()
      }
    }
    // 调用为Post
    // this.options.loadUrl = 'http://txcdn.leaving.top/pan/doc/jh_music.xlsx'
    // this.getFilePath(this.fileInfo)
    // this.loadSheeetData()
    // this.getFile()
  },
  mounted () {
    // 监听文件上传
    // var input = document.querySelector('input')
    // input.addEventListener('change', (event) => {
    //   this.importExcel(event)
    // })
    this.$nextTick(() => {
      setTimeout(() => {
        luckysheet = window.luckysheet
      }, 2000)
      console.log(luckysheet)
      console.log('当前编辑类型' + this.type)

      // window.luckysheet.create(this.options)
    })

    setTimeout(() => {
      // console.log(luckysheet.getluckysheetfile())
      var back = document.querySelector('.luckysheet_info_detail_back')
      saveButton = document.getElementById('saveButton')
      downloadButton = window.document.getElementById('downloadButton')
      saveButton.addEventListener('click', (e) => {
        this.saveExcel()
      })
      downloadButton.addEventListener('click', (e) => {
        this.downExcelData()
      })
      back.addEventListener('click', (e) => {
        this.handleClosePreview()
      })
    }, 4000)
    console.log('ws://' + window.location.host + '/api/push/websocket')

    // luckysheet.create(this.options)
  },
  methods: {
    createWebSocket (userId, fileId) {
      if (!websocket) {
        // return new WebSocket('ws://localhost:8080/api/ws/' + userId + '/' + fileId)
        console.log('ws://' + window.location.host + '/api/push/websocket' + userId + '/' + fileId)
        return WebSocket('ws://' + window.location.host + '/api/push/websocket?sid=' + JSON.parse(localStorage.getItem('userInfo')).userName)

        // return new WebSocket('ws://127.0.0.1:8080/api/push/websocket/' + userId + '/' + fileId)
      } else {
        return websocket
      }
    },
    /**
     * WebSocket
     */
    initWebSocket () {
      // 连接错误
      websocket.onerror = this.setErrorMessage

      // 连接成功
      websocket.onopen = this.setOnopenMessage

      // 收到消息的回调
      websocket.onmessage = this.setOnmessageMessage

      // 连接关闭的回调
      websocket.onclose = this.setOncloseMessage

      // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = this.onbeforeunload
    },
    setErrorMessage () {
      console.log('WebSocket连接发生错误   状态码：' + websocket.readyState)
    },
    setOnopenMessage () {
      console.log('WebSocket连接成功    状态码：' + websocket.readyState)
    },
    setOnmessageMessage (event) {
      // 根据服务器推送的消息做自己的业务处理
      console.log('服务端返回：' + event.data)
    },
    setOncloseMessage () {
      console.log('WebSocket连接关闭    状态码：' + websocket.readyState)
    },
    onbeforeunload () {
      this.closeWebSocket()
    },
    closeWebSocket () {
      websocket.close()
    },
    sendWebsocketInfo () {
      // 发送消息
      websocket.send('这是客户端发送的消息')
    },
    // 打开表格文件初始化
    init: function() {
      // 如果不存在fileId,则创建在线文档
      if (!this.fileId) {
        createExcelOnline().then(res => {
          this.sheet = res.data.sheet
          this.loadSheeetData()
        })
        return
      }
      var _that = this
      console.log('打开文件id', this.$route.query.fid)
      const checkData = {
        id: this.$route.query.fid
      }
      checkExcelData(checkData).then(res => {
        if (res.data.type == 'excel') {
          // 获取的是数据库json表格数据
          this.options.data = res.data.data
          this.options.title = res.data.excel.title
          this.sheet = res.data.excel
          luckysheet.create(this.options)
        } else {
          const data = {
            id: this.fileId
          }
          // 否则使用文件的base64渲染表格
          getExcelPreview(data).then(res => {
            // 这里需要将获取到的base64 转成 file
            const filetext = this.changefile(res, this.fileInfo.fileName)
            // 主要功能代码
            window.luckysheet.destroy() // 先销毁当前容器
            LuckyExcel.transformExcelToLucky(filetext, function(
              exportJson,
              luckysheetfile
            ) {
              if (exportJson.sheets == null || exportJson.sheets.length == 0) {
                this.$message.warning('读取excel文件内容失败，目前不支持xls文件!')
                return
              }
              console.log(exportJson)
              // _this.options.title = exportJson.info.name

              _that.options = {
                data: exportJson.sheets,
                title: exportJson.info.name,
                userInfo: exportJson.info.name.creator,
                container: 'luckysheet', // luckysheet为容器id
                lang: 'zh', // 中文
                index: '0', // 工作表索引
                status: '1', // 激活状态
                order: '0', // 工作表的顺序
                hide: '0', // 是否隐藏
                column: 10, // 列数
                row: 30, // 行数
                color: 'red',
                showtoolbar: true, // 是否显示工具栏
                showinfobar: true, // 是否显示顶部信息栏
                showsheetbar: true, // 是否显示底部sheet按钮
                allowEdit: true, // 是否允许前端编辑
                myFolderUrl: 'http://' + window.location.host + '/#/index?category=all', // 作用：左上角<返回按钮的链接
                functionButton: '<button id="saveButton" class="btn btn-primary" οnclick="clicks()" style="padding:3px 6px;font-size: 12px;margin-right: 10px;">保存</button> <button id="downloadButton" class="btn btn-primary btn-danger" style=" padding:3px 6px; font-size: 12px; margin-right: 85px;" οnclick="downExcelData()">下载</button>'
              }
              luckysheet.create(_that.options)
              // 获取luckysheet 所有数据
            })
          })
        }
      })
    },
    // 创建在线表格初始化
    createOnlineInit () {
      console.log('onlineInit在线文档初始化=======')
      // if (this.$route.query.co === 1) {
      //   this.getOnlineData(this.$router.query.id)
      // } else {
      //
      // }

      var _this = this
      createExcelOnline().then(res => {
        if (res.code === 0) {
          console.log(res.data)
          this.sheet = res.data.sheet
          this.$router.push({
            path: '/excel/' + this.sheet.id,
            query: {
              type: '2'
              // oid: this.fileInfo.id
            }
          })
          window.luckysheet.destroy() // 先销毁当前容器
          const checkData = {
            id: _this.sheet.id
          }
          getExcelOnlineData(checkData).then(res => {
            var options = {
              container: 'luckysheet', // luckysheet为容器id
              title: '新建在线文档.xlsx', // 设定表格名称
              lang: 'zh', // 设定表格语言
              allowEdit: true, // 作用：是否允许前台编辑
              allowUpdate: true,
              showinfobar: true, // 作用：是否显示顶部信息栏
              myFolderUrl: 'http://' + window.location.host + '/#/index?category=all', // 作用：左上角<返回按钮的链接
              functionButton: '<button id="" class="btn btn-primary" onclick="saveData()" style="padding:3px 6px;font-size: 12px;margin-right: 10px;">保存</button>  <button id="importExcelData" class="btn btn-primary" style="padding:3px 6px;font-size: 12px;margin-right: 10px;">导入</button>',
              // eslint-disable-next-line no-template-curly-in-string
              userInfo: '<i style="font-size:16px;color:#ff6a00;" class="fa fa-user-circle" aria-hidden="true">{{this.$store.state.userInfo.userName}}</i>',
              // loadUrl: loadUrl,
              updateUrl: 'ws://localhost:8080/api/push/websocket?uid=' + JSON.parse(localStorage.getItem('userInfo')).id + '&fid=' + _this.sheet.id + '&username=' + this.$store.state.userInfo.userName + '&type=2',
              gridKey: '',
              data: []
            }
            options.gridKey = _this.sheet.id
            options.title = '新建在线表格.xlsx'

            options.data = res
            // this.options.title = res.data.excel.title
            // this.sheet = res.data.excel
            // luckysheet.create(this.options)

            console.log(options)
            luckysheet.create(options)

            if ('WebSocket' in window) {
              // websocket = new WebSocket('ws://localhost:8080/api/push/websocket?sid=' + JSON.parse(localStorage.getItem('userInfo')).userName)
              // websocket = new WebSocket('ws://localhost:8080/api/push/websocket/')
              console.log('ws://' + window.location.host + '/api/push/websocket')

              websocket = new WebSocket('ws://' + window.location.hostname + ':' + Config.serverPort + '/api/push/websocket?uid=' +
                JSON.parse(localStorage.getItem('userInfo')).id + '&fid=' + _this.sheet.id + '&username=' + this.$store.state.userInfo.userName + '&type=2')

              // websocket = new WebSocket('ws://localhost:8080/api/push/websocket/' + this.$store.state.userInfo.id + '/' + this.fileInfo.id)
              // = this.createWebSocket(this.$store.state.userInfo.id, this.fileInfo.id)
              // new WebSocket('ws://localhost:8080/api/ws/' + this.$store.state.userInfo.id + '/' + this.fileInfo.id)
              this.initWebSocket()
            } else {
              this.$toast.error('当前浏览器不支持websocket')
            }
          })
          // var loadUrl1 = '/api/office/excel/online/data' + '?id=' + this.fileInfo.id
          // var loadUrl = 'http://localhost:8080/api/office/excel/online/data'
          // var socketUrl = 'ws://' + window.location.host + '/push/websocket/' +
          //   JSON.parse(localStorage.getItem('userInfo')).id + '&fid=' + this.fileInfo.id + '&username=' + this.$store.state.userInfo.userName
        }
      })
    },
    // 协同编辑初始化
    coEditing () {
      console.log('coEditing协同编辑初始化=======')
    },
    preReq () {

    },
    // 导出为SQL
    exportToSql () {

    },
    // 加载Excel文件
    getFile () {
      // 请求接口  获取参数
      const data = {
        id: this.fileInfo.id
      }
      getExcelPreview(data).then(res => {
        // 这里需要将获取到的base64 转成 file
        const filetext = this.changefile(res, this.fileInfo.fileName)
        // 主要功能代码
        window.luckysheet.destroy() // 先销毁当前容器
        LuckyExcel.transformExcelToLucky(filetext, function(
          exportJson,
          luckysheetfile
        ) {
          if (exportJson.sheets == null || exportJson.sheets.length == 0) {
            this.$message.warning('读取excel文件内容失败，目前不支持xls文件!')
            return
          }
          console.log(exportJson)
          // _this.options.title = exportJson.info.name

          window.luckysheet.create({
            container: 'luckysheet', // luckysheet is the container id
            data: exportJson.sheets,
            title: exportJson.info.name,
            userInfo: exportJson.info.name.creator,
            lang: 'zh', // 设定表格语言
            allowEdit: true, // 作用：是否允许前台编辑
            // allowUpdate: true,
            allowCopy: true, // 是否允许拷贝
            showtoolbar: true, // 是否第二列显示工具栏
            showinfobar: true, // 是否显示顶部名称栏
            showsheetbar: true, // 是否显示底部表格名称区域
            showstatisticBar: true, // 是否显示底部计数栏
            pointEdit: false, // 是否是编辑器插入表格模式
            pointEditUpdate: null, // 编辑器表格更新函数
            functionButton: '<button id="saveButton" class="btn btn-primary" οnclick="clicks()" style="padding:3px 6px;font-size: 12px;margin-right: 10px;">保存</button> <button id="downloadButton" class="btn btn-primary btn-danger" style=" padding:3px 6px; font-size: 12px; margin-right: 85px;" οnclick="downExcelData()">下载</button>'
            // functionButton: '<button id="" class="btn btn-primary" style=" padding:3px 6px; font-size: 16px;width: 100px;height: 27px; margin-right: 85px;" οnclick="downExcelData()">導出</button>'
          })
        })
      })
      setTimeout(() => {
        saveButton = document.getElementById('saveButton')
        downloadButton = window.document.getElementById('downloadButton')
        saveButton.addEventListener('click', (e) => {
          console.log('save', e)
          this.saveExcel()
        })
        downloadButton.addEventListener('click', (e) => {
          console.log('download', e)
          this.downExcelData()
        })
      }, 2000)
      this.$nextTick(() => {

      })
    },
    changefile (dataurl, filename) {
      var bstr = window.atob(dataurl)
      var n = bstr.length

      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, {
        type: 'application/vnd.ms-excel'
      })
    },
    loadSheetData (data) {
      console.log('加载excel数据')
      LuckyExcel.transformExcelToLucky(data, function(exportJson, luckysheetfile) {
        if (exportJson.sheets == null || exportJson.sheets.length == 0) {
          alert('Failed to read the content of the excel file, currently does not support xls files!')
          return
        }
        console.log(exportJson, luckysheetfile)
        window.luckysheet.destroy()

        window.luckysheet.create({
          container: 'luckysheet', // luckysheet is the container id
          lang: 'zh', // 设定表格语言
          allowEdit: true, // 作用：是否允许前台编辑
          // allowUpdate: true,
          allowCopy: true, // 是否允许拷贝
          showtoolbar: true, // 是否第二列显示工具栏
          showinfobar: true, // 是否显示顶部名称栏
          showsheetbar: true, // 是否显示底部表格名称区域
          showstatisticBar: true, // 是否显示底部计数栏
          pointEdit: false, // 是否是编辑器插入表格模式
          pointEditUpdate: null, // 编辑器表格更新函数
          data: exportJson.sheets,
          title: exportJson.info.name,
          userInfo: exportJson.info.name.creator,
          functionButton: '<button id="" class="btn btn-primary" style=" padding:3px 6px; font-size: 16px;width: 100px;height: 27px; margin-right: 85px;" οnclick="downExcelData()">導出</button>'

        })
      })
    },
    loadSheeetData () {
      // this.getFilePath(this.fileInfo)
      LuckyExcel.transformExcelToLucky('http://txcdn.leaving.top/pan/doc/jh_music.xlsx', function(exportJson, luckysheetfile) {
        if (exportJson.sheets == null || exportJson.sheets.length == 0) {
          alert('Failed to read the content of the excel file, currently does not support xls files!')
          return
        }
        console.log(exportJson, luckysheetfile)
        window.luckysheet.destroy()

        window.luckysheet.create({
          container: 'luckysheet', // luckysheet is the container id
          lang: 'zh', // 设定表格语言
          allowEdit: true, // 作用：是否允许前台编辑
          // allowUpdate: true,
          allowCopy: true, // 是否允许拷贝
          showtoolbar: true, // 是否第二列显示工具栏
          showinfobar: true, // 是否显示顶部名称栏
          showsheetbar: true, // 是否显示底部表格名称区域
          showstatisticBar: true, // 是否显示底部计数栏
          pointEdit: false, // 是否是编辑器插入表格模式
          pointEditUpdate: null, // 编辑器表格更新函数
          data: exportJson.sheets,
          title: exportJson.info.name,
          userInfo: exportJson.info.name.creator,
          functionButton: '<button id="" class="btn btn-primary" style=" padding:3px 6px; font-size: 16px;width: 100px;height: 27px; margin-right: 85px;" οnclick="downExcelData()">導出</button>'

        })
      })
    },
    importExcel (event) {
      var file = event.target.files[0]
      console.log(file)
      // eslint-disable-next-line no-unused-vars
      var fileName = file.name
      console.log('导入文件名======' + fileName)
      fileName = fileName + ''
      // 將文件加載到頁面上
      LuckyExcel.transformExcelToLucky(file, function(exportJson, luckysheetfile) {
        if (exportJson.sheets == null || exportJson.sheets.length == 0) {
          alert('Failed to read the content of the excel file, currently does not support xls files!')
          return
        }
        console.log(exportJson, luckysheetfile)
        window.luckysheet.destroy()

        window.luckysheet.create({
          container: 'luckysheet', // luckysheet is the container id
          lang: 'zh', // 设定表格语言
          allowEdit: true, // 作用：是否允许前台编辑
          // allowUpdate: true,
          allowCopy: true, // 是否允许拷贝
          showtoolbar: true, // 是否第二列显示工具栏
          showinfobar: true, // 是否显示顶部名称栏
          showsheetbar: true, // 是否显示底部表格名称区域
          showstatisticBar: true, // 是否显示底部计数栏
          pointEdit: false, // 是否是编辑器插入表格模式
          pointEditUpdate: null, // 编辑器表格更新函数
          data: exportJson.sheets,
          title: exportJson.info.name,
          userInfo: exportJson.info.name.creator,
          functionButton: '<button id="" class="btn btn-primary" style=" padding:3px 6px; font-size: 16px;width: 100px;height: 27px; margin-right: 85px;" οnclick="downExcelData()">導出</button>'

        })
      })
    },
    saveExcel () {
      // var excelData = luckysheet.getAllSheets()
      // var sheetfile = luckysheet.getluckysheetfile()// 获取第一个表格的数据
      // sheetfile[0].celldata = luckysheet.transToCellData(sheetfile[0].data) // 转换数据格式，存储表格数据，便于详情展示
      // this.options.data = sheetfile[0].celldata
      // 获取luckysheet的所有数据
      var excelData = luckysheet.getAllSheets()
      console.log(excelData)
      const data = {
        data: JSON.stringify(luckysheet.getluckysheetfile()),
        // data: JSON.stringify(excelData),
        title: this.options.title,
        type: this.fileInfo !== undefined ? 1 : 2,
        id: this.fileInfo.id ? this.fileInfo.id : 0
      }
      updateExcel(data).then(res => {
        this.$message.success('保存成功')
        console.log(res)
      })
    },
    downExcelData () {
      // eslint-disable-next-line no-unused-expressions
      luckysheet.refresh
      console.log('导出excel')
      var sheetData = luckysheet.getluckysheetfile()
      var sheetData1 = luckysheet.getSheet()
      console.log(sheetData1)
      // var sheetData = luckysheet.getluckysheetfile()
      // luckysheet.getSheet()
      console.log(sheetData[0].data)

      // const data1 = { sheetData[0].data }
      const data = {
        excelData: JSON.stringify(sheetData),
        id: this.fileInfo.id
      }
      exportExcel(data).then(res => {
        if (res.code === 0) {
          this.$toast.success('导出成功')
        } else {
          this.$toast.error('导出失败')
        }
      })
    },
    downExcelData1 () {
      var sheetData = luckysheet.getSheetData()
      console.log(sheetData.toJson())
      // console.log(luckysheet.getLuckysheetfile())
      // 这里你要自己写个后台接口，处理上传上来的Excel数据，用post传输。我用的是Java后台处理导出！这里只是写了post请求的写法
      console.log('luckysheet.getAllSheets() = ' + JSON.stringify(luckysheet.getAllSheets()))
      console.log('luckysheet.getRangeValue() = ' + JSON.stringify(luckysheet.getRangeValue('A1:B3')))
      console.log('luckysheet.getRangeHtml() = ' + luckysheet.getRangeHtml())
      var jsdata = []
      var sheets = luckysheet.getAllSheets()
      for (var i = 0; i < sheets.length; i++) {
        jsdata.push({
          name: sheets[i].name,
          celldata: sheets[i].celldata,
          config: sheets[i].config,
          images: sheets[i].images,
          frozen: sheets[i].frozen,
          dataVerification: sheets[i].dataVerification
        })
      }
      console.log('JSON.stringify(jsdata) = ' + JSON.stringify(jsdata))
      var form = document.createElement('form')
      form.method = 'post'
      form.action = '/equipment/excel/downfile'
      form.style = 'display:none'
      form.enctype = 'multipart/form-data'
      document.body.appendChild(form)
      var newElement = document.createElement('textarea')
      newElement.setAttribute('type', 'hidden')
      newElement.name = 'exceldata'
      newElement.value = JSON.stringify(jsdata)
      form.appendChild(newElement)
      form.submit()
    },
    exportExcel () {
      // window.luckysheet.getAllSheets(), this.name
    },
    collaborateEdit () {
      const data = {
        id: this.sheet.id ? this.sheet.id : 0,
        fid: this.fileInfo.id,
        collaborate: this.collaborate ? 0 : 1
      }
      changeCollaborative(data).then(res => {
        if (res.code === 0) {
          this.collaborate = !this.collaborate
          this.$toast.success(res.msg)
          this.sheet = res.data.sheet
          // 新创建的在线文档将数据更新
          if (res.data.create == true) {
            console.log('新创建的在线文档将数据更新')
            console.log('excel在线文档ID====' + res.data.eid)
            const updateData = {
              id: res.data.eid,
              sheetData: JSON.stringify(luckysheet.getluckysheetfile())
            }
            saveExcelData(updateData).then(res => {
              if (res.code === 0) {
                this.$toast.success('数据同步成功')
              } else {
                this.$toast.error('数据同步失败')
              }
            })
          }
          if (res.data.status == true) {
            // http://localhost:8081/#/excel/?index=10&fid=105&type=1
            this.copyToClipboard(window.location.host + '/#excel/?fid' + this.fileInfo.id + '&author=' + this.fileInfo.userId, '复制分享链接成功')
          }
        } else {
          // this.collaborate = !this.collaborate
          this.$toast.error(res.msg)
        }
      })

      const checkData = {
        id: this.$route.query.fid
      }
      var sheetData
      checkExcelData(checkData).then(res => {
        if (res.code === 0) {
          if (res.data.excel == null) {
            // 不存在在线文档 开始创建
            sheetData = luckysheet.getluckysheetfile()
            console.log(JSON.stringify(sheetData))
          }
          this.collaborate = !this.collaborate
        } else {
          this.$toast.error('操作失败')
        }
      })

      // var input = document.createElement('input') // 直接构建input
      // // http://localhost:8081/#/excel/
      // input.value = location.host + '/#excel' + this.fileInfo.id // 设置内容
      // document.body.appendChild(input) // 添加临时实例
      // input.select() // 选择实例内容
      // document.execCommand('Copy') // 执行复制
      // document.body.removeChild(input) // 删除临时实例
      // this.$toast.success('协同编辑链接复制成功')
    },
    handleClosePreview () {
      var cellInput = document.getElementsByClassName('luckysheet-cell-input')
      var input = document.getElementsByClassName('luckysheet-input-box')
      if (input.length > 0) {
        input[0].parentNode.removeChild(input[0])
      }
      // 移除cellInput
      if (cellInput.length > 0) {
        cellInput[0].parentNode.removeChild(cellInput[0])
      }
      this.visible = false

      this.$router.go(-1)

      // this.$router.push({
      //   path: '/index',
      //   query: {
      //     category: 'all'
      //   }
      // })
    }
  }
}
</script>

<style lang="less">


.luckysheet-cols-menu {
  z-index: 9004 !important;
}

.luckysheet-input-box {
  z-index: 9000 !important;
}

.excel-editor-main {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2999;
  background-color: #2c3e50;

  .excel-header {
    //position: relative;
    width: 100%;
    height: 60px;
    border-bottom: 3px solid #878c9c;
    vertical-align: middle;
    min-width: 280px;
    background-color: #266e3d;

    .head-title {
      //position: absolute;
      left: 10px;
      width: calc(100% - 240px);
      max-width: calc(100% - 2.92826vw);
      margin-left: 20px;
      font-size: 17px;
      line-height: 60px;
      font-weight: 700;
      width: 100% -200px;
      //min-width: 220px;
      color: #fff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .header-right {
      //position: absolute;
      margin-right: 0px;
      width: 200px;
      right: 10px;
      height: 60px;
      text-align: right;
      vertical-align: baseline;

      .iconfont:hover {
        color: #06a7ff;
      }

      .icon-tishi:hover + .player-hotkey-panel-container {
        display: block !important;
      }

      .iconfont {
        color: #fff;
        cursor: pointer;
        padding: 0 15px;
      }

      .icon-xiazai {
        //margin-right: 10px;
        font-size: 20px;
        font-weight: 700;
      }

      .icon-guanbi {
        //height: 5vh;
        //line-height: 5vh;
        //margin-left: 15px;
        font-size: 20px;
        line-height: 60px;
        //position: absolute;
        //right: 20px;
      }
    }


  }

  #luckysheet {
    margin: 0px;
    padding: 0px;
    position: absolute;
    width: 100%;
    height: 95%;
    left: 0px;
    top: 60px;
  }

}
</style>
