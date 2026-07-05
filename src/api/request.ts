import axios from 'axios'

// 只需修改这里的端口
const baseUrl = 'http://localhost:8080'

const service = axios.create({
  baseURL: baseUrl,
  timeout: 10000
})

export default service