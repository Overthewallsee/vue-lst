/**
 * 用户信息工具类
 */

/**
 * 获取当前用户名
 * @returns {string} 用户名
 */
export function getUserName() {
  try {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const user = JSON.parse(userStr)
      // 尝试从 user 对象中获取用户名，可能的字段名：username, name, nickname
      return user.username || user.name || user.nickname || '用户'
    } else {
      // 如果没有找到用户信息，使用默认值
      return '用户'
    }
  } catch (error) {
    console.error('解析用户信息失败:', error)
    return '用户'
  }
}

/**
 * 清除用户认证信息
 */
export function clearUserInfo() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

/**
 * 检查用户是否已登录
 * @returns {boolean} 是否已登录
 */
export function isLoggedIn() {
  try {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    return !!(token && user)
  } catch (error) {
    console.error('检查登录状态失败:', error)
    return false
  }
}

export default {
  getUserName,
  clearUserInfo,
  isLoggedIn
}