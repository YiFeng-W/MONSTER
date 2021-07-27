import axios from '../utils/request';

interface CreateOrderParams {
  PackageAmountInGB: number,
  Coupon?: string
}
interface PayOrderParams {
  PaymentType: string,
  OrderId: string
}

const $getCouponPrice = (coupon: string) => {
  return axios.get(`resi_order/v1/price?coupon=${coupon}`)
}

const $createOrder = (params: CreateOrderParams) => {
  return axios.post('resi_order/v1/create', params)
}

const $payUrl = (params: PayOrderParams) => {
  return axios.post('resi_order/v1/checkout', params)
}

const $closeOrder = (orderId: string) => {
  return axios.post(`resi_order/v1/close?orderId=${orderId}`)
}

export {
  $getCouponPrice,
  $createOrder,
  $payUrl,
  $closeOrder
}
