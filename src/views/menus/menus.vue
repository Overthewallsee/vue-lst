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
        <el-avatar size="40" src="https://picsum.photos/id/64/100/100"></el-avatar>
      </div>
    </header>

    <!-- 搜索框 -->
    <el-input
      class="search-input"
      placeholder="搜索服务、订单、优惠"
    >
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
    </el-input>

    <!-- 6宫格功能卡片 -->
    <div class="function-grid">
      <el-card
        v-for="(item, index) in funcList"
        :key="index"
        class="func-card"
        :body-style="{ padding: '24px 12px' }"
        shadow="never"
      >
        <div class="card-inner">
          <div class="icon-wrap">
            <el-icon :component="item.icon" class="card-icon"></el-icon>
          </div>
          <div class="card-name">{{ item.name }}</div>
          <div class="card-desc">{{ item.desc }}</div>
        </div>
      </el-card>
    </div>

    <!-- 本周常用模块 -->
    <el-card class="weekly-card" shadow="never" :body-style="{ padding: '24px' }">
      <div class="card-top-bar">
        <span class="bar-title">本周常用</span>
        <div class="bar-tabs">
          <span class="tab-text">常用服务</span>
          <span class="tab-text">最近使用</span>
          <span class="tab-text">待办提醒</span>
          <el-icon><ArrowRight /></el-icon>
        </div>
      </div>

      <div class="service-row">
        <div class="service-col">
          <div class="col-title">常用服务</div>
          <div class="col-desc">专属权益</div>
        </div>
        <div class="split-line"></div>
        <div class="service-col">
          <div class="col-title">最近使用</div>
          <div class="col-desc">优惠活动</div>
        </div>
        <div class="split-line"></div>
        <div class="service-col">
          <div class="col-title">待办咨询</div>
          <div class="col-desc">在线咨询</div>
        </div>
      </div>
    </el-card>

    <!-- 底部占位 -->
    <div class="page-space"></div>

    <!-- 底部Tab导航 -->
    <el-card class="bottom-tab" shadow="never" :body-style="{ padding: '12px 0' }">
      <div class="tab-inner">
        <div
          class="tab-item"
          v-for="(tab, idx) in tabList"
          :key="idx"
          :class="{ active: tab.active }"
        >
          <el-icon :component="tab.icon"></el-icon>
          <span class="tab-label">{{ tab.label }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import {
  House,
  DocumentCopy,
  Bell,
  Search,
  User,
  DocumentChecked,
  Tickets,
  Wallet,
  Ticket,
  ArrowRight,
  Document
} from '@element-plus/icons-vue'

const funcList = [
  { icon: DocumentChecked, name: '扫码付款', desc: '搜索服务、订单、优惠' },
  { icon: Tickets, name: '订单记录', desc: '' },
  { icon: Wallet, name: '我的钱包', desc: '' },
  { icon: Document, name: '会员中心', desc: '快速支付' },
  { icon: Ticket, name: '优惠券', desc: '查看记录' },
  { icon: Document, name: '客服帮助', desc: '在线咨询' }
]

const tabList = [
  { icon: House, label: '首页', active: false },
  { icon: DocumentCopy, label: '服务', active: false },
  { icon: Bell, label: '我的', active: true }
]
</script>

<style scoped>
:root {
  --primary: #165DFF;
  --bg-page: #F5F7FA;
  --text-main: #1D2129;
  --text-gray: #86909C;
  --border-color: #E5E6EB;
  --card-radius: 16px;
  --light-blue: #ECF5FF;
}

.app-container {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: var(--bg-page);
  padding: 32px 20px 100px;
  box-sizing: border-box;
}

/* 头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
}

.main-title {
  font-size: 40px;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
  color: var(--text-main);
}

.sub-title {
  font-size: 22px;
  color: var(--text-gray);
  margin: 8px 0 0;
}

.header-icons {
  display: flex;
  gap: 20px;
  align-items: center;
}

.icon-bell {
  font-size: 28px;
  color: var(--text-main);
}

/* 搜索框 */
.search-input {
  margin-bottom: 28px;
}

:deep(.el-input__wrapper) {
  border-radius: 999px;
  background: #FFFFFF;
  border: 1px solid var(--border-color);
  box-shadow: none;
  padding-left: 12px;
}

:deep(.el-input__inner) {
  font-size: 16px;
  color: var(--text-main);
}

:deep(.el-input__prefix) {
  color: var(--text-gray);
}

/* 功能卡片网格 */
.function-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}

.func-card {
  border-radius: var(--card-radius);
  border: 1px solid var(--border-color);
  background: #FFFFFF;
}

.card-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.icon-wrap {
  width: 64px;
  height: 64px;
  background: var(--light-blue);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon {
  font-size: 32px;
  color: var(--primary);
}

.card-name {
  font-size: 21px;
  font-weight: 600;
  color: var(--text-main);
}

.card-desc {
  font-size: 13px;
  color: var(--text-gray);
}

/* 本周常用卡片 */
.weekly-card {
  border-radius: var(--card-radius);
  border: 1px solid var(--border-color);
  background: #FFFFFF;
  margin-bottom: 40px;
}

.card-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.bar-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-main);
}

.bar-tabs {
  display: flex;
  align-items: center;
  gap: 16px;
  color: var(--text-gray);
}

.tab-text {
  font-size: 15px;
}

.service-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.split-line {
  width: 1px;
  height: 40px;
  background: var(--border-color);
}

.service-col {
  text-align: center;
  flex: 1;
}

.col-title {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 6px;
  color: var(--text-main);
}

.col-desc {
  font-size: 14px;
  color: var(--text-gray);
}

/* 底部占位 */
.page-space {
  height: 50px;
}

/* 底部Tab导航 */
.bottom-tab {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 12px;
  width: min(480px, calc(100% - 24px));
  border-radius: 24px;
  border: 1px solid var(--border-color);
  background: #FFFFFF;
}

.tab-inner {
  display: flex;
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