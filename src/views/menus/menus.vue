<template>
  <div class="app-container">
    <header class="page-header">
      <div class="header-text">
        <h1 class="main-title">服务中心</h1>
        <p class="sub-title">常用功能一键直达</p>
      </div>
      <div class="header-icons">
        <el-icon class="icon-bell">
          <Bell />
        </el-icon>
        <el-avatar size="34" src="https://picsum.photos/id/64/100/100"></el-avatar>
      </div>
    </header>

    <el-card class="search-card" shadow="always" :body-style="{ padding: '10px 12px' }">
      <el-input class="search-input" placeholder="搜索服务、订单、优惠">
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </el-card>

    <div class="function-grid">
      <el-card
        v-for="(item, index) in funcList"
        :key="index"
        class="func-card"
        :class="{ 'func-card-clickable': item.name === '聊天室' }"
        :body-style="{ padding: '16px 10px' }"
        shadow="always"
        @click="handleFuncClick(item)"
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

    <el-card class="weekly-card" shadow="always" :body-style="{ padding: '16px' }">
      <template #header>
        <div class="card-top-bar">
          <span class="bar-title">本周常用</span>
          <div class="bar-tabs">
            <span class="tab-text">常用</span>
            <span class="tab-text">最近</span>
            <span class="tab-text">提醒</span>
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </template>

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

    <div class="page-space"></div>

    <el-card class="bottom-tab" shadow="always" :body-style="{ padding: '8px 0' }">
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
import { useRouter } from 'vue-router'
import {
  House,
  DocumentCopy,
  Bell,
  Search,
  DocumentChecked,
  Tickets,
  Wallet,
  Ticket,
  ArrowRight,
  Document
} from '@element-plus/icons-vue'

const router = useRouter()

const handleFuncClick = (item) => {
  if (item.name === '聊天室') {
    router.push('/features/chat')
  }
}

const funcList = [
  { icon: DocumentChecked, name: '扫码付款', desc: '搜索服务、订单、优惠' },
  { icon: Tickets, name: '订单记录', desc: '' },
  { icon: Wallet, name: '我的钱包', desc: '' },
  { icon: Document, name: '会员中心', desc: '快速支付' },
  { icon: Ticket, name: '优惠券', desc: '查看记录' },
  { icon: Document, name: '聊天室', desc: '创建、加入聊天室' }
]

const tabList = [
  { icon: House, label: '首页', active: false },
  { icon: DocumentCopy, label: '服务', active: false },
  { icon: Bell, label: '我的', active: true }
]
</script>

<style scoped>
:root {
  --primary: #2563eb;
  --bg-page: #f4f6fb;
  --surface: #ffffff;
  --text-main: #111827;
  --text-gray: #6b7280;
  --border-color: #e5e7eb;
  --card-radius: 14px;
  --light-blue: #eef4ff;
}

.app-container {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  /* background: linear-gradient(180deg, #f8fafc 0%, var(--bg-page) 100%); */
  padding: 20px 16px 96px;
  box-sizing: border-box;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.main-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  line-height: 1.2;
  color: var(--text-main);
}

.sub-title {
  font-size: 13px;
  color: var(--text-gray);
  margin: 4px 0 0;
}

.header-icons {
  display: flex;
  gap: 12px;
  align-items: center;
}

.icon-bell {
  font-size: 20px;
  color: var(--text-main);
}

.search-card {
  margin-bottom: 18px;
  border-radius: 16px;
  border: 1px solid var(--border-color);
  /* background: var(--surface); */
}

.search-input {
  width: 100%;
}

:deep(.el-input__wrapper) {
  border-radius: 999px;
  background: var(--surface);
  border: 1px solid var(--border-color);
  box-shadow: none;
  padding-left: 12px;
}

:deep(.el-input__inner) {
  font-size: 14px;
  color: var(--text-main);
}

:deep(.el-input__prefix) {
  color: var(--text-gray);
}

.function-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 18px;
}

.func-card {
  border-radius: var(--card-radius);
  border: 1px solid rgba(229, 231, 235, 0.9);
  /* background: var(--surface); */
  transition: transform 0.2s ease, background-color 0.2s ease;
  border-radius: 16px;
}

.func-card:hover {
  transform: translateY(-1px);
  background: #f9fbff;
}

.func-card-clickable {
  cursor: pointer;
}

.card-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.icon-wrap {
  width: 48px;
  height: 48px;
  /* background: var(--light-blue); */
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon {
  font-size: 22px;
  color: var(--primary);
}

.card-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
}

.card-desc {
  font-size: 11px;
  line-height: 1.4;
  color: var(--text-gray);
  min-height: 16px;
}

.weekly-card {
  border-radius: var(--card-radius);
  border: 1px solid var(--border-color);
  /* background: var(--surface); */
  margin-bottom: 24px;
  border-radius: 16px;
}

.card-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 0;
}

.bar-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-main);
}

.bar-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-gray);
}

.tab-text {
  font-size: 12px;
}

.service-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.split-line {
  width: 1px;
  height: 36px;
  /* background: var(--border-color); */
}

.service-col {
  text-align: center;
  flex: 1;
}

.col-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--text-main);
}

.col-desc {
  font-size: 12px;
  color: var(--text-gray);
}

.page-space {
  height: 56px;
}

.bottom-tab {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 12px;
  width: min(480px, calc(100% - 24px));
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: rgba(255, 255, 255, 0.96);
}

.tab-inner {
  display: flex;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: var(--text-gray);
  font-size: 12px;
  padding: 6px 0;
  border-radius: 999px;
}

.tab-item.active {
  color: var(--primary);
  background: var(--light-blue);
}

.tab-item :deep(.el-icon) {
  font-size: 18px;
}

.tab-label {
  font-size: 12px;
}
</style>
