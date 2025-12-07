<template>
  <div class="stock-list-page">
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title">股票市场</h1>
        <p class="page-subtitle">实时股票行情与市场动态</p>
      </div>
      <div class="header-actions">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="搜索股票代码或名称..." 
            v-model="searchQuery"
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <button class="search-button" @click="handleSearch">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
        <div class="action-buttons">
          <button class="sync-button" @click="syncStockData" :disabled="syncing">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            {{ syncing ? '同步中...' : '同步数据' }}
          </button>
          <button class="sync-button" @click="openHighModal" :disabled="syncHigning">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            {{ syncHigning ? '筛选中...' : '这个月还没有高于月初开盘价记录' }}
          </button>


          <button class="sync-button" @click="openContinuousModal" :disabled="syncConing">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            {{ syncConing ? '筛选中...' : '连续几天都是跌的股票' }}
          </button>
          <button class="refresh-button" @click="refreshData">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            刷新
          </button>
        </div>
      </div>
    </header>

    <!-- 市场概览 -->
    <section class="market-overview">
      <div class="overview-card">
        <div class="overview-item">
          <div class="overview-label">上证指数</div>
          <div class="overview-value">3,230.52</div>
          <div class="overview-change positive">+12.36 (+0.38%)</div>
        </div>
        <div class="overview-item">
          <div class="overview-label">深证成指</div>
          <div class="overview-value">10,987.45</div>
          <div class="overview-change negative">-25.18 (-0.23%)</div>
        </div>
        <div class="overview-item">
          <div class="overview-label">创业板指</div>
          <div class="overview-value">2,215.68</div>
          <div class="overview-change positive">+8.74 (+0.40%)</div>
        </div>
        <div class="overview-item">
          <div class="overview-label">恒生指数</div>
          <div class="overview-value">16,850.30</div>
          <div class="overview-change positive">+45.20 (+0.27%)</div>
        </div>
      </div>
    </section>

    <!-- 股票列表 -->
    <section class="stock-list-section">
      <div class="section-header">
        <h2 class="section-title">股票列表</h2>
        <div class="sort-options">
          <button 
            v-for="option in sortOptions" 
            :key="option.value"
            @click="changeSort(option.value)"
            class="sort-button"
            :class="{ active: currentSort === option.value }"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <div class="stock-table-container">
        <table class="stock-table">
          <thead>
            <tr>
              <th>代码</th>
              <th>名称</th>
              <th>最新价</th>
              <th>涨跌幅</th>
              <th>涨跌额</th>
              <th>成交量(手)</th>
              <th>成交额(亿)</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="stock in sortedFilteredStocks" 
              :key="stock.code"
              class="stock-row"
              @click="viewStockDetails(stock)"
            >
              <td class="stock-code">{{ stock.code }}</td>
              <td class="stock-name">{{ stock.name }}</td>
              <td class="stock-price">{{ stock.price }}</td>
              <td class="stock-change-percent" :class="getChangeClass(stock.changePercent)">
                {{ stock.changePercent > 0 ? '+' : '' }}{{ stock.changePercent }}%
              </td>
              <td class="stock-change" :class="getChangeClass(stock.change)">
                {{ stock.change > 0 ? '+' : '' }}{{ stock.change }}
              </td>
              <td class="stock-volume">{{ stock.volume }}</td>
              <td class="stock-turnover">{{ (stock.turnover / 100000000).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <button 
          class="pagination-button" 
          :disabled="currentPage === 1"
          @click="prevPage"
        >
          上一页
        </button>
        <span class="pagination-info">
          第 {{ currentPage }} 页，共 {{ totalPages }} 页
        </span>
        <button 
          class="pagination-button" 
          :disabled="currentPage === totalPages"
          @click="nextPage"
        >
          下一页
        </button>
      </div>
    </section>

    <!-- 自选股 -->
    <section class="watchlist-section">
      <div class="section-header">
        <h2 class="section-title">我的自选股</h2>
        <button class="add-watchlist-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          添加自选
        </button>
      </div>

      <div class="watchlist-container" v-if="watchlist.length > 0">
        <div 
          v-for="stock in watchlist" 
          :key="stock.code"
          class="watchlist-item"
          @click="viewStockDetails(stock)"
        >
          <div class="watchlist-basic">
            <div class="watchlist-name">{{ stock.name }}</div>
            <div class="watchlist-code">{{ stock.code }}</div>
          </div>
          <div class="watchlist-price-info">
            <div class="watchlist-price">{{ stock.price }}</div>
            <div class="watchlist-change" :class="getChangeClass(stock.changePercent)">
              {{ stock.changePercent > 0 ? '+' : '' }}{{ stock.changePercent }}%
            </div>
          </div>
        </div>
      </div>
      <div class="empty-watchlist" v-else>
        <p>暂无自选股，请添加关注的股票</p>
      </div>
    </section>

    <!-- 连续下跌股票弹窗 -->
    <div v-if="showContinuousModal" class="modal-overlay" @click="closeContinuousModal">
      <div class="modal-content" @click.stop>
        <h3>连续几天都是跌的股票</h3>
        <div class="form-group">
          <label>开始日期:</label>
          <input 
            type="date" 
            v-model="continuousStartDate" 
            class="form-control" 
            :min="twentyDaysAgo"
            :max="today"
          />
        </div>
        <div class="form-group">
          <label>Top值:</label>
          <input type="number" v-model="continuousTopValue" class="form-control" />
        </div>
        <div class="form-group">
          <label>连续天数:</label>
          <input type="number" v-model="continous" class="form-control" />
        </div>
        <div class="modal-actions">
          <button @click="closeContinuousModal" class="btn-cancel">取消</button>
          <button @click="selectConDataWithParams" class="btn-confirm">确认</button>
        </div>
      </div>
    </div>

    <!-- 高于月初开盘价记录弹窗 -->
    <div v-if="showHighModal" class="modal-overlay" @click="closeHighModal">
      <div class="modal-content" @click.stop>
        <h3>这个月还没有高于月初开盘价记录</h3>
        <div class="form-group">
          <label>开始日期:</label>
          <input 
            type="date" 
            v-model="highStartDate" 
            class="form-control" 
            :min="twentyDaysAgo"
            :max="today"
          />
        </div>
        <div class="form-group">
          <label>Top值:</label>
          <input type="number" v-model="highTopValue" class="form-control" />
        </div>
        <div class="modal-actions">
          <button @click="closeHighModal" class="btn-cancel">取消</button>
          <button @click="selectHignDataWithParams" class="btn-confirm">确认</button>
        </div>
      </div>
    </div>

    <!-- Loading遮罩 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p class="loading-text">数据加载中...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getStockList, syncStock, selectCon, selectHign } from '../api/stock.js'

interface Stock {
  code: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  turnover: number
  market: string
}

// 搜索查询
const router = useRouter()
const searchQuery = ref('')
const continous = ref('')

// 当前页码和总页数
const currentPage = ref(1)
const totalPages = ref(1)
const itemsPerPage = ref(20)

// 排序选项
const sortOptions = [
  { label: '涨幅', value: 'changePercent' },
  { label: '跌幅', value: 'changePercentDesc' },
  { label: '价格', value: 'price' },
  { label: '成交量', value: 'volume' }
]

const currentSort = ref('changePercent')

// 模拟股票数据
// const stocks = ref<Stock[]>([
//   { code: '600036', name: '招商银行', price: 35.68, change: 0.45, changePercent: 1.28, volume: 58642100, turnover: 2098765432, market: 'SH' },
//   { code: '000002', name: '万科A', price: 18.92, change: -0.24, changePercent: -1.25, volume: 32456700, turnover: 612345678, market: 'SZ' },
//   { code: '600030', name: '中信证券', price: 22.35, change: 0.68, changePercent: 3.14, volume: 78923400, turnover: 1756432109, market: 'SH' },
//   { code: '000858', name: '五粮液', price: 145.6, change: -1.2, changePercent: -0.82, volume: 12456700, turnover: 1812345678, market: 'SZ' },
//   { code: '600519', name: '贵州茅台', price: 1685.0, change: 25.5, changePercent: 1.54, volume: 2345670, turnover: 3987654321, market: 'SH' },
//   { code: '000001', name: '平安银行', price: 12.34, change: 0.18, changePercent: 1.48, volume: 45678900, turnover: 562345678, market: 'SZ' },
//   { code: '601318', name: '中国平安', price: 48.75, change: -0.35, changePercent: -0.71, volume: 34567800, turnover: 1687654321, market: 'SH' },
//   { code: '000333', name: '美的集团', price: 56.82, change: 0.92, changePercent: 1.65, volume: 23456700, turnover: 1323456789, market: 'SZ' },
//   { code: '600104', name: '上汽集团', price: 15.68, change: -0.12, changePercent: -0.76, volume: 12345600, turnover: 193456789, market: 'SH' },
//   { code: '000651', name: '格力电器', price: 42.35, change: 0.75, changePercent: 1.80, volume: 34567800, turnover: 1456789012, market: 'SZ' },
//   { code: '601166', name: '兴业银行', price: 18.92, change: 0.25, changePercent: 1.34, volume: 45678900, turnover: 867890123, market: 'SH' },
//   { code: '600000', name: '浦发银行', price: 9.87, change: -0.08, changePercent: -0.80, volume: 34567800, turnover: 341234567, market: 'SH' },
//   { code: '000009', name: '中国宝安', price: 12.34, change: 0.45, changePercent: 3.78, volume: 56789000, turnover: 698765432, market: 'SZ' },
//   { code: '600276', name: '恒瑞医药', price: 45.68, change: -0.72, changePercent: -1.55, volume: 23456700, turnover: 1067890123, market: 'SH' },
//   { code: '600887', name: '伊利股份', price: 32.45, change: 0.38, changePercent: 1.18, volume: 34567800, turnover: 1112345678, market: 'SH' },
// ])

// 从后端获取股票数据
const stocks = ref<Stock[]>([])

// 自选股列表
const watchlist = ref<Stock[]>([
  { code: '600036', name: '招商银行', price: 35.68, change: 0.45, changePercent: 1.28, volume: 58642100, turnover: 2098765432, market: 'SH' },
  { code: '600519', name: '贵州茅台', price: 1685.0, change: 25.5, changePercent: 1.54, volume: 2345670, turnover: 3987654321, market: 'SH' },
  { code: '000002', name: '万科A', price: 18.92, change: -0.24, changePercent: -1.25, volume: 32456700, turnover: 612345678, market: 'SZ' }
])

// 同步状态
const syncing = ref(false)
const syncHigning = ref(false)
const syncConing = ref(false)
const loading = ref(false)

// 弹窗控制变量
const showContinuousModal = ref(false)
const showHighModal = ref(false)

// 表单数据
const continuousStartDate = ref('')
const continuousTopValue = ref(10)
const highStartDate = ref('')
const highTopValue = ref(10)

// 计算过滤后的股票
// 注意：现在数据由后端过滤提供，前端仅在需要本地过滤时使用
const filteredStocks = computed(() => {
  // 如果搜索查询为空，直接返回所有股票
  if (!searchQuery.value) {
    return stocks.value
  }
  
  // 如果有搜索查询，但在分页时仍然显示，则进行本地过滤
  // 这种情况适用于后端未正确过滤或者我们需要额外的前端过滤
  const query = searchQuery.value.toLowerCase()
  return stocks.value.filter(stock => 
    stock.code.includes(query) || 
    stock.name.toLowerCase().includes(query)
  )
})

// 计算排序后的股票
const sortedFilteredStocks = computed(() => {
  const sorted = [...filteredStocks.value]
  
  switch (currentSort.value) {
    case 'changePercent':
      return sorted.sort((a, b) => b.changePercent - a.changePercent)
    case 'changePercentDesc':
      return sorted.sort((a, b) => a.changePercent - b.changePercent)
    case 'price':
      return sorted.sort((a, b) => b.price - a.price)
    case 'volume':
      return sorted.sort((a, b) => b.volume - a.volume)
    default:
      return sorted
  }
})

// 计算分页
// 总页数现在从后端获取，不再通过计算属性计算
// const totalPages = computed(() => {
//   return Math.ceil(sortedFilteredStocks.value.length / itemsPerPage.value)
// })

// 注意：paginatedStocks 已定义但似乎未被使用，可以考虑移除或使用它
const paginatedStocks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return sortedFilteredStocks.value.slice(start, end)
})

// 计算20天前的日期和今天的日期
const today = computed(() => {
  const now = new Date()
  return now.toISOString().split('T')[0]
})

const twentyDaysAgo = computed(() => {
  const now = new Date()
  const twentyDaysBefore = new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000)
  return twentyDaysBefore.toISOString().split('T')[0]
})

// 格式化成交量
const formatVolume = (volume: number) => {
  if (volume >= 100000000) {
    return (volume / 100000000).toFixed(2) + '亿'
  } else if (volume >= 10000) {
    return (volume / 10000).toFixed(2) + '万'
  }
  return volume.toString()
}

// 获取涨跌颜色类
const getChangeClass = (value: number) => {
  return {
    'positive': value > 0,
    'negative': value < 0,
    'neutral': value === 0
  }
}

// 分页操作
const prevPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--
    await refreshData()
  }
}

const nextPage = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    await refreshData()
  }
}

// 搜索操作
const handleSearch = async () => {
  // 搜索时重置到第一页
  currentPage.value = 1
  await refreshData()
}

// 改变排序方式
const changeSort = async (sortType: string) => {
  currentSort.value = sortType
  currentPage.value = 1
  await refreshData()
}

// 刷新数据
const refreshData = async () => {
  loading.value = true
  try {
    // 显示加载状态
    console.log('正在刷新股票数据...', {
      page: currentPage.value,
      size: itemsPerPage.value,
      search: searchQuery.value
    })
    
    // 调用后端接口获取数据，传递搜索关键词作为gpdm参数
    const data = await getStockList(currentPage.value, itemsPerPage.value, searchQuery.value)
    
    // 更新股票数据
    // 确保数据是一个数组，如果不是则尝试从中提取
    const stockData = Array.isArray(data) 
      ? data 
      : (data.stocks || data.data || data.list || data.content || [])
      
    stocks.value = stockData
    
    // 如果后端返回了分页信息，则更新总页数
    if (data && typeof data === 'object' && 'totalPages' in data) {
      totalPages.value = data.totalPages
    } else if (data && typeof data === 'object' && 'total' in data) {
      // 处理另一种常见的分页字段名
      totalPages.value = Math.ceil(data.total / itemsPerPage.value)
    } else {
      // 如果没有分页信息，默认为1页
      totalPages.value = 1
    }
    
    console.log('股票数据刷新完成', {
      stockCount: stockData.length,
      totalPages: totalPages.value
    })
  } catch (error) {
    console.error('获取股票数据失败:', error)
    // 可以在这里添加错误提示
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取数据
onMounted(() => {
  refreshData()
})

// 查看股票详情
const viewStockDetails = (stock: Stock) => {
  router.push(`/stock/${stock.code}`)
}

// 同步股票数据
const syncStockData = async () => {
  syncing.value = true
  loading.value = true
  try {
    // 这里应该是调用实际的同步API接口
    // 模拟同步过程
    console.log('开始同步股票数据...')
    
    // 显示同步进度
    // 实际项目中这里应该调用后端的同步接口
    await syncStock()

    console.log('股票数据同步完成')
    // 同步完成后刷新数据
    await refreshData()
  } catch (error) {
    console.error('股票数据同步失败:', error)
  } finally {
    syncing.value = false
    loading.value = false
  }
}

// 打开连续下跌股票弹窗
const openContinuousModal = () => {
  showContinuousModal.value = true
}

// 关闭连续下跌股票弹窗
const closeContinuousModal = () => {
  showContinuousModal.value = false
}

// 打开高于月初开盘价记录弹窗
const openHighModal = () => {
  showHighModal.value = true
}

// 关闭高于月初开盘价记录弹窗
const closeHighModal = () => {
  showHighModal.value = false
}

// 带参数选择连续下跌股票数据
const selectConDataWithParams = async () => {
  syncConing.value = true
  loading.value = true
  closeContinuousModal()
  try {
    console.log('连续几天都是跌的股票...', {
      startDate: continuousStartDate.value,
      topValue: continuousTopValue.value,
      continous: continous.value
    })
    
    // 实际项目中这里应该调用带参数的后端接口
    await selectCon(continous.value)

    console.log('连续几天都是跌的股票筛选完成')
    // 筛选完成后刷新数据
    await refreshData()
  } catch (error) {
    console.error('股票数据筛选失败:', error)
  } finally {
    syncConing.value = false
    loading.value = false
  }
}

// 带参数选择高于月初开盘价记录数据
const selectHignDataWithParams = async () => {
  syncHigning.value = true
  loading.value = true
  closeHighModal()
  try {
    console.log('这个月还没有高于月初开盘价记录筛选...', {
      startDate: highStartDate.value,
      topValue: highTopValue.value
    })

    // 实际项目中这里应该调用带参数的后端接口
    await selectHign()

    console.log('这个月还没有高于月初开盘价记录筛选成功')
    // 筛选完成后刷新数据
    await refreshData()
  } catch (error) {
    console.error('股票数据筛选失败:', error)
  } finally {
    syncHigning.value = false
    loading.value = false
  }
}

const selectConData = async () => {
  syncConing.value = true
  loading.value = true
  try {
    // 这里应该是调用实际的同步API接口
    // 模拟同步过程
    console.log('连续几天都是跌的股票...')
    const query = continous.value.toLowerCase()
    // 显示同步进度
    // 实际项目中这里应该调用后端的同步接口
    await selectCon(query)

    console.log('连续几天都是跌的股票筛选完成')
    // 同步完成后刷新数据
    await refreshData()
  } catch (error) {
    console.error('股票数据同步失败:', error)
  } finally {
    syncConing.value = false
    loading.value = false
  }
}

const selectHignData = async () => {
  syncHigning.value = true
  loading.value = true
  try {
    // 这里应该是调用实际的同步API接口
    // 模拟同步过程
    console.log('这个月还没有高于月初开盘价记录筛选...')

    // 显示同步进度
    // 实际项目中这里应该调用后端的同步接口
    await selectHign()

    console.log('这个月还没有高于月初开盘价记录筛选成功')
    // 同步完成后刷新数据
    await refreshData()
  } catch (error) {
    console.error('股票数据同步失败:', error)
  } finally {
    syncHigning.value = false
    loading.value = false
  }
}

</script>

<style scoped>
.stock-list-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
  padding: 2rem 1rem;
  position: relative;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.header-content {
  text-align: center;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.search-box {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 50px;
  padding: 0.5rem 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
}

.search-input {
  border: none;
  outline: none;
  padding: 0.5rem;
  width: 250px;
  font-size: 1rem;
  background: transparent;
}

.search-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.sync-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  color: white;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
}

.sync-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

.sync-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.refresh-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.refresh-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.market-overview {
  margin-bottom: 2rem;
}

.overview-card {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.overview-item {
  text-align: center;
  padding: 1rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.5);
}

.overview-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.overview-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.25rem;
}

.overview-change {
  font-size: 0.9rem;
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

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
}

.sort-options {
  display: flex;
  gap: 0.5rem;
}

.sort-button {
  padding: 0.5rem 1rem;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.05);
  color: #555;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sort-button:hover {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.sort-button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.stock-table-container {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  margin-bottom: 2rem;
  overflow-x: auto;
}

.stock-table {
  width: 100%;
  border-collapse: collapse;
}

.stock-table th {
  text-align: left;
  padding: 1rem;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #eee;
}

.stock-table td {
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  color: #555;
}

.stock-row {
  cursor: pointer;
  transition: background 0.2s ease;
}

.stock-row:hover {
  background: rgba(102, 126, 234, 0.05);
}

.stock-code {
  font-weight: 600;
  color: #333;
}

.stock-name {
  font-weight: 500;
}

.stock-price {
  font-weight: 600;
}

.stock-change-percent,
.stock-change {
  font-weight: 600;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.pagination-button {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.05);
  color: #555;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-button:hover:not(:disabled) {
  background: rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: #666;
  font-weight: 500;
}

.watchlist-section {
  margin-top: 2rem;
}

.add-watchlist-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.05);
  color: #555;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-watchlist-button:hover {
  background: rgba(102, 126, 234, 0.1);
}

.watchlist-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.watchlist-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.watchlist-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
}

.watchlist-basic {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.watchlist-name {
  font-weight: 600;
  color: #333;
}

.watchlist-code {
  font-size: 0.8rem;
  color: #999;
}

.watchlist-price-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.watchlist-price {
  font-weight: 600;
}

.empty-watchlist {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  color: #999;
  font-size: 1rem;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow: auto;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  min-width: 300px;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}

.btn-cancel,
.btn-confirm {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background-color: #f1f5f9;
  color: #666;
}

.btn-cancel:hover {
  background-color: #e2e8f0;
}

.btn-confirm {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-confirm:hover {
  opacity: 0.9;
}

/* Loading遮罩样式 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: white;
  font-size: 1.2rem;
  margin-top: 1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stock-list-page {
    padding: 1rem;
  }
  
  .page-header {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .header-actions {
    flex-direction: column;
  }
  
  .search-box {
    width: 100%;
  }
  
  .search-input {
    width: 100%;
  }
  
  .overview-card {
    grid-template-columns: 1fr 1fr;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .stock-table-container {
    padding: 1rem;
  }
  
  .stock-table th,
  .stock-table td {
    padding: 0.75rem 0.5rem;
    font-size: 0.9rem;
  }
  
  .watchlist-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .overview-card {
    grid-template-columns: 1fr;
  }
  
  .sort-options {
    flex-wrap: wrap;
  }
  
  .modal-content {
    margin: 1rem;
    padding: 1.5rem;
  }
}
</style>