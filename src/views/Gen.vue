<template>
  <div class="gen">
    <div class="setting default__shadow">
      <div class="setting__param">
        <el-row>
          <el-col :span="9">
            <div class="setting__content">
              <div class="setting__contentKey">Proxy Quantity</div>
              <div class="setting__contentValue">
                <el-input v-model.number="searchQuery.ProxyQuantity" @blur="ProxyQuantityInputBlurHandle" placeholder="请输入内容" size="small"></el-input>
              </div>
            </div>

            <div class="setting__content">
              <div class="setting__contentKey">Proxy Pool</div>
              <div class="setting__contentValue">
                <el-select v-model="searchQuery.ProxyPool" placeholder="请选择" size="small">
                  <el-option
                    v-for="item in optionsSingle"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value">
                    <span style="float: left">{{ item.label }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.scale }}倍</span>
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="setting__content">
              <el-button type="primary" :loading="resetLoading" @click="resetAccount">Reset Proxies Account</el-button>
            </div>
          </el-col>

          <el-col :span="9">
            <div class="setting__content">
              <div class="setting__contentKey">Group Quantity</div>
              <div class="setting__contentValue">
                <el-input v-model.number="searchQuery.GroupQuantity" @blur="GroupQuantityInputBlurHandle" placeholder="请输入内容" size="small"></el-input>
              </div>
            </div>

            <div class="setting__content">
              <div class="setting__contentKey">Region</div>
              <div class="setting__contentValue">
                <el-cascader
                  style="width:100%"
                  placeholder="Search"
                  :options="optionsMulti"
                  :props="{ multiple: true }"
                  :show-all-levels="false"
                  size="small"
                  v-model="searchQuery.Region"
                  @change="change"
                  @expand-change="expandChange"
                  @remove-tag="removetagHandle"
                  filterable
                >
                  <template #default="{ node, data }">
                    <span>{{ data.label }}</span>
                    <el-input
                      class="cascader__input"
                      v-model.number="optionsMultiDic[node.label]"
                      v-if="node.isLeaf && node.checked"
                      @blur="cascaderInputBlur(data)"
                    ></el-input>
                  </template>
                </el-cascader>
              </div>
            </div>

          </el-col>

          <el-col class="setting__operation" :span="6">
            <el-button size="small" @click="clearSearchQuery">
              <div class="gen__btn">
                <img class="gen__icon" src="../assets/clean.svg" alt="">Clear All
              </div>
            </el-button>
            <el-button type="primary" size="small" @click="handleSearch" :loading="genLoading">
              <div class="gen__btn">
                <img class="gen__icon" src="../assets/save.svg" alt="">Gen
              </div>
            </el-button>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="group default__shadow" v-for="(group, index) in listData" :key="index" v-show="!delListData.includes(index)" v-loading="genLoading">
      <div :span="24" class="group__list" >
        <div class="group__title">
          <div @click="toggleInput(index)">Group#{{ index + 1 }} list</div>
          <div>
            <el-button size="small" @click="deleteGroup(index)">
            <div class="gen__btn">
              <img class="gen__icon" src="../assets/delete.svg" alt="">Delete
            </div>
          </el-button>
          <el-button size="small" @click="copyGroup(index)">
            <div class="gen__btn">
              <img class="gen__icon" src="../assets/copy.svg" alt="">Copy
            </div>
          </el-button>
          </div>
        </div>
        <!-- <div v-show="isShowInput" class="group__listItem"> -->
        <div :class="showInput.includes(index) ? 'show group__listItem' : 'group__listItem'">
          <el-input
            type="textarea"
            class="txt"
            :rows="5"
            placeholder="请输入内容"
            v-model="listData[index]">
          </el-input>
        </div>
      </div>
    </div>
    <div class="nodata group default__shadow" v-show="!listData.length || listData.length === delListData.length" v-loading="genLoading">noData</div>
    <textarea id="copyContainer" style="opacity:0;left:-100%;position:absolute;pointer-events:none;"></textarea>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from 'vue';
import { $getTableData, $getRegion, $getPool, $resetAccount } from '../api/gen';
import { ElMessage } from 'element-plus'

export default defineComponent({
  setup() {
    const PoolType: any = {
      Unknown: 0,
      Restock: 1,
      Release: 2
    }
    const showInput: any = ref([])
    const optionsSingle = ref([])
    $getPool().then((data: any) => {
      const temp: any = []
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key];
          temp.push({
            label: element.Description,
            value: PoolType[key],
            scale: element.Factor
          })
        }
      }
      optionsSingle.value = temp
      searchQuery.ProxyPool = temp[0].value
      getRegion(searchQuery.ProxyPool)
    })

    const resetLoading = ref(false)
    const resetAccount = () => {
      resetLoading.value = true
      $resetAccount().then(status => {
        resetLoading.value = false
        if (status) {
          ElMessage.success('重置成功!')
        } else {
          ElMessage.error('重置失败!')
        }
      })
    }
    // 地区选框逻辑
    const optionsMulti = ref([])
    const optionsMultiDic: any = ref({})
    const cascaderInputHandle = (v: any) => {
      console.log(v)
    }
    const toggleInput = (index: number) => {
      const oldIndex = showInput.value.indexOf(index)
      if (oldIndex > -1) {
        showInput.value.splice(oldIndex, 1)
      } else {
        showInput.value.push(index)
      }
    }
    const change = (v: any) => {
      console.log(v)
    }
    const removetagHandle = (v: any) => {
      console.log('removetagHandle', v)
    }
    const expandChange = (v: any) => {
      console.log(v)
    }
    const getRegion = (poolType: any) => {
      const result: any = []
      const temp: any = {}
      $getRegion(poolType).then((data: any) => {
        for (const key in data.LocationByCategory) {
          if (Object.prototype.hasOwnProperty.call(data.LocationByCategory, key)) {
            const region = data.LocationByCategory[key]
            const p: any = region.map((item: any) => {
              const v: any = {}
              v.label = item
              v.value = item
              temp[item] = ''
              // v.children = percentage.value
              return v
            })
            const item: any = {
              label: key,
              value: key,
              children: p
            }
            result.push(item)
          }
        }
        optionsMulti.value = result
        optionsMultiDic.value = temp
      })
    }
    const cascaderInputBlur = (currentData: any) => {
      const label = currentData.label
      const value = optionsMultiDic.value[label]
      const values = Object.values(optionsMultiDic.value)
      const total = values.reduce((total: number, currentValue) => total += Number(currentValue), 0)
      if (total > searchQuery.ProxyQuantity) {
        optionsMultiDic.value[label] = searchQuery.ProxyQuantity - (total - value)
      }
    }

    // gen button
    const searchQuery = reactive({
      ProxyQuantity: 1000,
      ProxyPool: '',
      GroupQuantity: 1,
      Region: []
    })
    watch(
      () => searchQuery.Region,
      (newVal, oldVal) => {
        if (newVal.length === 0) {
          const temp: any = {}
          for (const key in optionsMultiDic) {
            if (Object.prototype.hasOwnProperty.call(optionsMultiDic, key)) {
              temp[key] = ''
            }
          }
          optionsMultiDic.value = temp
        } else if (oldVal.length > newVal.length) {
          const delItem: any = oldVal.pop()
          const key = delItem[1]
          optionsMultiDic.value[key] = ''
        }
      }
    )
    const ProxyQuantityInputBlurHandle = () => {
      let e: any = searchQuery.ProxyQuantity
      if (e < 100) {
        e = 100
      } else if (e > 5000) {
        e = 5000
      }
      searchQuery.ProxyQuantity = e
      const temp: any = {}
      for (const key in optionsMultiDic) {
        if (Object.prototype.hasOwnProperty.call(optionsMultiDic, key)) {
          temp[key] = ''
        }
      }
      optionsMultiDic.value = temp
    }
    const GroupQuantityInputBlurHandle = () => {
      let e: any = searchQuery.GroupQuantity
      if (e < 1) {
        e = 1
      } else if (e > 10) {
        e = 10
      }
      searchQuery.GroupQuantity = e
    }

    const clearSearchQuery = () => {
      const defaultSingle: any = optionsSingle.value[0]
      searchQuery.ProxyQuantity = 1000
      searchQuery.ProxyPool = defaultSingle.value
      searchQuery.GroupQuantity = 1
      searchQuery.Region = []
      // handleSearch()
    }
    const genLoading = ref(false)
    const tableLoading = ref(false)
    const listData: any = ref([])
    const delListData: any = ref([])
    const handleSearch = () => {
      listData.value = []
      delListData.value = []
      genLoading.value = true
      const selectedRegion = searchQuery.Region
      const regionQuantity = optionsMultiDic.value
      if (!selectedRegion || !selectedRegion.length) {
        genLoading.value = false
        ElMessage.error('Region is required!')
        return
      }
      const result: any = {}
      const noData: any = []
      selectedRegion.forEach(item => {
        const key = item[1]
        result[key] = regionQuantity[key]
        if (!regionQuantity[key]) {
          noData.push(key)
        }
      })
      const noDataLen = noData.length
      if (noDataLen) {
        const values = Object.values(regionQuantity)
        const total = values.reduce((total: number, currentValue) => total += Number(currentValue), 0)
        const noUsed = searchQuery.ProxyQuantity - total
        const per = Math.floor(noUsed / noDataLen)

        noData.forEach((key: string) => {
          result[key] = per
        })
        const lastKey = noData[noDataLen - 1]
        result[lastKey] = noUsed - per * (noDataLen - 1)
        console.log('result: ', result)
        console.log('noData: ', noData)
        console.log('total: ', total)
        console.log('per: ', per)
      }
      $getTableData({
        GroupCount: searchQuery.GroupQuantity,
        PoolType: searchQuery.ProxyPool,
        Locations: result
      }).then((data: any) => {
        genLoading.value = false
        listData.value = data.map((group: any) => group.join(',\n'))
      }).catch(() => {
        genLoading.value = false
      })
    }

    const deleteGroup = (index: number) => {
      delListData.value.push(index)
    }
    const copyGroup = (index: number) => {
      const nodelist: any = document.querySelectorAll('textarea')
      const copyEl: any = document.querySelector('#copyContainer')
      copyEl.value = nodelist[index].value
      copyEl.select()
      document.execCommand('copy')
      ElMessage.success(`Group#${index + 1} list copy success!`)
    }

    return {
      resetLoading,
      resetAccount,
      showInput,
      optionsSingle,
      optionsMulti,
      optionsMultiDic,
      toggleInput,
      searchQuery,
      cascaderInputHandle,
      cascaderInputBlur,
      change,
      expandChange,
      removetagHandle,
      ProxyQuantityInputBlurHandle,
      GroupQuantityInputBlurHandle,
      clearSearchQuery,
      handleSearch,
      tableLoading,
      genLoading,
      listData,
      delListData,
      deleteGroup,
      copyGroup
    }
  }
})
</script>

<style lang="less">
.cascader__input {
  width: 60px;
  height: 24px;
  line-height: 24px;
  margin-top: 5px;
  margin-left: 10px;
  .el-input__inner {
    height: 24px;
    left: 30px;
    padding: 0 8px;
  }
}
</style>
<style lang="less">
.gen {
  padding: 36px 40px;
  &__icon {
    height: 12px;
    width: 12px;
    margin-right: 8px;
  }
  &__btn {
    display: flex;
    align-items: center;
  }
}

.nodata {
  height: 245px;
  text-align: center !important;
  line-height: 100px;
  color: #999;
}

.setting {
  background: #fff;
  text-align: left;
  min-height: 240px;
  &__param {
    padding: 40px 42px;
  }
  &__content {
    margin-bottom: 24px;
    padding-right: 40px;
    display: flex;
    align-items: flex-start;
  }
  &__contentKey {
    width: 160px;
    line-height: 34px;
  }
  &__contentValue{
    flex: 1;
    .el-select {
      width: 100%;
    }
  }
  &__operation {
    .el-button--primary {
      vertical-align: middle;
      i.el-icon-loading {
        position: relative;
        top: -2px;
      }
      span {
        display: inline-block;
      }
    }
  }
}

.group {
  background: #fff;
  margin-top: 40px;
  text-align: left;
  padding: 40px 42px;
  &__title {
    font-size: 16px;
    line-height: 1.4;
    padding: 4px 0;
    display: flex;
    justify-content: space-between;
    & > div {
      cursor: pointer;
      text-decoration: underline;
    }
  }
  &__list {
    padding-right: 40px;
  }
  &__listItem {
    margin-top: 8px;
    height: 0px;
    opacity: 0;
    overflow: hidden;
    transition: all .2s;
    textarea {
      width: 75%;
      height: 120px;
      overflow-x: hidden;
    }
  }
  &__listItem.show {
    height: 120px;
    opacity: 1;
  }
}
</style>
