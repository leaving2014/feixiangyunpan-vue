<template>
  <div class="user-main">
    <div class="user-main__tip">
      <div class="text">
        <!--<span>用户搜索:  </span>-->
        <el-input
          placeholder="请输入搜索内容"
          v-model="keyword"
          @clear="clearSearchKeyWords"
          @keyup.enter.native="search"
          clearable>
        </el-input>
      </div>

    </div>

    <div class="user-main__title">
      <div class="name">全部文件</div>
      <div class="count">已全部加载,共 {{ userList.length }} 个</div>
    </div>

    <div class="container" id="user-list">
      <!--列表-->
      <div class="table user-list is-show-header">
        <div class="table__header">
          <table class="table__header-table">
            <colgroup>
              <col width="3%" />
              <col width="30%" />
              <col width="15%" />
              <col width="20%" />
              <col width="15%" />
              <col width="15%" />
            </colgroup>
            <thead>
            <tr class="table__header-row">
              <th class="text-center table__header-select">
                <label
                  class="u-checkbox file-grid-list__select-all"
                  :class="selectAllUser === true ? 'is-checked' : ''"
                >
                    <span
                      class="u-checkbox__input"
                      :class="selectAllUser === true ? 'is-checked' : ''"
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
                </label>
              </th>
              <th class="table__header-th">
                <div class="text-ellip content inline-block-v-middle" @click="changeOrder('userName')">
                  <section class="user-list__name_header">
                      <span>{{
                          selectedCount > 0
                            ? '已选择' + selectedCount + '个用户'
                            : '用户'
                        }}</span>
                  </section>
                  <div class="nd-sort" v-show="orderColumn=='userName'">
                    <i class="iconfont icon icon-shangsanjiaoxing"
                       :class="order==='asc'?'active':''"></i>
                    <i class="iconfont icon icon-xiasanjiaoxing"
                       :class="order==='desc'?'active':''"></i>
                  </div>
                </div>
              </th>
              <!--<th class="table__header-th">-->
              <!--  <div class="text-ellip content inline-block-v-middle">-->
              <!--    <section class="user-list__name_header">-->
              <!--      <span>用户名</span>-->
              <!--    </section>-->
              <!--  </div>-->
              <!--</th>-->
              <th class="table__header-th">
                <div class="text-ellip content inline-block-v-middle" @click="changeOrder('nickName')">
                  <section class="user-list__name_header">
                    <span>用户昵称</span>
                  </section>
                  <div class="nd-sort" v-show="orderColumn=='nickName'">
                    <i class="iconfont icon icon-shangsanjiaoxing"
                       :class="order==='asc'?'active':''"></i>
                    <i class="iconfont icon icon-xiasanjiaoxing"
                       :class="order==='desc'?'active':''"></i>
                  </div>
                </div>
              </th>
              <th class="table__header-th">
                <div class="text-ellip content inline-block-v-middle" @click="changeOrder('status')">
                  <section class="user-list__name_header">
                    <span>状态</span>
                  </section>
                  <div class="nd-sort" v-show="orderColumn=='status'">
                    <i class="iconfont icon icon-shangsanjiaoxing"
                       :class="order==='asc'?'active':''"></i>
                    <i class="iconfont icon icon-xiasanjiaoxing"
                       :class="order==='desc'?'active':''"></i>
                  </div>
                </div>
              </th>
              <th class="table__header-th">
                <div class="text-ellip content inline-block-v-middle">
                  <section class="user-list__name_header">
                    <span>手机号</span>
                  </section>
                </div>
              </th>
              <th class="table__header-th">
                <div class="text-ellip content inline-block-v-middle">
                  <section class="user-list__name_header">
                    <span>电子邮箱</span>
                  </section>
                </div>
              </th>
            </tr>
            </thead>
          </table>
        </div>
        <!--数据显示主体-->
        <div class="table__body" v-if="userList.length > 0">
          <table class="table__body-table">
            <colgroup>
              <col width="3%" />
              <col width="30%" />
              <col width="15%" />
              <col width="20%" />
              <col width="15%" />
              <col width="15%" />
            </colgroup>
            <tbody>
            <tr
              class="table__body-row"
              :class="selectedUser[index] === true ? 'selected' : ''"
              @click.stop="selectUser(index, $event)"
              v-contextmenu:contextmenu
              :index="index"
              @contextmenu.prevent="openMenu($event, item, index)"
              v-for="(item, index) in userList"
              :key="index"
              :sid="item.batchNum"
            >
              <td class="text-center">
                <label
                  class="u-checkbox"
                  :class="selectedUser[index] === true ? 'is-checked' : ''"
                >
                    <span
                      class="u-checkbox__input"
                      :class="selectedUser[index] === true ? 'is-checked' : ''"
                    >
                      <span class="u-checkbox__inner"></span>
                      <input
                        type="checkbox"
                        aria-hidden="false"
                        @click="selectUser(index, $event)"
                        class="u-checkbox__original"
                        value=""
                      />
                    </span>
                </label>
              </td>
              <td class="text-ellip table__td">
                <div class="list-name user-list__list-title" style="padding-left: 0">
                  <div class="pointer-events-all cursor-p" draggable="true">
                    <img
                      :src="getStaticPicUrl(item.avatar)"
                      class="list-name__title-icon img-before-icon iconfont icon-pure-color"
                    />
                    <a
                      class="list-name__title-text inline-block-v-middle text-ellip"
                      title=""
                    >{{ item.userName }}</a
                    >
                  </div>
                </div>
              </td>
              <!--<td class="text-ellip table__td normal-column">-->
              <!--  <section class="column-content-hide" style="text-align: left">-->
              <!--      <span>{{-->
              <!--          item.userName-->
              <!--        }}</span>-->
              <!--  </section>-->
              <!--</td>-->
              <td class="text-ellip table__td normal-column">
                <section class="column-content-hide" style="text-align: left">
                    <span>{{
                        item.nickName
                      }}</span>
                </section>
              </td>
              <td class="text-ellip table__td normal-column">
                <div class="user-list__list-title user-deletetime-column">
                  <p class="column-content-hide" :class="item.status === 0?'normal':'exception'">
                    {{ item.status === 0 ? '正常' : '已封禁'
                    }}</p>
                  <div
                    class="column-content-show user-deletetime-column__actions theme-primary-text"
                    style="display: none"
                  >
                    <section class="inline-block-v-middle">
                      <i
                        class="u-icon u-icon-recovery is-restore"
                        title="还原"
                      ></i>
                      解除封禁
                    </section>
                    <section class="inline-block-v-middle pdl10">
                      <i class="u-icon u-icon-delete is-delete"></i>
                      封禁用户
                    </section>
                  </div>
                </div>
              </td>
              <td class="text-ellip table__td normal-column">
                <div
                  class="user-list__list-title user-lefttime-column column-content-hide"
                >
                  <span>{{ item.phoneNumber }}</span>
                </div>
              </td>
              <td class="text-ellip table__td normal-column">
                <div
                  class="user-list__list-title user-lefttime-column column-content-hide"
                >
                  <span>{{ item.email }}</span>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div
          class="nd-table__body-empty"
          v-if="userList.length === 0"
          style="vertical-align: middle;margin-top: 30px"
        >
          <p class="nd-table__body-empty-text">暂无数据</p>
        </div>
      </div>

      <UserInfo
        :user-list="userList"
        :selectIndex="selectUserIndex"
        :selectedCount="selectedCount"
      ></UserInfo>

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

      <Loading v-show="loading"></Loading>
    </div>
    <v-contextmenu class="contextmenu" ref="contextmenu" style="width: 120px" v-show="selectedCount===1">
      <template>
        <v-contextmenu-item style="margin: 3px 0" @click="showEditDialog(userList[selectUserIndex].id)">
          <!--<i class="iconfont icon-wenzishibie v-contextmenu-submenu__icon" style="font-size: 14px">-->
          <!--</i>-->
          修改用户信息
        </v-contextmenu-item>
        <template v-if="selectUserIndex!==-1">
          <template v-if="userList[selectUserIndex].status === 0">
            <v-contextmenu-item style="margin: 3px 0" @click="updateUserStatus(userList[selectUserIndex])">
              <!--<i class="iconfont icon-wenzishibie v-contextmenu-submenu__icon" style="font-size: 14px">-->
              <!--</i>-->
              封禁用户
            </v-contextmenu-item>
          </template>
          <template v-if="userList[selectUserIndex].status === 1">
            <v-contextmenu-item style="margin: 3px 0" @click="updateUserStatus(userList[selectUserIndex])">
              <!--<i class="iconfont icon-wenzishibie v-contextmenu-submenu__icon" style="font-size: 14px">-->
              <!--</i>-->
              解除封禁
            </v-contextmenu-item>
          </template>
          <template>
            <v-contextmenu-item style="margin: 3px 0" @click="setRole(userList[selectUserIndex])">
              <!--<i class="iconfont icon-wenzishibie v-contextmenu-submenu__icon" style="font-size: 14px">-->
              <!--</i>-->
              分配角色
            </v-contextmenu-item>
          </template>
        </template>


      </template>
    </v-contextmenu>

    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form
        :model="editForm"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户id" v-show="false">
          <el-input v-model="editForm.id"></el-input>
        </el-form-item>

        <el-form-item label="用户名" prop="userName">
          <el-input v-model="editForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickName">
          <el-input v-model="editForm.nickName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="editForm.phoneNumber"></el-input>
        </el-form-item>

        <el-form-item label="性别" prop="sex">
          <el-select v-model="editForm.sex" default-first-option placeholder="请选择" style="margin-left: -100px">
            <el-option
              v-for="item in sexOptions"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="邮箱" prop="email">-->
        <!--  <el-input v-model="editForm.email"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="手机号" prop="mobile">-->
        <!--  <el-input v-model="editForm.mobile"></el-input>-->
        <!--</el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!--分配角色-->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
    >
      <div class="set-info">
        <div>当前的用户:{{ userInfo.userName }}</div>
        <div :role="rolesList.find(item => item.id == userInfo.role)">当前的角色:{{
            getRoleName(rolesList.find(item => item.id == userInfo.role))
          }}
        </div>
        <div>
          <div>
            <span style="margin-top: 20px;line-height: 60px">分配新角色:</span>
            <el-select v-model="selectedRoleId" placeholder="请选择">
              <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.role"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>

        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!--菜单-->
    <!--<ContextMenu-->
    <!--  :left="menuLeft"-->
    <!--  :top="menuTop"-->
    <!--  v-show="showMenu"-->
    <!--  :selectedUser="selectedUser"-->
    <!--  :file="userList[this.selectUserIndex]"-->
    <!--  :count="selectedCount"-->
    <!--&gt;</ContextMenu>-->
  </div>
</template>

<script>
import { changeUserStatus, getRoleList, getUserDetail, getUserList, updateUser } from '@/request/manage'
import UserInfo from '@/components/manage/userInfo/UserInfo'
import Loading from '@/components/common/loading/Loading'

export default {
  name: 'UserManage',
  props: {},
  components: {
    UserInfo,
    Loading
  },
  data () {
    return {
      editForm: {},
      sexOptions: [
        {
          id: 0,
          label: '男'
        },
        {
          id: 1,
          label: '女'
        },
        {
          id: 2,
          label: '未知'
        }
      ],
      editDialogVisible: false,
      userList: [],
      selectUserIndex: -1,
      selectedCount: 0,
      showDialog: false,
      selectedUser: [],
      selectAllUser: false,
      // 右键菜单
      showMenu: false,
      visible: false,
      // 右键菜单弹窗左边距离
      menuLeft: 0,
      // 右键菜单弹窗上边距离
      menuTop: 0,
      menuUserIndex: -1,
      loading: true,
      pageNum: 1,
      currentPage: 1,
      pageSize: 20,
      total: 0,
      keyword: '',
      setRoleDialogVisible: false,
      selectedRoleId: '',
      rolesList: [],
      userInfo: {},
      orderColumn: '',
      order: ''

    }
  },
  watch: {
    pageNum: function(val) {
      this.getUserList()
    },
    pageSize: function(val) {
      this.getUserList()
    }
  },
  computed: {},
  created () {
    this.getUserList()
  },
  mounted () {
  },
  methods: {
    init () {
      this.selectedCount = 0
      this.selectUserIndex = -1
      this.selectedUser = new Array(this.userList.length).fill(false)
    },
    handleSizeChange (val) {
      this.pageSize = val
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      this.pageNum = val
      console.log(`当前页: ${val}`)
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

      console.log('this.order', this.order)
      this.userList = this.generateNewList(this.orderColumn, this.order, this.userList)
      // this.getShareLists()
    },
    search () {
      this.pageNum = 1
      this.getUserList()
    },
    clearSearchKeyWords () {
      this.keyword = ''
      this.getUserList()
    },
    async showEditDialog (id) {
      // console.log(id)
      getUserDetail({ id: id }).then(res => {
        if (res.code === 0) {
          this.editDialogVisible = true
          this.editForm = res.data
        } else {
          this.$message.error('获取用户信息失败')
        }
      })
    },
    editUserInfo (user) {
      this.showDialog = true
      this.editDialogVisible = true
      this.userInfo = user
      updateUser(this.editForm).then(res => {
        if (res.code === 0) {
          this.$message.success('修改成功')
          this.editDialogVisible = false
          this.getUserList()
        } else {
          this.$message.error('修改失败')
        }
      })
    },
    getUserList () {
      getUserList({
        query: this.keyword,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        this.userList = res.data.list
        this.total = res.data.total
        this.init()
        this.loading = false
      })
    },
    selectUser (index, e) {
      if (this.selectAllUser === true) {
        this.selectAllUser = false
      }
      if (this.selectedUser[index] === false) {
        this.selectedCount += 1
        this.selectedUser[index] = true
        this.$store.commit('updateSelectUserCount', this.selectedCount)
        // 判断是否所有都选则
        if (
          this.selectedUser.filter((user) => user == true).length ===
          this.userList.length
        ) {
          this.selectAllUser = true
        } else {
          this.selectAllUser = false
        }
      } else {
        this.selectedCount -= 1
        this.selectedUser[index] = false
        this.$store.commit('updateSelectUserCount', this.selectedCount)
      }
      if (this.selectedCount === 1) {
        this.selectUserIndex = this.getSelectedIndex(
          this.selectedUser,
          true
        )
      } else {
        this.selectUserIndex = -1
      }
      console.log('this.selectedUser', this.selectedUser)
    },
    openMenu (e, item, index) {
      if (this.selectedUser[index] === true) {
      } else {
        this.init()
      }
      this.menuUserIndex = e.target
        .closest('.table__body-row')
        .getAttribute('index')
      this.rightClickItem = item
      this.menuLeft = e.screenX - 190
      this.menuTop = e.screenY - 160
      this.showMenu = true
      if (this.getSelectedIndex(this.selectedUser, index) === index) {
        this.selectUser(index, e)
      } else if (this.selectedCount === 0) {
        this.selectUser(index, e)
      }
    },
    closeMenu () {
      this.showMenu = false
    },
    getSelectedIndex (arrays, obj) {
      var i = arrays.length
      while (i--) {
        if (arrays[i] === obj) {
          return i
        }
      }
      return false
    },
    // 选择所有文件
    selectAll (e) {
      if (this.selectAllUser === true) {
        // 取消选中所有
        this.selectedCount = 0
        this.selectedUser = new Array(this.userList.length).fill(false)
      } else {
        this.selectedCount = this.userList.length
        this.selectedUser = new Array(this.userList.length).fill(true)
      }
      this.selectAllUser = !this.selectAllUser
    },
    updateUserStatus (row) {
      changeUserStatus({
        id: row.id,
        status: row.status ? 0 : 1
      }).then(res => {
        this.getUserList()
      })
    },
    getRoleName (role) {
      return role ? role.role : '暂无角色'
    },
    async setRole (userInfo) {
      this.userInfo = userInfo
      // 在展示对话框之前获取所有角色列表
      getRoleList().then(res => {
        if (res.code === 0) {
          this.rolesList = res.data.list
          // this.rolesList = res.data.filter(item => item.id > this.userInfo.role)
          console.log(this.rolesList)
          this.setRoleDialogVisible = true
        } else {
          this.$message.error('获取角色列表失败')
        }
      })
    },
    async setRoleInfo () {
      if (!this.selectedRoleId) {
        return this.$message.error('用户没有选择角色')
      }
      updateUser({
        id: this.userInfo.id,
        role: this.selectedRoleId
      }).then(res => {
        if (res.code === 0) {
          this.userInfo.roles = res.data
          this.$message.success('更新角色成功')
        } else {
          this.$message.error('更新角色失败')
        }
      })
      await this.getUserList()
      this.setRoleDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-select {
  display: inline-block;
  left: 100px;
  //top: 10px;

  position: absolute;
}

.set-info {
  display: flex;
  justify-content: flex-start;
  flexflex-direction: column;
  align-items: flex-start;
  //margin-bottom: 20px;
  flex-direction: column;
  align-content: center;
  flex-wrap: nowrap;

  div {
    padding: 10px 0;
  }
}

.el-select {
  //float: none;
}

.user-main {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 0 20px;
  min-width: 750px;

  .user-main__tip {
    color: #666;
    padding: 10px 0;
    font-size: 12px;
    height: 56px;
    position: relative;

    .text {
      position: absolute;
      left: 0;
      max-width: 90%;
      display: inline-block;
      line-height: 36px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      //width: 400px;
      //text-align: left;
    }

    .actions {
      display: inline-block;
      position: absolute;
      right: 0;
      //width: 100px !important;

      .u-button--small,
      .u-button--small.is-round {
        padding: 9px 16px;
      }

      .u-button.is-round {
        border-radius: 20px;
        padding: 12px 36px;
      }

      .u-button--primary {
        color: #fff;
        background-color: #06a7ff;
        border-color: #06a7ff;
      }
    }
  }

  .user-main__title {
    width: calc(100% - 288px);;
    font-size: 12px;
    padding-right: 18px;
    position: relative;
    height: 40px;

    .name {
      color: #03081a;
      font-weight: 700;
      display: inline-block;
      position: absolute;
      left: 0;
    }

    .count {
      color: #afb3bf;
      display: inline-block;
      position: absolute;
      right: 0;
    }
  }

  .container {
    //height: calc(100% - 150px);

    .table td,
    .table th,
    .table tr {
      line-height: 1;
    }

    .user-list {
      height: 100%;
      width: calc(100% - 288px);
      display: inline-block;
      vertical-align: top;

      .table__body {
        height: calc(100vh - 250px);
      }

      .table__header-table {
        width: 100%;
        table-layout: fixed;

        .table__header-row {
          height: 50px;
          line-height: 50px;
          border-bottom: 1px solid #f9f9f9;
          color: #03081a;
          text-align: left;
          font-size: 12px;

          .table__header-th {
            .content {
              position: relative;
              width: 100%;
              text-align: left;

              .user-list__name_header {
                display: inline-block;
                margin-left: 8px;
                font-weight: 700;
              }
            }
          }
        }
      }

      .table__body-table {
        width: 100%;
        table-layout: fixed;
        color: #424e67;

        .table__body-row:hover {
          background-color: #fafafc;
          border-color: #fafafc;
        }

        .table__body-row.selected {
          background: #f0faff !important;
        }

        .table__body-row {
          //padding-left: 14px;
          border-bottom: 1px solid #f9f9f9;
          height: 50px;
          line-height: 50px;
          color: #03081a;
          font-size: 12px;

          .normal-column {
            font-size: 12px;
            color: #afb3bf;
            overflow: inherit;
          }

          .text-center {
            text-align: center;
          }

          .user-list__list-title .exception {
            color: #ff0000;
          }

          .user-list__list-title {
            position: relative;
            padding-right: 6.36896vw;
            line-height: 1;
            cursor: pointer;
            text-align: left;

            .list-name__title-icon {
              width: 30px;
              height: 30px;
              vertical-align: middle;
              position: relative;
              color: hsla(0, 0%, 74.1%, 0.28);
              line-height: 1;
            }

            .iconfont {
              font-size: 22px;
            }

            .list-name__title-text {
              margin-left: 6px;
            }
          }

          .column-content-hide {
          }
        }
      }
    }
  }
}
</style>
