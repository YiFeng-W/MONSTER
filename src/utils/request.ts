import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus';
const ElAlert = (message: string, cb?: any) => {
  ElMessageBox.alert(message, '提示', {
    type: 'error',
    confirmButtonText: '确定',
    callback: () => cb && cb()
  })
}
axios.defaults.withCredentials = true
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  timeout: 60000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // if (!config.headers['Authorization']) {
    //   config.headers['Authorization'] = `${window.localStorage.getItem('Authorization') || ''}`;
    // }
    return config;
  },
  err => Promise.reject(err)
)

// response interceptor
service.interceptors.response.use(
  response => {
    const ErrorCode = response.data.Error?.ErrorCode
    if (ErrorCode === 0) {
      ElMessage.error('未知错误。')
      return Promise.reject(new Error('error'))
    } else if (ErrorCode === 1) {
      ElMessage.error('系统错误，请稍后再试。')
      return Promise.reject(new Error('error'))
    } else if (ErrorCode === 2) {
      ElMessage.error('非法的输入参数，请检查后重新提交。')
      return Promise.reject(new Error('error'))
    } else if (ErrorCode === 3) {
      ElAlert('指定数据不存在。')
      return Promise.reject(new Error('error'))
    } else if (ErrorCode === 4) {
      ElAlert('无法完成此操作。')
      return Promise.reject(new Error('error'))
    } else if (ErrorCode === 5) {
      ElAlert('数量超限。')
      return Promise.reject(new Error('error'))
    } else if (ErrorCode === 1001) {
      ElAlert('当前账号状态异常。', () => location.href = '/')
      return Promise.reject(new Error('error'))
    } else if (ErrorCode === 1004) {
      ElAlert('重置代理账户过于频繁。')
      return Promise.reject(new Error('error'))
    } else if (ErrorCode === 2001) {
      ElAlert('当前无可用代理服务器。')
      return Promise.reject(new Error('error'))
    } else if (ErrorCode === 3001) {
      ElAlert('存在未完成支付的订单，请至订单页面取消或完成支付。', () => location.href = '/')
      return Promise.reject(new Error('error'))
    } else if (ErrorCode === 3002) {
      ElAlert('订单数量已超过限额，请联系工作人员处理。')
      return Promise.reject(new Error('error'))
    } else if (ErrorCode === 3003) {
      ElAlert('订单状态异常，请刷新页面后重试', () => location.href = '/')
      return Promise.reject(new Error('error'))
    } else if (ErrorCode === 3004) {
      ElAlert('优惠券状态异常，无法完成购买。')
      return Promise.reject(new Error('error'))
    } else {
      return response.data.Entity;
    }
  }, error => {
    const status = error.response.status
    if (status === 400) {
      ElMessage.error('系统错误。')
    } else if (status === 429) {
      ElAlert('操作过于频繁，请稍后再试。', () => location.href = '/')
    } else if (status === 401) {
      const url = decodeURIComponent(location.href)
      ElAlert('请重新登录。', () => location.href = `https://api.monsterproxies.com/login?returnUrl=${url}`)
    }
  })

export default service;
