import { get } from '@/request/http'

// export const login12 = (p) => post('/user/login1', p)
// 获取系统配置
export const getSystemConfig = () => get('/system/config')
// export const getCaptcha = (p) => get('/system/captcha', p)
