<template>
  <el-container class="el-container">
    <!-- 侧边栏 -->
    <el-aside width="204px">
      <div class="aside__logo">
        <img class="aside__img" src="./assets/logo-full.png" />
      </div>

      <div
        class="aside__menu"
        :class="{ 'aside__menu-active': activeMenu === 'dashboard' }"
      >
        <div class="aside__menuItem" @click="clickMenu('dashboard')">
          <img v-if="activeMenu === 'dashboard'" class="aside__icon" src="./assets/dashboard-active.svg"/>
          <img v-else class="aside__icon" src="./assets/dashboard.svg"/>
          Dashboard
        </div>
      </div>

      <div
        class="aside__menu"
        :class="{ 'aside__menu-active': activeMenu === 'gen' }"
      >
        <div class="aside__menuItem" @click="clickMenu('gen')">
          <img v-if="activeMenu === 'gen'" class="aside__icon" src="./assets/gen-active.svg"/>
          <img v-else class="aside__icon" src="./assets/gen.svg"/>
          Gen
        </div>
      </div>

      <div
        class="aside__menu"
        :class="{ 'aside__menu-active': activeMenu === 'tool' }"
      >
        <div class="aside__menuItem"  @click="clickMenu('tool')">
          <img v-if="activeMenu === 'tool'" class="aside__icon" src="./assets/tool-active.svg"/>
          <img v-else class="aside__icon" src="./assets/tool.svg"/>
          Tool
        </div>
      </div>

      <div
        class="aside__menu"
        :class="{ 'aside__menu-active': activeMenu === 'plan' }"
      >
        <div class="aside__menuItem"  @click="clickMenu('plan')">
          <img v-if="activeMenu === 'plan'" class="aside__icon" src="./assets/plan-active.svg"/>
          <img v-else class="aside__icon" src="./assets/plan.svg"/>
          Plan
        </div>
      </div>
    </el-aside>

    <el-container>
      <el-header class="el-header">
        <div class="header__right">
          <img class="header__icon" src="./assets/more.svg" alt="">
          <img class="header__icon" src="./assets/reminder.svg" alt="">
            <el-popover
              placement="bottom-end"
              width="200"
              trigger="hover">
              <el-button style="width: 100%;border: none;" @click="logout">logout</el-button>
              <template v-slot:reference>
                <div class="header__avatar">
                  <img :src="avatar">
                </div>
              </template>
            </el-popover>
        </div>
      </el-header>

      <el-main class="el-main">
        <router-view v-slot="{ Component }">
          <transition name="main">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import router from './router';
import axios from './utils/request'

export default defineComponent({
  setup() {
    const activeMenu = ref('dashboard')
    activeMenu.value = location.pathname.replace('/', '')
    const clickMenu = (menuType: string):void => {
      activeMenu.value = menuType
      router.push({
        path: `/${menuType}`
      })
    }
    const avatar = ref('')
    axios.get('basic')
      .then((data: any) => {
        avatar.value = data.Avatar
        localStorage.setItem('userInfo', JSON.stringify(data))
      })
    axios.get('resi_order/v1/origin_price')
      .then((data: any) => localStorage.setItem('AmountPerGBInUSD', data.AmountPerGBInUSD))
    const logout = () => {
      axios.get('logout')
    }
    return {
      activeMenu,
      clickMenu,
      logout,
      avatar
    }
  }
})
</script>

<style lang="less">
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  height: 100%;
}
.main-enter-from,
.main-leave-to {
  opacity: 0;
  position: absolute;
  top: 100px;
  width: 100%;
}
.main-leave-from,
.main-enter-to {
  opacity: 1;
  position: absolute;
  top: 0px;
  width: 100%;
  z-index: 9;
}
.main-enter-active,
.main-leave-active {
  transition: all .5s;
  width: 100%;
}
.default__shadow {
  border-radius: 6px;
  box-shadow: 0 4px 24px 0 rgba(34, 41, 47, .1);
}
.el-button.el-button--primary {
  background-image: linear-gradient(90deg, #57A2FF, #3B85FF);
  box-shadow: 0px 2px 6px rgba(59,133,255,0.24);
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

.el-container {
  min-height: 100%;
}

.el-aside {
  position: relative;
  z-index: 9;
  overflow: visible;
  // border-right: 1px solid #ECEFF4;
  min-height: 100%;
  background: #F3F8FF;
  height: 100vh;
  box-shadow: 0 0 15px 0 rgba(34, 41, 47, .1);
  .aside__logo {
    height: 84px;
    color: #3B85FF;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #ECEFF4;
    padding: 16px;
  }

  .aside__img {
    width: 100%;
  }

  .aside__menu {
    padding: 18px 6px 18px 21px;
    border-bottom: 1px solid #ECEFF4;
    font-size: 16px;
    line-height: 1.4;
  }

  .aside__menuItem {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;
    width: 156px;
    height: 54px;
    line-height: 54px;
    padding-left: 18px;
    border-radius: 4px;
  }

  .aside__menu-active {
    position: relative;

    &:before {
      position: absolute;
      content: '';
      width: 3px;
      height: 54px;
      left: 0;
      background: #5C99FF;
    }

    .aside__menuItem {
      background: #5C99FF;
      color: #fff;
      background: linear-gradient(90deg, #5C99FF, #438CFF);
      box-shadow: 0px 4px 8px rgba(59,133,255,0.24);
    }
  }

  .aside__icon {
    margin-right: 12px;
    height: 20px;
    width: 20px;
  }
}

.el-header {
  background: #fff;
  height: 84px !important;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 84px;
  border-bottom: 1px solid #ECEFF4;
  .header {
    &__right {
      background: #f5f6fa;
      padding: 8px 24px;
      display: flex;
      align-items: center;
      border-radius: 4px;
    }
    &__icon {
      width: 12px;
      height: 12px;
      margin-right: 24px;
    }
    &__avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #fff;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.el-main {
  background: #f7fafc;
  padding: 0;
  height: calc(100vh - 84px);
  overflow-y: auto;
  position: relative;
}

.font-size-12 {
  font-size: 12px;
}

</style>
