import axios from '../utils/request'
const $getPool = () => {
  return axios.get('resi/v1/pool')
}

const $getRegion = (poolType: number | string) => {
  return axios.get(`resi/v1/locations?poolType=${poolType}`)
}

const $getTableData = (params: any) => {
  return axios.post('resi/v1/gen_quick', params)
}

const $resetAccount = () => {
  return axios.post('resi/v1/reset')
}

export {
  $getPool,
  $getRegion,
  $getTableData,
  $resetAccount
}
