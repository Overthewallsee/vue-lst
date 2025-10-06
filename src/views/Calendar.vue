<template>
  <div class="calendar-page">
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="header-content">
        <button @click="goBack" class="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 class="page-title">📅 日历安排</h1>
        <div class="header-actions">
          <button @click="today" class="today-button">今天</button>
          <button @click="toggleView" class="view-toggle">
            {{ currentView === 'month' ? '月视图' : '周视图' }}
          </button>
        </div>
      </div>
    </header>

    <!-- 日历导航 -->
    <div class="calendar-navigation">
      <button @click="prevPeriod" class="nav-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <h2 class="current-period">{{ displayPeriod }}</h2>
      <button @click="nextPeriod" class="nav-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>

    <!-- 月视图 -->
    <div v-if="currentView === 'month'" class="calendar-view month-view">
      <!-- 星期标题 -->
      <div class="weekdays">
        <div class="weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
      </div>
      
      <!-- 日期网格 -->
      <div class="calendar-grid">
        <div 
          v-for="day in calendarDays" 
          :key="day.date"
          class="calendar-day"
          :class="{ 
            'current-month': day.isCurrentMonth,
            'today': day.isToday,
            'selected': day.isSelected
          }"
          @click="selectDate(day)"
        >
          <div class="day-header">
            <span class="day-number">{{ day.day }}</span>
            <span v-if="hasEvents(day.date)" class="event-indicator"></span>
          </div>
          <div class="day-events">
            <div 
              v-for="event in getEventsForDay(day.date).slice(0, 2)" 
              :key="event.id"
              class="event-preview"
              :style="{ borderLeftColor: event.color }"
            >
              {{ event.title }}
            </div>
            <div v-if="getEventsForDay(day.date).length > 2" class="more-events">
              +{{ getEventsForDay(day.date).length - 2 }} 更多
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 周视图 -->
    <div v-else class="calendar-view week-view">
      <div class="week-header">
        <div class="time-column"></div>
        <div 
          v-for="day in weekDays" 
          :key="day.date"
          class="week-day-header"
          :class="{ 'today': day.isToday }"
        >
          <div class="day-name">{{ day.name }}</div>
          <div class="day-date">{{ day.date }}</div>
        </div>
      </div>
      <div class="week-grid">
        <div class="time-column">
          <div v-for="hour in 24" :key="hour" class="time-slot">
            {{ hour === 24 ? '0:00' : hour + ':00' }}
          </div>
        </div>
        <div class="week-days">
          <div 
            v-for="day in weekDays" 
            :key="day.date"
            class="week-day"
          >
            <div 
              v-for="hour in 24" 
              :key="hour"
              class="hour-slot"
              @click="createEvent(day.date, hour)"
            ></div>
            <div 
              v-for="event in getEventsForDay(day.date)" 
              :key="event.id"
              class="week-event"
              :style="{
                top: event.startHour * 60 + event.startMinute + 'px',
                height: (event.endHour - event.startHour) * 60 + (event.endMinute - event.startMinute) + 'px',
                borderLeftColor: event.color
              }"
              @click="openEventModal(event)"
            >
              <div class="event-title">{{ event.title }}</div>
              <div class="event-time">{{ formatTime(event.startHour, event.startMinute) }} - {{ formatTime(event.endHour, event.endMinute) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 事件列表 -->
    <div class="events-panel">
      <div class="panel-header">
        <h3>{{ selectedDate ? formatDate(selectedDate) : '事件列表' }}</h3>
        <button @click="openCreateEventModal" class="add-event-button">+</button>
      </div>
      <div class="events-list">
        <div 
          v-for="event in selectedDateEvents" 
          :key="event.id"
          class="event-item"
          :style="{ borderLeftColor: event.color }"
          @click="openEventModal(event)"
        >
          <div class="event-time">{{ formatTime(event.startHour, event.startMinute) }}</div>
          <div class="event-content">
            <div class="event-title">{{ event.title }}</div>
            <div class="event-description">{{ event.description }}</div>
          </div>
        </div>
        <div v-if="selectedDateEvents.length === 0" class="no-events">
          没有安排事件
        </div>
      </div>
    </div>

    <!-- 创建/编辑事件模态框 -->
    <div v-if="showEventModal" class="modal-overlay" @click="closeEventModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeEventModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div class="modal-header">
          <h2>{{ editingEvent ? '编辑事件' : '创建事件' }}</h2>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label for="event-title">标题</label>
            <input 
              id="event-title" 
              v-model="eventForm.title" 
              type="text" 
              placeholder="事件标题"
              class="form-input"
            />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="event-date">日期</label>
              <input 
                id="event-date" 
                v-model="eventForm.date" 
                type="date" 
                class="form-input"
              />
            </div>
            
            <div class="form-group">
              <label for="event-color">颜色</label>
              <select id="event-color" v-model="eventForm.color" class="form-input">
                <option value="#667eea">蓝色</option>
                <option value="#f093fb">粉色</option>
                <option value="#43e97b">绿色</option>
                <option value="#fa709a">橙色</option>
                <option value="#89f7fe">青色</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="event-start-time">开始时间</label>
              <div class="time-inputs">
                <input 
                  id="event-start-time" 
                  v-model="eventForm.startHour" 
                  type="number" 
                  min="0" 
                  max="23"
                  class="time-input"
                />:
                <input 
                  v-model="eventForm.startMinute" 
                  type="number" 
                  min="0" 
                  max="59"
                  class="time-input"
                />
              </div>
            </div>
            
            <div class="form-group">
              <label for="event-end-time">结束时间</label>
              <div class="time-inputs">
                <input 
                  id="event-end-time" 
                  v-model="eventForm.endHour" 
                  type="number" 
                  min="0" 
                  max="23"
                  class="time-input"
                />:
                <input 
                  v-model="eventForm.endMinute" 
                  type="number" 
                  min="0" 
                  max="59"
                  class="time-input"
                />
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="event-description">描述</label>
            <textarea 
              id="event-description" 
              v-model="eventForm.description" 
              placeholder="事件描述"
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>
        </div>
        
        <div class="modal-footer">
          <button 
            v-if="editingEvent" 
            @click="deleteEvent" 
            class="btn-danger"
          >
            删除
          </button>
          <button 
            @click="saveEvent" 
            class="btn-primary"
            :disabled="!eventForm.title || !eventForm.date"
          >
            {{ editingEvent ? '更新' : '创建' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

interface CalendarEvent {
  id: string
  title: string
  description: string
  date: string // YYYY-MM-DD
  startHour: number
  startMinute: number
  endHour: number
  endMinute: number
  color: string
}

// 添加一个新的日期格式化函数，避免时区问题
const formatDateForCompare = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const router = useRouter()

// 当前视图 (月/周)
const currentView = ref<'month' | 'week'>('month')

// 当前日期
const currentDate = ref(new Date())

// 选中的日期
const selectedDate = ref<string | null>(null)

// 事件数据
const events = ref<CalendarEvent[]>([
  {
    id: '1',
    title: '团队会议',
    description: '讨论项目进展和下一步计划',
    date: formatDateForCompare(new Date()),
    startHour: 9,
    startMinute: 0,
    endHour: 10,
    endMinute: 30,
    color: '#667eea'
  },
  {
    id: '2',
    title: '午餐约会',
    description: '与客户共进午餐',
    date: formatDateForCompare(new Date()),
    startHour: 12,
    startMinute: 30,
    endHour: 13,
    endMinute: 30,
    color: '#f093fb'
  }
])

// 事件表单
const eventForm = ref({
  title: '',
  description: '',
  date: formatDateForCompare(new Date()),
  startHour: 9,
  startMinute: 0,
  endHour: 10,
  endMinute: 0,
  color: '#667eea'
})

// 模态框状态
const showEventModal = ref(false)
const editingEvent = ref<CalendarEvent | null>(null)

// 星期标题
const weekdays = ['日', '一', '二', '三', '四', '五', '六']

// 切换视图
const toggleView = () => {
  currentView.value = currentView.value === 'month' ? 'week' : 'month'
}

// 返回功能页面
const goBack = () => {
  router.push('/features')
}

// 跳转到今天
const today = () => {
  currentDate.value = new Date()
  selectedDate.value = formatDateForCompare(currentDate.value)
}

// 上一个周期
const prevPeriod = () => {
  if (currentView.value === 'month') {
    currentDate.value.setMonth(currentDate.value.getMonth() - 1)
  } else {
    currentDate.value.setDate(currentDate.value.getDate() - 7)
  }
  currentDate.value = new Date(currentDate.value)
}

// 下一个周期
const nextPeriod = () => {
  if (currentView.value === 'month') {
    currentDate.value.setMonth(currentDate.value.getMonth() + 1)
  } else {
    currentDate.value.setDate(currentDate.value.getDate() + 7)
  }
  currentDate.value = new Date(currentDate.value)
}

// 显示的周期
const displayPeriod = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth() + 1
  
  if (currentView.value === 'month') {
    return `${year}年${month}月`
  } else {
    // 计算当前周的开始和结束日期
    const startOfWeek = new Date(currentDate.value)
    startOfWeek.setDate(currentDate.value.getDate() - currentDate.value.getDay())
    
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    
    const startMonth = startOfWeek.getMonth() + 1
    const startDate = startOfWeek.getDate()
    const endMonth = endOfWeek.getMonth() + 1
    const endDate = endOfWeek.getDate()
    
    if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
      return `${year}年${startMonth}月${startDate}日 - ${endDate}日`
    } else {
      return `${year}年${startMonth}月${startDate}日 - ${endMonth}月${endDate}日`
    }
  }
})

// 月份视图的日期
const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  // 当月的第一天
  const firstDay = new Date(year, month, 1)
  // 当月的最后一天
  const lastDay = new Date(year, month + 1, 0)
  // 上个月的最后一天
  const prevLastDay = new Date(year, month, 0)
  
  // 月历开始日期 (上个月的日期)
  const startDay = firstDay.getDay()
  // 月历结束日期 (下个月的日期)
  const endDay = lastDay.getDay()
  
  const days = []
  
  // 添加上个月的日期
  for (let i = startDay - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevLastDay.getDate() - i)
    // 修复日期格式化问题
    const dateStr = formatDateForCompare(date)
    days.push({
      date: dateStr,
      day: date.getDate(),
      isCurrentMonth: false,
      isToday: isToday(date),
      isSelected: selectedDate.value === dateStr
    })
  }
  
  // 添加当前月的日期
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i)
    // 修复日期格式化问题
    const dateStr = formatDateForCompare(date)
    days.push({
      date: dateStr,
      day: i,
      isCurrentMonth: true,
      isToday: isToday(date),
      isSelected: selectedDate.value === dateStr
    })
  }
  
  // 添加下个月的日期
  for (let i = 1; i <= 6 - endDay; i++) {
    const date = new Date(year, month + 1, i)
    // 修复日期格式化问题
    const dateStr = formatDateForCompare(date)
    days.push({
      date: dateStr,
      day: i,
      isCurrentMonth: false,
      isToday: isToday(date),
      isSelected: selectedDate.value === dateStr
    })
  }
  
  return days
})

// 周视图的日期
const weekDays = computed(() => {
  const startOfWeek = new Date(currentDate.value)
  startOfWeek.setDate(currentDate.value.getDate() - currentDate.value.getDay())
  
  const days = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    // 修复日期格式化问题
    const dateStr = formatDateForCompare(date)
    const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    
    days.push({
      date: dateStr,
      name: dayNames[i],
      isToday: isToday(date)
    })
  }
  
  return days
})

// 检查是否是今天
const isToday = (date: Date) => {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

// 选择日期
const selectDate = (day: any) => {
  selectedDate.value = day.date
}

// 检查某天是否有事件
const hasEvents = (date: string) => {
  return events.value.some(event => event.date === date)
}

// 获取某天的事件
const getEventsForDay = (date: string) => {
  return events.value.filter(event => event.date === date)
}

// 选中日期的事件
const selectedDateEvents = computed(() => {
  if (selectedDate.value) {
    return getEventsForDay(selectedDate.value)
  }
  return []
})

// 格式化时间
const formatTime = (hour: number, minute: number) => {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const dayName = dayNames[date.getDay()]
  
  return `${year}年${month}月${day}日 ${dayName}`
}

// 打开创建事件模态框
const openCreateEventModal = () => {
  editingEvent.value = null
  eventForm.value = {
    title: '',
    description: '',
    date: selectedDate.value || formatDateForCompare(new Date()),
    startHour: 9,
    startMinute: 0,
    endHour: 10,
    endMinute: 0,
    color: '#667eea'
  }
  showEventModal.value = true
}

// 打开事件模态框
const openEventModal = (event: CalendarEvent) => {
  editingEvent.value = event
  eventForm.value = { ...event }
  showEventModal.value = true
}

// 关闭事件模态框
const closeEventModal = () => {
  showEventModal.value = false
  editingEvent.value = null
}

// 保存事件
const saveEvent = () => {
  if (!eventForm.value.title || !eventForm.value.date) return
  
  if (editingEvent.value) {
    // 更新事件
    const index = events.value.findIndex(e => e.id === editingEvent.value!.id)
    if (index !== -1) {
      events.value[index] = { ...eventForm.value, id: editingEvent.value.id }
    }
  } else {
    // 创建新事件
    const newEvent: CalendarEvent = {
      ...eventForm.value,
      id: Date.now().toString()
    }
    events.value.push(newEvent)
  }
  
  closeEventModal()
}

// 删除事件
const deleteEvent = () => {
  if (editingEvent.value) {
    const index = events.value.findIndex(e => e.id === editingEvent.value!.id)
    if (index !== -1) {
      events.value.splice(index, 1)
    }
    closeEventModal()
  }
}

// 创建事件（周视图）
const createEvent = (date: string, hour: number) => {
  selectedDate.value = date
  eventForm.value = {
    title: '',
    description: '',
    date: date,
    startHour: hour,
    startMinute: 0,
    endHour: hour + 1,
    endMinute: 0,
    color: '#667eea'
  }
  editingEvent.value = null
  showEventModal.value = true
}

// 组件挂载时设置默认选中日期
onMounted(() => {
  selectedDate.value = formatDateForCompare(currentDate.value)
})

</script>

<style scoped>
.calendar-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
  padding: 1rem;
}

.page-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-button {
  background: rgba(102, 126, 234, 0.1);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #667eea;
}

.back-button:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: translateX(-2px);
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.today-button, .view-toggle {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
  color: #333;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.today-button:hover, .view-toggle:hover {
  background: #f5f5f5;
  transform: translateY(-2px);
}

.calendar-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.nav-button {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-button:hover {
  background: #f5f5f5;
  transform: scale(1.1);
}

.current-period {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.calendar-view {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* 月视图样式 */
.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: 600;
  color: #666;
  margin-bottom: 0.5rem;
}

.weekday {
  padding: 0.5rem 0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.calendar-day {
  min-height: 100px;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.calendar-day:hover {
  background: #e9ecef;
}

.calendar-day.current-month {
  background: white;
}

.calendar-day.today {
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid #667eea;
}

.calendar-day.selected {
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid #667eea;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.day-number {
  font-weight: 600;
  color: #333;
}

.event-indicator {
  width: 6px;
  height: 6px;
  background: #667eea;
  border-radius: 50%;
}

.day-events {
  font-size: 0.75rem;
}

.event-preview {
  padding: 0.1rem 0.25rem;
  border-left: 3px solid;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.1rem;
  background: rgba(255, 255, 255, 0.7);
}

.more-events {
  color: #667eea;
  font-weight: 500;
}

/* 周视图样式 */
.week-header {
  display: flex;
  margin-bottom: 0.5rem;
}

.time-column {
  width: 60px;
}

.week-day-header {
  flex: 1;
  text-align: center;
  padding: 0.5rem;
  border-radius: 8px;
}

.week-day-header.today {
  background: rgba(102, 126, 234, 0.1);
}

.day-name {
  font-weight: 600;
  color: #333;
}

.day-date {
  font-size: 0.9rem;
  color: #666;
}

.week-grid {
  display: flex;
}

.week-days {
  flex: 1;
  display: flex;
}

.week-day {
  flex: 1;
  position: relative;
  border-left: 1px solid #eee;
}

.hour-slot {
  height: 60px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.hour-slot:hover {
  background: rgba(102, 126, 234, 0.05);
}

.week-event {
  position: absolute;
  left: 2px;
  right: 2px;
  background: rgba(102, 126, 234, 0.1);
  border-left: 3px solid;
  padding: 0.25rem;
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;
}

.event-title {
  font-weight: 500;
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-time {
  font-size: 0.75rem;
  color: #666;
}

/* 事件面板 */
.events-panel {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.panel-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
}

.add-event-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.events-list {
  max-height: 300px;
  overflow-y: auto;
}

.event-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  border-left: 3px solid;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.event-item:hover {
  background: #e9ecef;
  transform: translateX(3px);
}

.event-time {
  font-weight: 600;
  color: #667eea;
  min-width: 50px;
}

.event-content {
  flex: 1;
}

.event-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.event-description {
  font-size: 0.85rem;
  color: #666;
}

.no-events {
  text-align: center;
  color: #999;
  padding: 2rem;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: modalSlideIn 0.4s ease-out;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
}

.modal-close:hover {
  background: #f5f5f5;
  color: #333;
}

.modal-header {
  padding: 1.5rem 2rem 1rem;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 700;
}

.modal-body {
  padding: 1.5rem 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
  margin-bottom: 0;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.form-input:focus, .form-textarea:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.time-inputs {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.time-input {
  width: 60px;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
  outline: none;
  text-align: center;
}

.time-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.modal-footer {
  padding: 1rem 2rem 2rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-primary, .btn-danger {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-danger {
  background: #ff6b6b;
  color: white;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.btn-danger:hover {
  background: #ff5252;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .calendar-page {
    padding: 0.5rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .calendar-grid {
    gap: 1px;
  }
  
  .calendar-day {
    min-height: 80px;
    padding: 0.25rem;
  }
  
  .day-events {
    display: none;
  }
  
  .week-header, .week-grid {
    display: block;
  }
  
  .time-column {
    display: none;
  }
  
  .week-days {
    display: block;
  }
  
  .week-day {
    border-left: none;
    border-bottom: 1px solid #eee;
    margin-bottom: 1rem;
    min-height: 400px;
  }
  
  .week-view .hour-slot {
    height: 30px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .modal-content {
    margin: 1rem;
  }
}
</style>
