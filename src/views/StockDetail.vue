<template>
  <div class="stock-detail-page">
    <!-- 返回按钮 -->
    <div class="back-button-container">
      <button class="back-button" @click="goBack">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        返回列表
      </button>
    </div>

    <!-- 股票基本信息 -->
    <div class="stock-header" v-if="currentStock">
      <div class="stock-basic-info">
        <div class="stock-code-name">
          <h1 class="stock-name">{{ currentStock.name }}</h1>
          <div class="stock-code">{{ currentStock.code }}</div>
        </div>
        <div class="stock-price-info">
          <div class="current-price">{{ currentStock.price.toFixed(2) }}</div>
          <div class="price-change" :class="getChangeClass(currentStock.change)">
            {{ currentStock.change > 0 ? '+' : '' }}{{ currentStock.change.toFixed(2) }}
          </div>
          <div class="change-percent" :class="getChangeClass(currentStock.changePercent)">
            {{ currentStock.changePercent > 0 ? '+' : '' }}{{ currentStock.changePercent.toFixed(2) }}%
          </div>
        </div>
      </div>

      <div class="stock-stats">
        <div class="stat-item">
          <div class="stat-label">今开</div>
          <div class="stat-value">{{ (currentStock.price - currentStock.change).toFixed(2) }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">昨收</div>
          <div class="stat-value">{{ (currentStock.price - currentStock.change).toFixed(2) }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">最高</div>
          <div class="stat-value">{{ (currentStock.price + 1.2).toFixed(2) }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">最低</div>
          <div class="stat-value">{{ (currentStock.price - 1.5).toFixed(2) }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">成交量</div>
          <div class="stat-value">{{ currentStock.volume }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">成交额</div>
          <div class="stat-value">{{ formatTurnover(currentStock.turnover) }}</div>
        </div>
      </div>
    </div>

    <!-- 图表和历史数据 -->
    <div class="chart-section">
      <div class="section-tabs">
        <button 
          v-for="tab in chartTabs" 
          :key="tab.value"
          @click="activeTab = tab.value"
          class="tab-button"
          :class="{ active: activeTab === tab.value }"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="chart-container">
        <div class="chart-placeholder">
          <div class="chart-title">{{ getChartTitle() }}</div>
          <!-- 改进的K线图 -->
          <div class="k-line-container">
            <div class="price-scale">
              <div 
                v-for="(price, index) in priceScale" 
                :key="index" 
                class="price-label"
              >
                {{ price.toFixed(2) }}
              </div>
            </div>
            <div class="main-chart-area">
              <!-- 左箭头 -->
              <button 
                class="scroll-arrow left-arrow" 
                @click="scrollLeft"
                :disabled="scrollPosition <= 0"
              >
                ←
              </button>
              
              <div 
                class="scrollable-chart" 
                ref="chartContainer" 
                @wheel.prevent="handleWheel"
                @mousedown="startDrag"
                style="cursor: grab;"
              >
                <div class="k-line-chart-wrapper" :style="{ width: chartWidth + 'px', transform: 'translateX(' + (-scrollPosition) + 'px)' }">
                  <div 
                    v-for="(point, index) in kLineData" 
                    :key="index" 
                    class="k-line-item"
                    @mouseenter="showTooltip(index, $event)"
                    @mouseleave="hideTooltip"
                  >
                    <div class="k-line-wrapper">
                      <!-- 最高价到最低价的线 -->
                      <div 
                        class="k-line-range"
                        :style="{
                          height: Math.abs(point.high - point.low) * point.scale + 'px'
                        }"
                      ></div>
                      
                      <!-- 实体部分（开盘价到收盘价） -->
                      <div 
                        class="k-line-body"
                        :class="{ 'positive': point.close > point.open, 'negative': point.close <= point.open }"
                        :style="{
                          height: Math.max(1, Math.abs(point.close - point.open) * point.scale) + 'px',
                          marginTop: Math.max(0, (point.high - Math.max(point.open, point.close)) * point.scale) + 'px',
                          marginBottom: Math.max(0, (Math.min(point.open, point.close) - point.low) * point.scale) + 'px'
                        }"
                      ></div>
                    </div>
                    <!-- 时间标签 -->
                    <div class="time-label">{{ index + 1 }}天</div>
                  </div>
                </div>
              </div>
              
              <!-- 右箭头 -->
              <button 
                class="scroll-arrow right-arrow" 
                @click="scrollRight"
                :disabled="scrollPosition >= maxScroll"
              >
                →
              </button>
            </div>
          </div>
          
          <!-- 成交量图表 -->
          <div class="volume-chart-container">
            <div class="volume-scale">
              <div class="volume-label">成交量</div>
            </div>
            <div 
              class="scrollable-volume" 
              ref="volumeContainer" 
              @wheel.prevent="handleWheel"
              @mousedown="startDrag"
              style="cursor: grab;"
            >
              <div class="volume-chart" :style="{ width: chartWidth + 'px', transform: 'translateX(' + (-scrollPosition) + 'px)' }">
                <div 
                  v-for="(point, index) in kLineData" 
                  :key="index" 
                  class="volume-bar"
                  :class="{ 'positive': point.close > point.open, 'negative': point.close <= point.open }"
                  :style="{
                    height: Math.max(5, (point.volume / Math.max(...volumeData)) * 80) + 'px'
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 鼠标悬停提示框 -->
    <div 
      v-if="tooltipVisible" 
      class="tooltip"
      :style="{ left: tooltipPosition.x + 'px', top: tooltipPosition.y + 'px' }"
    >
      <div class="tooltip-content">
        <div class="tooltip-title">交易详情</div>
        <div class="tooltip-data" v-if="kLineData[hoveredIndex]">
          <div class="tooltip-row">
            <span class="label">日期:</span>
            <span class="value">{{ kLineData[hoveredIndex].date }}</span>
          </div>
          <div class="tooltip-row">
            <span class="label">开盘价:</span>
            <span class="value">{{ kLineData[hoveredIndex].open.toFixed(2) }}</span>
          </div>
          <div class="tooltip-row">
            <span class="label">最高价:</span>
            <span class="value">{{ kLineData[hoveredIndex].high.toFixed(2) }}</span>
          </div>
          <div class="tooltip-row">
            <span class="label">最低价:</span>
            <span class="value">{{ kLineData[hoveredIndex].low.toFixed(2) }}</span>
          </div>
          <div class="tooltip-row">
            <span class="label">收盘价:</span>
            <span class="value">{{ kLineData[hoveredIndex].close.toFixed(2) }}</span>
          </div>
          <div class="tooltip-row">
            <span class="label">成交量:</span>
            <span class="value">{{ formatVolume(kLineData[hoveredIndex].volume) }}</span>
          </div>
          <div class="tooltip-row">
            <span class="label">涨跌:</span>
            <span 
              class="value" 
              :class="getChangeClass(kLineData[hoveredIndex].changePercent)"
            >
              {{ kLineData[hoveredIndex].change }}
              ({{kLineData[hoveredIndex].changePercent }}%)
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 历史交易记录 -->
    <div class="history-section">
      <h2 class="section-title">历史交易记录</h2>
      <div class="history-table-container">
        <table class="history-table">
          <thead>
            <tr>
              <th>日期</th>
              <th>开盘价</th>
              <th>最高价</th>
              <th>最低价</th>
              <th>收盘价</th>
              <th>涨跌幅</th>
              <th>成交量</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(record, index) in historyRecords" :key="index">
              <td>{{ record.date }}</td>
              <td>{{ record.open.toFixed(2) }}</td>
              <td>{{ record.high.toFixed(2) }}</td>
              <td>{{ record.low.toFixed(2) }}</td>
              <td>{{ record.close.toFixed(2) }}</td>
              <td :class="getChangeClass(record.changePercent)">
                {{ record.changePercent > 0 ? '+' : '' }}{{ record.changePercent.toFixed(2) }}%
              </td>
              <td>{{ record.volume }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {getStockList, queryStockDetail} from '../api/stock.js'

interface Stock {
  code: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  turnover: number
}

interface HistoryRecord {
  date: string
  open: number
  high: number
  low: number
  close: number
  changePercent: number
  change: number
  volume: number
}

interface KLinePoint {
  date: string
  open: number
  high: number
  low: number
  close: number
  scale: number
  volume: number
  change: number
  changePercent: number
}

// 路由相关
const route = useRoute()
const router = useRouter()

// 当前股票信息
const currentStock = ref<Stock | null>(null)

// 激活的标签页
const activeTab = ref('daily')

// 图表标签页
const chartTabs = [
  { label: '日K', value: 'daily' },
  { label: '周K', value: 'weekly' },
  { label: '月K', value: 'monthly' }
]

// K线图数据
const kLineData = ref<KLinePoint[]>([])

// 价格刻度
const priceScale = ref<number[]>([])

// 时间刻度
const timeScale = ref<string[]>([])

// 成交量数据
const volumeData = ref<number[]>([])

// 图表容器引用
const chartContainer = ref<HTMLElement | null>(null)
const volumeContainer = ref<HTMLElement | null>(null)

// 滚动位置
const scrollPosition = ref(0)
const scrollStep = 100 // 每次滚动的距离

// 鼠标拖动相关
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartScroll = ref(0)

// 鼠标悬停相关
const tooltipVisible = ref(false)
const tooltipPosition = ref({ x: 0, y: 0 })
const hoveredIndex = ref(-1)

// 模拟历史交易记录
const historyRecords = ref<HistoryRecord[]>([])

// 图表宽度计算
const chartWidth = computed(() => {
  // 每个K线项的宽度为30px + 10px margin = 40px，加上间距
  return kLineData.value.length * 40
})

// 最大滚动距离
const maxScroll = computed(() => {
  if (!chartContainer.value) return 0
  return Math.max(0, chartWidth.value - chartContainer.value.clientWidth)
})

// 获取图表标题
const getChartTitle = () => {
  switch(activeTab.value) {
    case 'daily': return '日K线图';
    case 'weekly': return '周K线图';
    case 'monthly': return '月K线图';
    default: return 'K线图';
  }
}

// 获取涨跌颜色类
const getChangeClass = (value: number) => {
  return {
    'positive': value > 0,
    'negative': value < 0,
    'neutral': value === 0
  }
}

// 格式化成交量
const formatVolume = (volume: number) => {
  if (volume >= 100000000) {
    return (volume / 100000000).toFixed(2) + '亿'
  } else if (volume >= 10000) {
    return (volume / 10000).toFixed(2) + '万'
  }
  return volume.toString()
}

// 格式化成交额
const formatTurnover = (turnover: number) => {
  return (turnover / 100000000).toFixed(2) + '亿'
}

// 返回列表
const goBack = () => {
  router.back()
}

// 向左滚动
const scrollLeft = () => {
  scrollPosition.value = Math.max(0, scrollPosition.value - scrollStep)
}

// 向右滚动
const scrollRight = () => {
  if (chartContainer.value) {
    const max = maxScroll.value
    scrollPosition.value = Math.min(max, scrollPosition.value + scrollStep)
  }
}

// 处理鼠标滚轮事件
const handleWheel = (event: WheelEvent) => {
  if (event.deltaY > 0) {
    scrollRight()
  } else {
    scrollLeft()
  }
}

// 开始拖动
const startDrag = (event: MouseEvent) => {
  isDragging.value = true
  dragStartX.value = event.clientX
  dragStartScroll.value = scrollPosition.value
  if (chartContainer.value) {
    chartContainer.value.style.cursor = 'grabbing'
  }
  event.preventDefault()
}

// 拖动中
const onDrag = (event: MouseEvent) => {
  if (!isDragging.value) return
  
  const deltaX = event.clientX - dragStartX.value
  const newScrollPosition = dragStartScroll.value - deltaX
  
  // 限制滚动范围
  scrollPosition.value = Math.max(0, Math.min(maxScroll.value, newScrollPosition))
}

// 结束拖动
const endDrag = () => {
  isDragging.value = false
  if (chartContainer.value) {
    chartContainer.value.style.cursor = 'default'
  }
}

// 显示提示框
const showTooltip = (index: number, event: MouseEvent) => {
  if (isDragging.value) return // 拖动时不显示提示框
  
  hoveredIndex.value = index
  tooltipVisible.value = true
  
  // 获取窗口尺寸
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  
  // 设置初始位置
  let x = event.clientX
  let y = event.clientY - 20
  
  // 提示框尺寸估算（可以根据实际情况调整）
  const tooltipWidth = 200
  const tooltipHeight = 180
  
  // 检查右侧是否超出
  if (x + tooltipWidth > windowWidth) {
    x = windowWidth - tooltipWidth - 10
  }
  
  // 检查底部是否超出
  if (y + tooltipHeight > windowHeight) {
    y = windowHeight - tooltipHeight - 10
  }
  
  // 检查左侧是否超出
  if (x < 10) {
    x = 10
  }
  
  // 检查顶部是否超出
  if (y < 10) {
    y = 10
  }
  
  // 计算提示框位置
  tooltipPosition.value = { x, y }
}

// 隐藏提示框
const hideTooltip = () => {
  tooltipVisible.value = false
}

// 生成K线图数据
const generateKLineData = (kLineData: HistoryRecord[]) => {
  const data: KLinePoint[] = []

  let baseVolume = 1000000
  for (let i = 0; i < kLineData.length; i++) {
    const open = kLineData[i].open
    const change = kLineData[i].change // 调整波动幅度
    const changePercent = kLineData[i].changePercent // 调整波动幅度
    const close = kLineData[i].close
    const high = Math.max(open, close)
    const low = Math.min(open, close)
    const volume = baseVolume + Math.random() * 2000000 // 随机成交量

    // 生成日期字符串 (模拟最近40天的数据)
    const date = new Date()
    date.setDate(date.getDate() - (39 - i))
    const dateString = kLineData[i].date

    // 更新下一个开盘价

    data.push({
      volume: 0,
      date: dateString,
      open: open,
      high: high,
      low: low,
      close: close,
      scale: 25,
      changePercent: changePercent,
      change:change
    })
  }
  


  return data
}

// 计算价格刻度
const calculatePriceScale = (data: KLinePoint[]) => {
  if (data.length === 0) return []
  
  const prices = data.flatMap(point => [point.high, point.low])
  const maxPrice = Math.max(...prices)
  const minPrice = Math.min(...prices)
  const range = maxPrice - minPrice
  const step = range / 5
  
  const scale = []
  for (let i = 0; i <= 5; i++) {
    scale.push(maxPrice - i * step)
  }
  
  return scale
}

// 生成时间刻度
const generateTimeScale = (count: number) => {
  const scale = []
  for (let i = 0; i < count; i += 3) {
    scale.push(`${count - i}天前`)
  }
  return scale
}

// 计算成交量数据
const calculateVolumeData = (data: KLinePoint[]) => {
  return data.map(point => point.volume)
}

// 刷新数据
const refreshData = async () => {
  // 模拟从路由参数获取股票代码
  const stockCode = route.query.code || '600036'
  console.log(route)

  // 模拟根据股票代码获取股票信息
  const mockStockData: Record<string, Stock> = {
    '600036': {
      code: '600036',
      name: '招商银行',
      price: 35.68,
      change: 0.45,
      changePercent: 1.28,
      volume: 58642100,
      turnover: 2098765432
    }
  }

  const data = await queryStockDetail(stockCode);
  const stockData = Array.isArray(data)
      ? data
      : (data.stocks || data.data || data.list || data.content || [])

  historyRecords.value = stockData
  currentStock.value = stockData[0]
  
  // 生成K线图数据
  if (currentStock.value) {
    kLineData.value = generateKLineData(historyRecords.value)
    priceScale.value = calculatePriceScale(kLineData.value)
    timeScale.value = generateTimeScale(kLineData.value.length)
    volumeData.value = calculateVolumeData(kLineData.value)
  }
}

// 初始化数据
onMounted(() => {
  refreshData()
  
  // 添加全局鼠标事件监听器
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', endDrag)
})

// 组件卸载时清理事件监听器
// onUnmounted(() => {
//   window.removeEventListener('mousemove', onDrag)
//   window.removeEventListener('mouseup', endDrag)
// })
</script>

<style scoped>
.stock-detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
  padding: 2rem 1rem;
  position: relative;
}

.back-button-container {
  margin-bottom: 1.5rem;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.05);
  color: #555;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.back-button:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.stock-header {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.stock-basic-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.stock-code-name {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stock-name {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.stock-code {
  font-size: 1.2rem;
  color: #999;
}

.stock-price-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.current-price {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
}

.price-change {
  font-size: 1.2rem;
  font-weight: 600;
}

.change-percent {
  font-size: 1.2rem;
  font-weight: 600;
}

.positive {
  color: #e74c3c!important;
}

.negative {
  color: #2ecc71!important;
}

.neutral {
  color: #666!important;
}

.stock-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #999;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.chart-section {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.section-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.tab-button {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.05);
  color: #555;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-button:hover {
  background: rgba(102, 126, 234, 0.1);
}

.tab-button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chart-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.k-line-container {
  display: flex;
  height: 300px;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1rem;
  position: relative;
}

.price-scale {
  width: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 0;
}

.price-label {
  font-size: 0.7rem;
  color: #666;
  text-align: right;
  padding-right: 5px;
}

.main-chart-area {
  flex: 1;
  display: flex;
  align-items: center;
  position: relative;
}

.scroll-arrow {
  background: rgba(102, 126, 234, 0.8);
  border: none;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  transition: all 0.3s ease;
}

.scroll-arrow:hover:not(:disabled) {
  background: rgba(102, 126, 234, 1);
  transform: scale(1.1);
}

.scroll-arrow:disabled {
  background: rgba(102, 126, 234, 0.3);
  cursor: not-allowed;
}

.left-arrow {
  margin-right: 5px;
}

.right-arrow {
  margin-left: 5px;
}

.scrollable-chart {
  flex: 1;
  overflow: hidden;
  padding: 10px 0;
  position: relative;
}

.k-line-chart-wrapper {
  display: flex;
  align-items: flex-end;
  height: 100%;
  position: absolute;
  transition: transform 0.3s ease;
}

.k-line-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  min-width: 30px;
  margin: 0 5px;
  cursor: pointer;
  position: relative;
}

.k-line-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
}

.k-line-range {
  position: absolute;
  width: 2px;
  background-color: #999;
  left: 50%;
  transform: translateX(-50%);
  top: 0;
}

.k-line-body {
  width: 80%;
  min-height: 2px;
  margin: 0 auto;
  border-radius: 2px;
  position: relative;
  z-index: 2;
}

.k-line-body.positive {
  background-color: #e74c3c;
}

.k-line-body.negative {
  background-color: #2ecc71;
}

.time-label {
  font-size: 0.7rem;
  color: #666;
  margin-top: 5px;
  white-space: nowrap;
}

.volume-chart-container {
  display: flex;
  height: 100px;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 0.5rem 1rem;
  margin-top: 1rem;
}

.volume-scale {
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.volume-label {
  font-size: 0.7rem;
  color: #666;
}

.scrollable-volume {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.volume-chart {
  display: flex;
  align-items: flex-end;
  height: 100%;
  position: absolute;
  transition: transform 0.3s ease;
}

.volume-bar {
  width: 20px;
  border-radius: 2px 2px 0 0;
  min-height: 2px;
  margin: 0 5px;
}

.volume-bar.positive {
  background-color: rgba(231, 76, 60, 0.7);
}

.volume-bar.negative {
  background-color: rgba(46, 204, 113, 0.7);
}

.tooltip {
  position: fixed;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  padding: 10px;
  z-index: 1000;
  pointer-events: none;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-width: 180px;
}

.tooltip-content {
  color: white;
}

.tooltip-title {
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 5px;
}

.tooltip-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 0.9rem;
}

.tooltip-row:last-child {
  margin-bottom: 0;
}

.label {
  font-weight: 500;
}

.value {
  font-weight: 600;
}

.value.positive {
  color: #e74c3c;
}

.value.negative {
  color: #2ecc71;
}

.history-section {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 1.5rem 0;
}

.history-table-container {
  overflow-x: auto;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
}

.history-table th {
  text-align: left;
  padding: 1rem;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #eee;
  white-space: nowrap;
}

.history-table td {
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  color: #555;
  white-space: nowrap;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stock-detail-page {
    padding: 1rem;
  }
  
  .stock-header {
    padding: 1rem;
  }
  
  .stock-basic-info {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .stock-price-info {
    align-items: flex-start;
  }
  
  .current-price {
    font-size: 2rem;
  }
  
  .stock-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .chart-section {
    padding: 1rem;
  }
  
  .history-section {
    padding: 1rem;
  }
  
  .history-table th,
  .history-table td {
    padding: 0.75rem 0.5rem;
    font-size: 0.9rem;
  }
  
  .price-scale {
    width: 40px;
  }
  
  .price-label {
    font-size: 0.6rem;
  }
  
  .time-label {
    font-size: 0.6rem;
  }
  
  .k-line-item {
    min-width: 20px;
  }
  
  .volume-bar {
    width: 12px;
  }
  
  .scroll-arrow {
    width: 25px;
    height: 25px;
    font-size: 0.8rem;
  }
}
</style>