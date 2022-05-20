// 文件模块相关接口
import { get, post } from './http'
/**
 * 以登录接口为例
 * export const login = p => post('/user/login', p);
 *
 * login ---------- 接口名称
 * p -------------- 传参,若需要在url中拼接其他信息,传参可以改为(p, other)
 * get ------------ 接口调用的方法,来自 http.js 中封装好的四个axios方法 get/post/put/axiosDelete
 * '/user/login' -- 接口url,若需要在url中拼接其他信息:
 *                  首先需要在传参处改为(p, other1, other2)
 *                  然后将url改为`/user/${other1}/login/${other2}`
 * p -------------- 传递给 get/post/put/axiosDelete 中的查询参数/请求体
 *
 *
 *
 * 除此之外,POST 请求支持请求体格式为 FormData,那么就需要多传递一个参数,true,如下示例:
 * export const example = p => post('/test/example', p, true);
 */

/**
 * 获取文件列表相关接口
 */
// 获取文件列表(区分文件路径)
export const getFileListByPath = (p) => get('/file/list', p)
// 获取文件列表(区分文件类型)
export const getFileListByType = (p) => get('/file/list/type', p)
// 获取文件列表(区分文件扩展名)
export const getFileListByExt = (p) => get('/file/list/ext', p)
// 获取离线下载文件列表
export const getOfflineFileList = (p) => get('/file/list/offline', p)
// 获取文件信息
export const getFileInfo = (p) => get('/file/info', p)
// 获取回收站文件列表
export const getRecoveryFile = (p) => get('/recycle/list', p)
// 获取我已分享的文件列表
export const getMyShareFileList = (p) => get('/share/shareList', p)
// 获取存储占用
export const getStorage = (p) => get('/user/storage', p)
// 获取文件目录树
export const getFoldTree = (p) => get('/file/filetree', p)
// 刷新首页文件缓存
export const refreshFile = (p) => post('/file/refresh', p)
/**
 * 单文件操作相关接口
 */
// 创建文件夹
export const createFolder = (p) => post('/file/createfolder', p)
// 删除文件
export const deleteFile = (p, info) => post('/file/delete', p, true)
// 复制文件
export const copyFile = (p, info) => post('/file/copy', p, info)
// 移动文件
export const moveFile = (p, info) => post('/file/move', p, true)
// 重命名文件
export const renameFile = (p, info) => post('/file/rename', p, true)
// 解压文件
export const unzipFile = (p) => post('/file/unzip', p)
// 全局搜索文件
export const searchFile = (p) => get('/file/search', p)

/**
 * 文件分享相关接口
 */
// 分享文件
export const shareFile = (p) => post('/share/create', p)
// 校验分享链接过期时间
export const checkShareLinkEndtime = (p) => get('/share/checkendtime', p)
// 获取分享文件信息
export const getShareInfo = (p) => get('/share/shareinfo', p)
// 校验分享链接是否需要提取码
export const checkShareLinkType = (p) => get('/share/sharetype', p)
// 校验分享链接提取码是否正确
export const checkShareLinkCode = (p) => get('/share/checkextractioncode', p)
// 获取分享列表
export const getShareList = (p) => get('/share/list', p)
// 获取分享文件列表
export const getShareFileList = (p) => get('/share/sharefile/list', p)
// 保存分享文件
export const saveShareFile = (p) => post('/share/savesharefile', p)
// 取消文件分享
export const cancelShareFile = (p, info) => post('/share/cancel', p, true)
// 清理分享失效文件
export const clearInvalideShare = (p) => post('/share/clearinvalid', p)

/**
 * 文件批量操作相关接口
 */
// 批量删除文件
export const batchDeleteFile = (p) => post('/file/batchdelete', p)
// 批量移动文件
export const batchMoveFile = (p) => post('/file/batchmove', p)
// 批量复制文件
export const batchCopyFile = (p) => post('/file/batchcopy', p)
/**
 * 回收站文件操作相关接口
 */
// 回收站文件删除
export const deleteRecoveryFile = (p) => post('/recycle/delete', p)
// 回收站文件还原
export const restoreRecoveryFile = (p) => post('/recycle/restore', p)
export const clearRecoveryFile = (p) => post('/recycle/clearall', p)
// 回收站文件批量删除
export const batchDeleteRecoveryFile = (p) =>
  post('/recoveryfile/batchdelete', p)

/**
 * 文件公共接口
 */
// 文件预览
export const getFilePreview = (p) => get('/filetransfer/preview/document', p)
// 文件修改
export const modifyFileContent = (p) => post('/file/update', p)

export const getVideoStream = (p, info) =>
  get('/filetransfer/preview/video/stream', p, true)

export const getFile = (p) => get('/filetransfer/download', p)

/**
 * office操作接口
 */
export const getExcelInfo = (p, info) => post('/office/excel/info', p, true)
export const changeCollaborative = (p, info) =>
  post('/office/excel/collaborate', p, true)
export const createExcelOnline = (p, info) =>
  post('/office/excel/create/online', p, true)
export const getExcelOnlineData = (p, info) =>
  post('/office/excel/online/data', p, true)
// 获取Excel文件内容 base64编码
export const getExcelPreview = (p) => get('/office/excel/data', p)
export const checkExcelData = (p) => get('/office/excel/check', p)
export const saveExcelData = (p, info) => post('/office/excel/save', p, true)
export const updateExcel = (p, info) => post('/office/excel/update', p, true)
export const exportExcel = (p, info) => post('/office/excel/export', p, true)

/**
 * 离线下载
 */
// 创建离线下载
export const createOffline = (p, info) => post('/offline/new', p, true)
// 获取离线下载进度
export const getDownloadProgress = (p) => get('/cloud/progress', p)

/**
 * 文件工具接口
 */

// 图片工具
// 文字识别 参数为图片文件
export const imageOcrByMultipartFile = (p) => post('/image/ocr/file', p)
// 文字识别 参数为文件id
export const imageOcr = (p) => get('/image/ocr', p)
// 获取清理文件列表
export const getClearFile = (p) => get('/file/clear/list', p)

// 文件格式转换
export const formatconversion = (p, info) =>
  post('/filetransfer/formatconversion', p, true)

// 获取文件操作的实时进度
export const getProgress = (p) => post('/file/progress', p)
// cos创建文件夹
export const createCosFolder = (p, info) => post('/cos//create/folder', p, true)
