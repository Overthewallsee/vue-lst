import axios from 'axios'

const service = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(config => {
  return config
})

// 响应拦截器
service.interceptors.response.use(
  res => res.data,
  err => {
    return Promise.reject(err)
  }
)

export default service