import { get, post } from '@/request/http'

// 管理员登录
export const adminLogin = (data) => post('/admin/login', data)
// 获取文件列表
export const getFiles = (p) => get('/manage/file/list', p)
// 获取文件列表根据类型
export const getFilesByType = (p) => get('/manage/file/type', p)
// 文件重命名
export const rename = (p) => post('/manage/file/rename', p)
// 文件管理
export const getFoldTree = (p) => get('/file/filetree', p)
// 刷新首页文件缓存
export const refreshFile = (p) => post('/file/refresh', p)
// 更新文件审核状态
export const updateFileAudit = (p, info) => post('/manage/file/audit', p, true)
// 获取腾讯云文件审核结果
export const getCosFileAudit = (p, info) =>
  post('/manage/file/cos/audit', p, true)
// 分享管理
export const getShareLists = (p) => get('/manage/share/list', p)
export const getShareDetail = (p) => get('/manage/share/info', p)
export const getShareUserList = (p) => get('/manage/share/userlist', p)
export const getShareUserInfo = (p) => get('/manage/share/userinfo', p)
// 删除分享
export const deleteShare = (p, info) => post('/manage/share/delete', p, true)
// 清空失效分享
export const clearShare = (p) => post('/manage/share/clear', p)

// 回收站文件管理
export const getRecycleFiles = (p) => get('/manage/recycle/list', p)
export const getRecycleInfo = (p) => get('/manage/recycle/info', p)
export const getRecycleUserList = (p) => get('/manage/recycle/userlist', p)
export const getRecycleUserInfo = (p) => get('/manage/recycle/userinfo', p)
// 删除回收站文件
export const deleteRecycleFile = (p) => post('/manage/recycle/delete', p)
// 还原回收站文件
export const restoreRecycleFile = (p) => post('/manage/recycle/recover', p)

// 用户管理
export const getUserList = (p) => get('/manage/user/list', p)
// 获取用户信息
export const getUserDetail = (p) => get('/manage/user/detail', p)
export const addUser = (p) => post('/manage/user/add', p)
export const updateUser = (p) => post('/manage/user/update', p)
export const delUser = (p) => post('/manage/user/del', p)
export const resetUserPwd = (p) => post('/manage/user/resetpwd', p)
export const changeUserStatus = (p, info) =>
  post('/manage/user/changestatus', p, true)

// 获取角色列表
export const getRoleList = (p) => get('/manage/role/list', p)
// 设置用户角色
export const setUserRole = (p) => post('/manage/user/setrole', p)
