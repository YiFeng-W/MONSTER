<template>
  <div class="plan">
    <div class="item default__shadow" v-for="item in planList" :key="item">
      <div class="item__title">{{ item }}G PLAN</div>
      <div class="item__content">
        <div class="item__desc">
          800+Million IP Pool Rotating and Static IPs User:Pass Authenticated
          Supports 160+ Country and City Locations Unmetered bandwidth Email
          Support 24x7 Support
        </div>

        <div class="item__price">
          价格: $<span class="item__amount">{{ item * AmountPerGBInUSD }}</span>
        </div>
        <div class="item__btn">
          <el-button type="primary" size="medium" @click="handlePurchase(item)"
            >Purchase Now</el-button
          >
        </div>
      </div>
    </div>
    <el-dialog
      title="Purchase"
      v-model="dialogVisible"
      width="500px"
      :before-close="handleClose"
    >
      <el-form label-position="right" label-width="80px" :model="purchaseForm">
        <el-form-item label="Quantity">
          <el-input-number style="width: 100%;" v-model="purchaseForm.quantity" @change="ProxyQuantityInputHandle" controls-position="right" :min="1" :step="1" :step-strictly="true"></el-input-number>
        </el-form-item>
        <el-form-item label="Pay Type">
          <el-select v-model="purchaseForm.payType" style="width: 100%;">
            <el-option label="支付宝" value="alipay"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Coupon">
          <el-input v-model="purchaseForm.coupon" placeholder="测试Coupon为1234，或为空">
            <template #append>
              <el-button type="primary"
              style="border-radius:0;color:#FFF;background-color:#409EFF;border-color:#409EFF;"
              @click="checkCoupon">Apply</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="Price">
          <span style="font-size: 20px;font-weight: bold;">${{ totalPrice }}</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="submitOrder" :loading="submitLoading" style="width: 100%;" type="primary">Submit Order</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
// import { ElNotification } from 'element-plus'
import { $getCouponPrice, $createOrder, $payUrl } from '../api/plan'

export default defineComponent({
  setup() {
    // 静态数据
    const planList = [5, 10, 20]
    // let ELNOTIS: any = {
    //   close: () => null
    // }

    const _AmountPerGBInUSD = Number(localStorage.getItem('AmountPerGBInUSD'))
    const AmountPerGBInUSD = ref(_AmountPerGBInUSD)
    const couponID = ref('')
    const ProxyQuantityInputHandle = (e: any) => {
      e = Number((e + '').replace(/[^\d]/g, '')) || 1
      purchaseForm.value.quantity = e
    }
    const totalPrice = computed(() => {
      return purchaseForm.value.quantity * purchaseForm.value.AmountPerGBInUSD
    })
    // 弹窗逻辑
    const dialogVisible = ref(false)
    const handlePurchase = (plan: any) => {
      dialogVisible.value = true
      purchaseForm.value.quantity = plan
    }
    const handleClose = () => {
      dialogVisible.value = false
      purchaseForm.value = {
        quantity: 0,
        payType: 'alipay',
        AmountPerGBInUSD: AmountPerGBInUSD.value,
        coupon: ''
      }
      couponID.value = ''
    }

    // 表单逻辑
    const submitLoading = ref(false)
    const purchaseForm = ref({
      quantity: 0,
      AmountPerGBInUSD: AmountPerGBInUSD.value,
      payType: 'alipay',
      coupon: ''
    })
    const checkCoupon = () => {
      const couponStr = purchaseForm.value.coupon + ''
      $getCouponPrice(couponStr).then((data: any) => {
        purchaseForm.value.AmountPerGBInUSD = data.AmountPerGBInUSD
      })
    }
    const submitOrder = async () => {
      submitLoading.value = true
      const OrderId: any = await $createOrder({
        PackageAmountInGB: purchaseForm.value.quantity,
        Coupon: purchaseForm.value.coupon
      })
      const payInfo: any = await $payUrl({
        PaymentType: 'AliPay',
        OrderId: OrderId
      })
      submitLoading.value = false
      dialogVisible.value = false
      console.log(payInfo.Data)
      window.open(payInfo.Data)
    }
    return {
      AmountPerGBInUSD,
      planList,
      totalPrice,
      handlePurchase,
      dialogVisible,
      purchaseForm,
      ProxyQuantityInputHandle,
      checkCoupon,
      submitLoading,
      submitOrder,
      handleClose
    };
  }
});
</script>

<style lang="less">
.plan {
  padding: 36px 122px;
  display: flex;
  justify-content: space-around;
}

.item {
  width: 30%;
  min-width: 300px;
  // border: dashed 1px #eef0f5;
  background: #ffffff;
  border-radius: 0;
  &__title {
    padding: 28px;
    background: #5c99ff;
    font-size: 24px;
    color: #ffffff;
    font-weight: bold;
  }
  &__content {
    padding: 24px 20% 50px;
    font-size: 14px;
    line-height: 35px;
    color: #272a32;
    border: 1px solid #eef0f5;
  }
  &__desc {
    padding: 0 24px 24px;
    margin-bottom: 28px;
    border-bottom: 1px dashed #eef0f5;
  }
  &__price {
    font-size: 12px;
    margin-bottom: 16px;
  }
  &__amount {
    font-size: 46px;
    color: #272a32;
    font-weight: bold;
  }
}
</style>
