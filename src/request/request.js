import axios from 'axios'
import qs from 'qs'

export function request(url, params, method, type, header) {
  const instance = axios.create({
    // baseURL: '/api',
    timeout: 100000,
    withCredentials: true
  })

  // axios拦截器
  instance.interceptors.request.use((config) => {
    return config
  })
  // 响应拦截器
  instance.interceptors.response.use(
    (response) => {
      if (response.status === 200) {
        return Promise.resolve(response.data)
      }
    },
    // 服务器状态码不是200的情况
    (error) => {
      if (error.response.status) {
        switch (error.response.status) {
          // case 404:
          //   Message.warning('接口不存在，请刷新重试或联系管理员')
          //   break
          // case 401:
          //   loginTip()
          //   break
          // case 500:
          //   Message.error('服务异常，请稍后刷新重试或联系管理员')
          //   break
          // case 502:
          //   Message.error('服务异常，请稍后刷新重试或联系管理员')
          //   break
          default:
            return Promise.reject(error.response)
        }
      }
    }
  )

  if (method && method == 'post') {
    if (type && type == 'params') {
      if (params) {
        // return instance.post(url, params)
        if (header == 'json') {
          return instance.request({
            url,
            data: params,
            method: 'post',
            headers: {
              'Content-Type': 'application/json;charset=UTF-8'
            }
          })
        } else if (type == 'paramsSerializer') {
          return instance.request({
            url,
            data: qs.stringify(params, { arrayFormat: 'repeat' }),
            method: 'post'
          })
        } else {
          return instance.request({
            url,
            data: params,
            method: 'post'
          })
        }
      } else {
        return instance.post(url)
      }
    } else {
      // resful的形式
      if (params) {
        for (var key in params) {
          // 拼接url
          url = url + '/' + params[key]
        }
      }
      return instance.post(url)
    }
  } else if (!method || method == 'get') {
    if (type == 'resful' || !type) {
      // resful的形式
      if (params) {
        for (key in params) {
          // 拼接url
          url = url + '/' + params[key]
        }
      }
      return instance.get(url)
    } else if (type == 'params') {
      params = {
        params: params
      }
      return instance.get(url, params)
    }
  } else if (method && method == 'put') {
    if (params) {
      return instance.put(url, params)
    } else {
      return instance.put(url)
    }
  } else if (method && method == 'delete') {
    // resful的形式
    if (params) {
      for (key in params) {
        // 拼接url
        url = url + '/' + params[key]
      }
    }
    return instance.delete(url)
  }
}
