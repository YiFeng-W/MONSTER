import axios from '../utils/request';
import { ListParams } from '../utils/interface'

const $getFlowInfo = () => {
  return axios.get('resi/v1/account')
}

const $getTableData = (params: ListParams) => {
  return axios.put('resi_order/v1/list', params)
}

export {
  $getFlowInfo,
  $getTableData
}
