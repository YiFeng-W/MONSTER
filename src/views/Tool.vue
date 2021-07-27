<template>
  <div class="tool">
    <el-row>
      <el-col :span="8">
        <div class="tool__panel default__shadow">
          <div class="tool__panelTitle">
            我是工具名称工具名称
            <el-switch v-model="switchStatus"></el-switch>
          </div>
          <div class="tool__panelContent">
            <div class="tool__pic">
              <img src="../assets/network.svg" alt="">
            </div>
            <div class="tool__param">
              <div class="tool__paramItem">
                <span class="tool__paramItemKey">时间</span>
                <el-button-group>
                  <el-button size="small">10m</el-button>
                  <el-button size="small">30m</el-button>
                  <el-button size="small">12h</el-button>
                </el-button-group>
              </div>

              <div class="tool__paramItem">
                <span class="tool__paramItemKey">阈值</span>
                <el-input v-model="input" placeholder="请输入内容" size="small"></el-input>
              </div>
            </div>
          </div>
          <div class="tool__panelOperation">
            了解详情 <i class="el-icon-right"></i>
          </div>

        </div>
      </el-col>
      <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class App extends Vue {
  switchStatus = false;
}
</script>

<style lang="less">
.tool {
  padding: 36px 42px;
  text-align: left;

  &__panel {
    background: #fff;
    padding: 40px;
  }

  &__panelTitle {
    font-size: 18px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  &__panelContent {
    display: flex;
    margin-bottom: 20px;
  }

  &__panelOperation {
    text-align: right;
    color: #3B85FF;
  }

  &__param {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__paramItem {
    display: flex;
    align-items: center;
  }

 &__paramItemKey {
   width: 48px;
   margin-right: 8px;
 }

  &__pic {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    border: 1px solid #DFE8EF;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
  }
}
</style>
