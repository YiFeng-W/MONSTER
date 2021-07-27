<template>
  <div class="dashboard">
    <div class="info">
          <div class="flowInfo default__shadow">
            <el-progress type="circle" :width="160" :stroke-width="16" :percentage="flowInfo.SurplusPercentage">
              <div class="flowInfo__progressKey">剩余流量</div>
              <div class="flowInfo__progressValue">{{ flowInfo.SurplusTrafficInGB }}<span class="font-size-12">GB</span></div>
            </el-progress>

            <div class="flowInfo__usage">
              <div class="flowInfo__content">
                <div class="flowInfo__contentKey">总流量</div>
                <div class="flowInfo__contentValue">{{ flowInfo.TotalTrafficInGB }}GB</div>
              </div>
              <div class="flowInfo__content">
                <div class="flowInfo__contentKey">已用</div>
                <div class="flowInfo__contentValue">{{ flowInfo.UsedTrafficInGB }}GB</div>
              </div>
              <router-link to="/plan">
                <el-button class="flowInfo__buy" type="primary" size="small">
                  购买更多<i class="el-icon-arrow-right"></i>
                </el-button>
              </router-link>
            </div>
          </div>

          <div class="userInfo default__shadow">
            <div class="userInfo__item">
              <img class="userInfo__icon" src="../assets/user.svg" alt="">
              <div class="userInfo__content">
                <div class="userInfo__contentKey">用户ID</div>
                <div class="userInfo__contentValue">#{{ userId || '-' }}</div>
              </div>
            </div>

            <div class="userInfo__item">
              <img class="userInfo__icon" src="../assets/score.svg" alt="">
              <div class="userInfo__content">
                <div class="userInfo__contentKey">用户积分</div>
                <div class="userInfo__contentValue">
                  <span>0</span>
                  <el-button class="userInfo__btn" type="primary" size="mini">兑换</el-button>
                </div>
              </div>
            </div>

            <div class="userInfo__item">
              <img class="userInfo__icon" src="../assets/rank.svg" alt="">
              <div class="userInfo__content">
                <div class="userInfo__contentKey">用户Rank</div>
                <div class="userInfo__contentValue">
                  <el-rate ></el-rate>
                </div>
              </div>
            </div>
          </div>
        </div>

    <div class="list default__shadow">
      <div class="list__title">消费记录</div>
      <el-table
        v-loading="loading"
        :data="tableData.Data"
        style="width: 100%"
      >
        <el-table-column
          prop="TotalPackageInGB"
          label="消费名称"
        >
        <template #default="scope">
          <span>{{ scope.row.TotalPackageInGB }}GB</span>
        </template>
        </el-table-column>

        <el-table-column
          prop="Id"
          label="充值ID"
        >
        </el-table-column>

        <el-table-column
          prop="ModifyTime"
          label="充值时间"
        >
          <template #default="scope">
            <span>{{ new Date(scope.row.ModifyTime).toLocaleString() }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="充值状态"
        >
          <template #default="scope">
            <!-- <div :class="{'list__status-success': scope.row.status === 'SUCCESS'}"> -->
            <div class="list__status-success" v-if="scope.row.OrderStatus === 3">
              充值成功
              <i class="el-icon-circle-check"></i>
            </div>
            <div class="list__status-fail" v-if="scope.row.OrderStatus === 2">
              订单失效
              <i class="el-icon-circle-close"></i>
            </div>
            <div class="list__status-waiting" v-if="scope.row.OrderStatus === 1">
              等待支付
              <i class="el-icon-loading"></i>
            </div>
            <div class="list__status-closed" v-if="scope.row.OrderStatus === 4">
              订单失效
              <i class="el-icon-warning-outline"></i>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
        >
          <template #default="scope">
            <div class="list__status-waiting" v-if="scope.row.OrderStatus === 1">
              <el-button type="danger" size="mini" :disabled="buttonDisabled && currentId === scope.row.Id" @click="closeOrder(scope.row.Id)">取消订单</el-button>
              <el-button type="primary" size="mini" :disabled="buttonDisabled && currentId === scope.row.Id" @click="payOrder(scope.row.Id)">继续支付</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="tableData.TotalCount > 10"
        background
        @current-change="currentChangeHandle"
        layout="prev, pager, next"
        :total="tableData.TotalCount">
      </el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, ref } from 'vue';
import { $getFlowInfo, $getTableData } from '../api/dashboard';
import { $payUrl, $closeOrder } from '../api/plan'
import axios from '../utils/request'

export default defineComponent({
  setup() {
    const fmNumber = (num: number | string) => {
      const res = Number(num).toFixed(3)
      return Number(res)
    }
    const userId = ref('')
    axios.get('basic')
      .then((data: any) => {
        userId.value = data.Id
      })
    // 流量模块逻辑
    const flowInfo = ref({
      TotalTrafficInGB: 0,
      UsedTrafficInGB: 0,
      SurplusTrafficInGB: 0,
      SurplusPercentage: 0
    })
    const initFlow = async () => {
      const flow: any = await $getFlowInfo()
      const SurplusTrafficInGB = fmNumber(flow.TotalTrafficInGB - flow.UsedTrafficInGB)
      flowInfo.value = {
        TotalTrafficInGB: fmNumber(flow.TotalTrafficInGB),
        UsedTrafficInGB: fmNumber(flow.UsedTrafficInGB),
        SurplusTrafficInGB: SurplusTrafficInGB,
        SurplusPercentage: fmNumber(SurplusTrafficInGB / fmNumber(flow.TotalTrafficInGB)) * 100
      }
    }
    initFlow()
    const flowTimer = setInterval(() => {
      initFlow()
    }, 10000)
    onUnmounted(() => {
      clearInterval(flowTimer)
    })
    // 列表模块
    const tableQuery = ref({
      PageIndex: 1,
      PageSize: 10
    })
    const tableData = ref({
      Data: [],
      TotalCount: 0
    })
    const loading = ref(false)
    const getTableData = () => {
      loading.value = true
      $getTableData(tableQuery.value).then((data: any) => {
        loading.value = false
        tableData.value = data
      })
    }
    const currentChangeHandle = (page: number) => {
      tableQuery.value.PageIndex = page
      getTableData()
    }

    const buttonDisabled = ref(false)
    const currentId = ref('-1')
    const closeOrder = (orderId: string) => {
      buttonDisabled.value = true
      currentId.value = orderId
      $closeOrder(orderId).then(() => {
        buttonDisabled.value = false
        getTableData()
      })
    }
    const payOrder = async (orderId: string) => {
      buttonDisabled.value = true
      currentId.value = orderId
      const payUrl: any = await $payUrl({
        PaymentType: 'AliPay',
        OrderId: orderId
      })
      buttonDisabled.value = false
      currentId.value = '-1'
      console.log(payUrl)
      window.open(payUrl.Data)
    }
    getTableData()
    return {
      userId,
      loading,
      flowInfo,
      tableData,
      getTableData,
      currentChangeHandle,
      closeOrder,
      payOrder,
      buttonDisabled,
      currentId
    }
  }
});
</script>

<style lang="less">
.dashboard {
  padding: 48px;
  .info {
    display: flex;
  }
  .flowInfo {
    flex: 3;
    padding: 0 32px;
    display: flex;
    align-items: center;
    margin-right: 40px;
    background: #fff;
    &__progressKey {
      font-size: 12px;
    }
    &__progressValue {
      margin-top: 4px;
      font-size: 24px;
      font-weight: bold;
    }
    &__usage {
      margin-left: 64px;
      text-align: left;
    }
    &__content {
      display: flex;
      margin-bottom: 16px;
    }
    &__contentKey {
      width: 64px;
      margin-right: 16px;
      text-align: left;
    }
    &__buy {
      margin-top: 8px;
    }
  }
  .userInfo {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    background: #fff;
    padding: 20px 40px;
    height: 210px;
    font-size: 16px;
    line-height: 1.4;
    &__item {
      display: flex;
      align-items: center;
    }
    &__btn {
      margin-left: 8px;
      padding: 4px 16px;
      min-height: 24px;
    }
    &__icon {
      height: 32px;
      width: 32px;
      margin-right: 12px;
    }
    &__content {
      display: flex;
      align-items: center;
    }
    &__contentKey {
      width: 80px;
      margin-right: 16px;
      text-align: left;
    }
    &__contentValue {
      display: flex;
      align-items: center;
    }
  }
}

.list {
  margin-top: 32px;
  min-height: 40vh;
  background-color: #fff;
  padding: 24px 27px;
  border-radius: 6px;
  box-shadow: 0 4px 24px 0 rgba(34, 41, 47, .1);
  &__title {
    text-align: left;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
  }
  &__status-success {
    color: #67C23A;
  }
  &__status-fail {
    color: #F56C6C;
  }
  &__status-waiting {
    color: #409EFF;
  }
  &__status-closed {
    color: #F56C6C;
  }
  .el-table .cell {
    padding-left: 0;
  }
  .el-table td {
    padding: 20px 0;
  }
  .el-table th > .cell {
    color: #a3a8b9;
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
  }
}
.el-pagination.is-background {
  margin-top: 20px;
}
</style>
