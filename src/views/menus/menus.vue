<template>
  <div class="app-container">
    <!-- 顶部头部 -->
    <header class="page-header">
      <div class="header-text">
        <h1 class="main-title">多功能服务</h1>
        <p class="sub-title">常用功能一键直达</p>
      </div>
      <div class="header-icons">
        <el-icon class="icon-bell">
          <Bell />
        </el-icon>
        <el-avatar size="44" src="https://picsum.photos/id/64/100/100"></el-avatar>
      </div>
    </header>

    <!-- 搜索框 -->
    <el-input
      class="search-input"
      placeholder="搜索服务、订单、优惠"
      suffix-icon="Search"
    ></el-input>

    <!-- 6宫格功能卡片 -->
    <div class="function-grid">
      <div class="func-card" v-for="(item, index) in funcList" :key="index">
        <div class="icon-wrap">
          <el-icon :component="item.icon" class="card-icon"></el-icon>
        </div>
        <div class="card-name">{{ item.name }}</div>
        <div class="card-desc">{{ item.desc }}</div>
      </div>
    </div>

    <!-- 本周常用模块 -->
    <el-card class="weekly-card" shadow="hover">
      <div class="card-top-bar">
        <span class="bar-title">本周常用</span>
        <div class="bar-tabs">
          <span class="tab-text">常用服务</span>
          <span class="tab-text">最近使用</span>
          <span class="tab-text">待办提醒</span>
          <el-icon>
            <ArrowRight />
          </el-icon>
        </div>
      </div>
      <div class="service-row">
        <div class="service-col" v-for="(item, idx) in serviceList" :key="idx">
          <div class="col-title">{{ item.title }}</div>
          <div class="col-desc">{{ item.desc }}</div>
        </div>
      </div>
    </el-card>

    <!-- 底部占位 -->
    <div class="page-space"></div>

    <!-- 底部Tab导航 -->
    <div class="bottom-tab">
      <div class="tab-item" v-for="(tab, idx) in tabList" :key="idx" :class="{ active: tab.active }">
        <el-icon :component="tab.icon"></el-icon>
        <span class="tab-label">{{ tab.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
// 全部为官方稳定导出图标，移除不存在的 UserCheck，替换为 User
import {
  House,
  Menu,
  Bell,
  Search,
  User,
  DocumentChecked,
  Tickets,
  Wallet,
  Ticket,
  ArrowRight
} from '@element-plus/icons-vue'

const funcList = [
  { icon: DocumentChecked, name: '扫码付款', desc: '搜索服务、订单、优惠' },
  { icon: Tickets, name: '订单记录', desc: '' },
  { icon: Wallet, name: '我的钱包', desc: '' },
  { icon: User, name: '会员中心', desc: '快速支付' },
  { icon: Ticket, name: '优惠券', desc: '查看记录' },
  { icon: User, name: '客服帮助', desc: '在线咨询' }
]

const serviceList = [
  { title: '常用服务', desc: '专属管益' },
  { title: '最近使用', desc: '优惠活动' },
  { title: '待办咨询', desc: '在线咨询' }
]

const tabList = [
  { icon: House, label: '首页', active: false },
  { icon: Menu, label: '服务', active: false },
  { icon: User, label: '我的', active: true }
]
</script>

<style scoped>
:root {
  --primary: #165DFF;
  --bg-page: #F7F8FA;
  --text-gray: #86909C;
  --card-radius: 20px;
  --card-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
}
.app-container {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: var(--bg-page);
  padding: 32px 20px 100px;
  box-sizing: border-box;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}
.main-title {
  font-size: 40px;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}
.sub-title {
  font-size: 22px;
  color: #333;
  margin: 6px 0 0;
}
.header-icons {
  display: flex;
  gap: 20px;
  align-items: center;
}
.icon-bell {
  font-size: 28px;
  color: #333;
}
.search-input {
  margin-bottom: 30px;
}
:deep(.el-input__wrapper) {
  border-radius: 999px;
  background: #fff;
  box-shadow: none;
}
.function-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
  margin-bottom: 30px;
}
.func-card {
  background: #fff;
  border-radius: var(--card-radius);
  padding: 26px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  box-shadow: var(--card-shadow);
  transition: all 0.2s ease;
}
.func-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.09);
}
.icon-wrap {
  width: 64px;
  height: 64px;
  background: #E8F3FF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-icon {
  font-size: 30px;
  color: var(--primary);
}
.card-name {
  font-size: 20px;
  font-weight: 600;
}
.card-desc {
  font-size: 13px;
  color: var(--text-gray);
}
.weekly-card {
  border-radius: var(--card-radius);
  margin-bottom: 40px;
}
:deep(.el-card__body) {
  padding: 24px;
}
.card-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.bar-title {
  font-size: 24px;
  font-weight: 600;
}
.bar-tabs {
  display: flex;
  align-items: center;
  gap: 18px;
  color: var(--text-gray);
}
.tab-text {
  font-size: 16px;
}
.service-row {
  display: flex;
  justify-content: space-between;
}
.service-col {
  text-align: center;
  flex: 1;
}
.col-title {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 6px;
}
.col-desc {
  font-size: 14px;
  color: var(--text-gray);
}
.page-space {
  height: 40px;
}
.bottom-tab {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 12px;
  width: min(480px, calc(100% - 24px));
  background: #fff;
  border-radius: 24px;
  display: flex;
  padding: 12px 0;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.05);
}
.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: var(--text-gray);
  font-size: 14px;
}
.tab-item.active {
  color: var(--primary);
}
.tab-item :deep(.el-icon) {
  font-size: 24px;
}
.tab-label {
  font-size: 15px;
}
</style>