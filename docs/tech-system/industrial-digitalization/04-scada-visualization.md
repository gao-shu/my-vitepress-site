# 04-工业可视化（SCADA）

> **前置知识**: [03-实时系统设计](./03-realtime-system.md)

## 🎯 学习目标

掌握 SCADA（数据采集与监控系统）的核心实现：
- ✅ SVG/Canvas 组态画面绘制
- ✅ 设备状态实时绑定
- ✅ 历史趋势曲线查询
- ✅ 报警管理与事件追溯
- ✅ 大屏可视化设计

---

## 📊 SCADA 系统架构

```
┌─────────────────────────────────────────────┐
│           前端展示层 (Vue3 + ECharts)        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ 组态画面  │  │ 趋势曲线  │  │ 报警中心  │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────┘
                    ↕ WebSocket
┌─────────────────────────────────────────────┐
│          后端服务层 (Spring Boot)            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │WebSocket │  │ 告警引擎  │  │ 数据聚合  │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────┐
│         数据存储层 (TDengine + MySQL)        │
│  ┌──────────┐  ┌──────────┐                 │
│  │ 时序数据  │  │ 业务数据  │                 │
│  └──────────┘  └──────────┘                 │
└─────────────────────────────────────────────┘
```

---

## 🎨 组态画面设计

### 方案对比

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|---------|
| **SVG** | 矢量图、易绑定数据、DOM 事件 | 复杂图形性能差 | 流程图、管道图 |
| **Canvas** | 高性能、适合大量元素 | 无 DOM、需手动管理 | 仪表盘、粒子效果 |
| **AntV X6** | 专业图库、拖拽编辑 | 学习成本高 | 可编辑组态编辑器 |
| **Three.js** | 3D 效果 | 复杂度高 | 数字孪生、3D 厂房 |

**推荐**: **SVG**（简单场景）+ **AntV X6**（复杂可编辑场景）

---

## 🔧 SVG 组态画面实现

### 1. SVG 工艺流程图

```vue
<!-- ProcessFlowDiagram.vue -->
<template>
  <div class="scada-container">
    <svg :viewBox="`0 0 ${width} ${height}`" class="process-svg">
      <!-- 定义渐变和滤镜 -->
      <defs>
        <linearGradient id="pipe-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#409EFF;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#67C23A;stop-opacity:1" />
        </linearGradient>
        
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- 管道 -->
      <g class="pipes">
        <path
          v-for="pipe in pipes"
          :key="pipe.id"
          :d="pipe.path"
          :stroke="getPipeColor(pipe)"
          stroke-width="8"
          fill="none"
          stroke-linecap="round"
        >
          <!-- 流动动画 -->
          <animate
            attributeName="stroke-dashoffset"
            from="100"
            to="0"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
      </g>
      
      <!-- 设备 -->
      <g class="devices">
        <g
          v-for="device in devices"
          :key="device.id"
          :transform="`translate(${device.x}, ${device.y})`"
          @click="handleDeviceClick(device)"
          class="device-group"
        >
          <!-- 设备外框 -->
          <rect
            :width="device.width"
            :height="device.height"
            :fill="getDeviceColor(device)"
            :stroke="getDeviceStrokeColor(device)"
            stroke-width="2"
            rx="5"
          />
          
          <!-- 设备图标 -->
          <text
            :x="device.width / 2"
            :y="device.height / 2"
            text-anchor="middle"
            dominant-baseline="middle"
            font-size="24"
          >
            {{ device.icon }}
          </text>
          
          <!-- 设备名称 -->
          <text
            :x="device.width / 2"
            :y="device.height + 20"
            text-anchor="middle"
            font-size="12"
            fill="#333"
          >
            {{ device.name }}
          </text>
          
          <!-- 实时数据标签 -->
          <foreignObject
            :x="device.width + 5"
            :y="0"
            :width="120"
            :height="60"
          >
            <div xmlns="http://www.w3.org/1999/xhtml" class="data-tag">
              <div v-if="deviceData[device.id]">
                <div>温度: {{ deviceData[device.id].temperature }}°C</div>
                <div>压力: {{ deviceData[device.id].pressure }}MPa</div>
              </div>
            </div>
          </foreignObject>
        </g>
      </g>
      
      <!-- 阀门 -->
      <g class="valves">
        <circle
          v-for="valve in valves"
          :key="valve.id"
          :cx="valve.x"
          :cy="valve.y"
          r="15"
          :fill="valve.open ? '#67C23A' : '#F56C6C'"
          @click="toggleValve(valve)"
          class="valve-circle"
        />
      </g>
    </svg>
    
    <!-- 设备详情弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="selectedDevice?.name"
      width="600px"
    >
      <DeviceDetailPanel
        v-if="selectedDevice"
        :device-id="selectedDevice.id"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useDeviceWebSocket } from '@/composables/useDeviceWebSocket';

const props = defineProps({
  width: { type: Number, default: 1200 },
  height: { type: Number, default: 800 }
});

// 设备数据
const devices = ref([
  {
    id: 'pump_001',
    name: '进料泵',
    icon: '⚙️',
    x: 100,
    y: 200,
    width: 80,
    height: 80,
    status: 'running'
  },
  {
    id: 'tank_001',
    name: '储罐',
    icon: '🛢️',
    x: 300,
    y: 150,
    width: 100,
    height: 120,
    status: 'normal'
  },
  {
    id: 'heater_001',
    name: '加热器',
    icon: '🔥',
    x: 550,
    y: 200,
    width: 80,
    height: 80,
    status: 'heating'
  }
]);

// 管道
const pipes = ref([
  {
    id: 'pipe_001',
    path: 'M 180 240 L 300 240', // 泵到储罐
    flowRate: 50
  },
  {
    id: 'pipe_002',
    path: 'M 400 240 L 550 240', // 储罐到加热器
    flowRate: 45
  }
]);

// 阀门
const valves = ref([
  { id: 'valve_001', x: 240, y: 240, open: true },
  { id: 'valve_002', x: 475, y: 240, open: true }
]);

// 实时数据
const deviceData = ref({});

// WebSocket 订阅所有设备
devices.value.forEach(device => {
  const { deviceData: data } = useDeviceWebSocket(device.id);
  watch(data, (newData) => {
    if (newData) {
      deviceData.value[device.id] = newData;
    }
  }, { immediate: true });
});

// 设备颜色
const getDeviceColor = (device) => {
  const colors = {
    running: '#E1F3D8',
    stopped: '#FEF0F0',
    alarm: '#FDE2E2',
    normal: '#E1F3D8'
  };
  return colors[device.status] || '#F5F7FA';
};

const getDeviceStrokeColor = (device) => {
  const colors = {
    running: '#67C23A',
    stopped: '#F56C6C',
    alarm: '#F56C6C',
    normal: '#67C23A'
  };
  return colors[device.status] || '#DCDFE6';
};

const getPipeColor = (pipe) => {
  // 根据流速改变颜色
  if (pipe.flowRate > 80) return '#F56C6C';
  if (pipe.flowRate > 50) return '#E6A23C';
  return '#409EFF';
};

const dialogVisible = ref(false);
const selectedDevice = ref(null);

const handleDeviceClick = (device) => {
  selectedDevice.value = device;
  dialogVisible.value = true;
};

const toggleValve = async (valve) => {
  try {
    // 调用 API 控制阀门
    await fetch(`/api/device/valve/${valve.id}/toggle`, {
      method: 'POST'
    });
    
    valve.open = !valve.open;
    
    ElMessage.success(`阀门 ${valve.open ? '开启' : '关闭'}成功`);
  } catch (error) {
    ElMessage.error('操作失败');
  }
};
</script>

<style scoped>
.scada-container {
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  border-radius: 8px;
  overflow: hidden;
}

.process-svg {
  width: 100%;
  height: 100%;
}

.device-group {
  cursor: pointer;
  transition: all 0.3s;
}

.device-group:hover {
  filter: drop-shadow(0 0 8px rgba(64, 158, 255, 0.5));
}

.valve-circle {
  cursor: pointer;
  transition: all 0.3s;
}

.valve-circle:hover {
  r: 18;
}

.data-tag {
  background: rgba(255, 255, 255, 0.9);
  padding: 5px;
  border-radius: 4px;
  font-size: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
```

---

## 📈 历史趋势曲线

### ECharts 趋势图组件

```vue
<!-- TrendChart.vue -->
<template>
  <div ref="chartRef" class="trend-chart"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  deviceId: { type: String, required: true },
  pointName: { type: String, default: 'temperature' },
  timeRange: { type: String, default: '1h' }, // 1h, 6h, 24h, 7d
  refreshInterval: { type: Number, default: 5000 }
});

const chartRef = ref(null);
let chartInstance = null;
let refreshTimer = null;

const loadChartData = async () => {
  try {
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - getTimeRangeMillis());
    
    const response = await fetch(
      `/api/device/${props.deviceId}/history?` +
      `point=${props.pointName}&` +
      `start=${startTime.toISOString()}&` +
      `end=${endTime.toISOString()}`
    );
    
    const data = await response.json();
    
    updateChart(data);
  } catch (error) {
    console.error('加载历史数据失败', error);
  }
};

const updateChart = (data) => {
  if (!chartInstance) return;
  
  const option = {
    title: {
      text: `${props.pointName} 历史趋势`,
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const param = params[0];
        return `${param.seriesName}<br/>${param.value[0]}<br/>${param.value[1]}`;
      }
    },
    legend: {
      data: [props.pointName],
      top: 30
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'time',
      boundaryGap: false
    },
    yAxis: {
      type: 'value',
      name: getUnit(props.pointName)
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100
      },
      {
        start: 0,
        end: 100
      }
    ],
    series: [{
      name: props.pointName,
      type: 'line',
      smooth: true,
      showSymbol: false,
      data: data.map(item => [item.timestamp, item.value]),
      areaStyle: {
        opacity: 0.3
      },
      markLine: {
        data: [
          { yAxis: 80, name: '上限', lineStyle: { color: '#F56C6C' } },
          { yAxis: 20, name: '下限', lineStyle: { color: '#409EFF' } }
        ]
      }
    }]
  };
  
  chartInstance.setOption(option);
};

const getTimeRangeMillis = () => {
  const ranges = {
    '1h': 3600000,
    '6h': 21600000,
    '24h': 86400000,
    '7d': 604800000
  };
  return ranges[props.timeRange] || 3600000;
};

const getUnit = (pointName) => {
  const units = {
    temperature: '°C',
    pressure: 'MPa',
    current: 'A',
    voltage: 'V'
  };
  return units[pointName] || '';
};

onMounted(() => {
  chartInstance = echarts.init(chartRef.value);
  loadChartData();
  
  // 定时刷新
  refreshTimer = setInterval(loadChartData, props.refreshInterval);
});

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }
  if (chartInstance) {
    chartInstance.dispose();
  }
});

// 监听时间范围变化
watch(() => props.timeRange, () => {
  loadChartData();
});
</script>

<style scoped>
.trend-chart {
  width: 100%;
  height: 400px;
}
</style>
```

---

## 🚨 报警管理中心

### 报警列表组件

```vue
<!-- AlarmCenter.vue -->
<template>
  <div class="alarm-center">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>报警中心</span>
          <el-badge :value="unreadCount" :hidden="unreadCount === 0">
            <el-button size="small" @click="markAllAsRead">全部已读</el-button>
          </el-badge>
        </div>
      </template>
      
      <!-- 筛选条件 -->
      <el-form :inline="true" class="filter-form">
        <el-form-item label="级别">
          <el-select v-model="filterLevel" placeholder="全部" clearable>
            <el-option label="提示" value="INFO" />
            <el-option label="警告" value="WARNING" />
            <el-option label="错误" value="ERROR" />
            <el-option label="严重" value="CRITICAL" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="状态">
          <el-select v-model="filterStatus" placeholder="全部" clearable>
            <el-option label="未确认" value="UNACKNOWLEDGED" />
            <el-option label="已确认" value="ACKNOWLEDGED" />
            <el-option label="已处理" value="RESOLVED" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="时间">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="loadAlarms">查询</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
      
      <!-- 报警表格 -->
      <el-table
        :data="alarmList"
        stripe
        style="width: 100%"
        @row-click="handleRowClick"
      >
        <el-table-column type="index" width="50" />
        
        <el-table-column label="级别" width="80">
          <template #default="{ row }">
            <el-tag :type="getAlarmTagType(row.level)">
              {{ getAlarmLevelText(row.level) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="deviceName" label="设备" width="120" />
        
        <el-table-column prop="pointName" label="测点" width="100" />
        
        <el-table-column label="当前值" width="100">
          <template #default="{ row }">
            {{ row.currentValue }} {{ getUnit(row.pointName) }}
          </template>
        </el-table-column>
        
        <el-table-column label="阈值" width="100">
          <template #default="{ row }">
            {{ row.threshold }}
          </template>
        </el-table-column>
        
        <el-table-column prop="message" label="报警信息" min-width="200" />
        
        <el-table-column label="时间" width="160">
          <template #default="{ row }">
            {{ formatTime(row.timestamp) }}
          </template>
        </el-table-column>
        
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 'UNACKNOWLEDGED'"
              size="small"
              type="primary"
              @click.stop="acknowledgeAlarm(row)"
            >
              确认
            </el-button>
            
            <el-button
              v-if="row.status !== 'RESOLVED'"
              size="small"
              type="success"
              @click.stop="resolveAlarm(row)"
            >
              处理
            </el-button>
            
            <el-button
              size="small"
              @click.stop="viewDetail(row)"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="loadAlarms"
        @current-change="loadAlarms"
      />
    </el-card>
    
    <!-- 报警详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="报警详情"
      width="800px"
    >
      <AlarmDetailPanel
        v-if="selectedAlarm"
        :alarm="selectedAlarm"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useDeviceWebSocket } from '@/composables/useDeviceWebSocket';

const filterLevel = ref('');
const filterStatus = ref('');
const dateRange = ref([]);
const alarmList = ref([]);
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);
const detailDialogVisible = ref(false);
const selectedAlarm = ref(null);

// 使用 WebSocket 接收实时报警
const { alarms: realtimeAlarms } = useDeviceWebSocket('broadcast');

// 监听实时报警
watch(realtimeAlarms, (newAlarms) => {
  if (newAlarms && newAlarms.length > 0) {
    // 将新报警插入列表顶部
    alarmList.value.unshift(...newAlarms.slice(0, 5));
    
    // 播放提示音
    playAlarmSound();
    
    // 桌面通知
    showDesktopNotification(newAlarms[0]);
  }
}, { deep: true });

const unreadCount = computed(() => {
  return alarmList.value.filter(a => a.status === 'UNACKNOWLEDGED').length;
});

const loadAlarms = async () => {
  try {
    const params = new URLSearchParams({
      page: currentPage.value,
      pageSize: pageSize.value
    });
    
    if (filterLevel.value) {
      params.append('level', filterLevel.value);
    }
    if (filterStatus.value) {
      params.append('status', filterStatus.value);
    }
    if (dateRange.value && dateRange.value.length === 2) {
      params.append('startTime', dateRange.value[0].toISOString());
      params.append('endTime', dateRange.value[1].toISOString());
    }
    
    const response = await fetch(`/api/alarm/list?${params}`);
    const data = await response.json();
    
    alarmList.value = data.list;
    total.value = data.total;
  } catch (error) {
    ElMessage.error('加载报警列表失败');
  }
};

const acknowledgeAlarm = async (alarm) => {
  try {
    await fetch(`/api/alarm/${alarm.id}/acknowledge`, {
      method: 'POST'
    });
    
    alarm.status = 'ACKNOWLEDGED';
    ElMessage.success('确认成功');
  } catch (error) {
    ElMessage.error('确认失败');
  }
};

const resolveAlarm = async (alarm) => {
  try {
    await fetch(`/api/alarm/${alarm.id}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        remark: '已处理'
      })
    });
    
    alarm.status = 'RESOLVED';
    ElMessage.success('处理成功');
  } catch (error) {
    ElMessage.error('处理失败');
  }
};

const markAllAsRead = async () => {
  try {
    await fetch('/api/alarm/mark-all-read', {
      method: 'POST'
    });
    
    alarmList.value.forEach(alarm => {
      if (alarm.status === 'UNACKNOWLEDGED') {
        alarm.status = 'ACKNOWLEDGED';
      }
    });
    
    ElMessage.success('全部已读');
  } catch (error) {
    ElMessage.error('操作失败');
  }
};

const getAlarmTagType = (level) => {
  const types = {
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'danger',
    CRITICAL: 'danger'
  };
  return types[level] || 'info';
};

const getAlarmLevelText = (level) => {
  const texts = {
    INFO: '提示',
    WARNING: '警告',
    ERROR: '错误',
    CRITICAL: '严重'
  };
  return texts[level] || level;
};

const getStatusTagType = (status) => {
  const types = {
    UNACKNOWLEDGED: 'danger',
    ACKNOWLEDGED: 'warning',
    RESOLVED: 'success'
  };
  return types[status] || 'info';
};

const getStatusText = (status) => {
  const texts = {
    UNACKNOWLEDGED: '未确认',
    ACKNOWLEDGED: '已确认',
    RESOLVED: '已处理'
  };
  return texts[status] || status;
};

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleString('zh-CN');
};

const getUnit = (pointName) => {
  const units = {
    temperature: '°C',
    pressure: 'MPa',
    current: 'A'
  };
  return units[pointName] || '';
};

const playAlarmSound = () => {
  const audio = new Audio('/sounds/alarm.mp3');
  audio.play().catch(() => {});
};

const showDesktopNotification = (alarm) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('设备报警', {
      body: alarm.message,
      icon: '/icons/alarm.png'
    });
  }
};

onMounted(() => {
  loadAlarms();
  
  // 请求桌面通知权限
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
});
</script>

<style scoped>
.alarm-center {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-form {
  margin-bottom: 20px;
}
</style>
```

---

## 🖥️ 监控大屏设计

### 大屏布局组件

```vue
<!-- MonitoringDashboard.vue -->
<template>
  <div class="dashboard">
    <!-- 顶部标题栏 -->
    <header class="dashboard-header">
      <h1>智能制造监控大屏</h1>
      <div class="header-info">
        <span>{{ currentTime }}</span>
        <el-button size="small" @click="toggleFullscreen">
          {{ isFullscreen ? '退出全屏' : '全屏' }}
        </el-button>
      </div>
    </header>
    
    <!-- 主要内容区 -->
    <main class="dashboard-content">
      <el-row :gutter="20">
        <!-- 左侧：关键指标 -->
        <el-col :span="6">
          <el-card class="kpi-card">
            <template #header>
              <span>关键指标</span>
            </template>
            
            <div class="kpi-list">
              <div class="kpi-item">
                <div class="kpi-label">在线设备</div>
                <div class="kpi-value success">{{ kpi.onlineDevices }}</div>
              </div>
              
              <div class="kpi-item">
                <div class="kpi-label">今日产量</div>
                <div class="kpi-value">{{ kpi.todayProduction }}</div>
              </div>
              
              <div class="kpi-item">
                <div class="kpi-label">合格率</div>
                <div class="kpi-value">{{ kpi.qualityRate }}%</div>
              </div>
              
              <div class="kpi-item">
                <div class="kpi-label">OEE</div>
                <div class="kpi-value warning">{{ kpi.oee }}%</div>
              </div>
              
              <div class="kpi-item">
                <div class="kpi-label">活跃报警</div>
                <div class="kpi-value danger">{{ kpi.activeAlarms }}</div>
              </div>
            </div>
          </el-card>
          
          <!-- 设备状态分布 -->
          <el-card class="mt-4">
            <template #header>
              <span>设备状态分布</span>
            </template>
            <DeviceStatusPieChart />
          </el-card>
        </el-col>
        
        <!-- 中间：组态画面 -->
        <el-col :span="12">
          <el-card class="scada-card">
            <ProcessFlowDiagram
              :width="800"
              :height="600"
            />
          </el-card>
        </el-col>
        
        <!-- 右侧：实时趋势与报警 -->
        <el-col :span="6">
          <!-- 实时趋势 -->
          <el-card class="mb-4">
            <template #header>
              <span>关键参数趋势</span>
            </template>
            <TrendChart
              device-id="critical_device_001"
              point-name="temperature"
              time-range="1h"
              :refresh-interval="3000"
            />
          </el-card>
          
          <!-- 最新报警 -->
          <el-card>
            <template #header>
              <span>最新报警</span>
            </template>
            <el-timeline>
              <el-timeline-item
                v-for="alarm in recentAlarms"
                :key="alarm.id"
                :type="getAlarmTimelineType(alarm.level)"
                :timestamp="formatShortTime(alarm.timestamp)"
              >
                {{ alarm.message }}
              </el-timeline-item>
            </el-timeline>
          </el-card>
        </el-col>
      </el-row>
      
      <!-- 底部：产线统计 -->
      <el-row :gutter="20" class="mt-4">
        <el-col :span="8" v-for="line in productionLines" :key="line.id">
          <el-card>
            <template #header>
              <span>{{ line.name }}</span>
            </template>
            
            <div class="line-stats">
              <div class="stat-item">
                <span class="stat-label">计划产量:</span>
                <span class="stat-value">{{ line.plannedOutput }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">实际产量:</span>
                <span class="stat-value">{{ line.actualOutput }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">完成率:</span>
                <el-progress
                  :percentage="line.completionRate"
                  :color="getProgressColor(line.completionRate)"
                />
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const currentTime = ref('');
const isFullscreen = ref(false);

const kpi = ref({
  onlineDevices: 45,
  todayProduction: 12580,
  qualityRate: 98.5,
  oee: 85.2,
  activeAlarms: 3
});

const recentAlarms = ref([]);
const productionLines = ref([
  {
    id: 'line_01',
    name: '产线 A',
    plannedOutput: 5000,
    actualOutput: 4250,
    completionRate: 85
  },
  {
    id: 'line_02',
    name: '产线 B',
    plannedOutput: 4500,
    actualOutput: 4100,
    completionRate: 91
  },
  {
    id: 'line_03',
    name: '产线 C',
    plannedOutput: 4800,
    actualOutput: 4230,
    completionRate: 88
  }
]);

let timeTimer = null;

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    isFullscreen.value = true;
  } else {
    document.exitFullscreen();
    isFullscreen.value = false;
  }
};

const getProgressColor = (percentage) => {
  if (percentage < 60) return '#F56C6C';
  if (percentage < 80) return '#E6A23C';
  return '#67C23A';
};

const getAlarmTimelineType = (level) => {
  const types = {
    INFO: 'primary',
    WARNING: 'warning',
    ERROR: 'danger',
    CRITICAL: 'danger'
  };
  return types[level] || 'info';
};

const formatShortTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('zh-CN');
};

onMounted(() => {
  updateTime();
  timeTimer = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timeTimer) {
    clearInterval(timeTimer);
  }
});
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #0f1419;
  color: #fff;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background: linear-gradient(90deg, #1a2332 0%, #0f1419 100%);
  border-bottom: 2px solid #409EFF;
}

.dashboard-header h1 {
  margin: 0;
  font-size: 28px;
  color: #409EFF;
  text-shadow: 0 0 10px rgba(64, 158, 255, 0.5);
}

.header-info {
  display: flex;
  gap: 20px;
  align-items: center;
  font-size: 16px;
}

.dashboard-content {
  padding: 20px 40px;
}

.kpi-card, .scada-card {
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid #2c3e50;
}

.kpi-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.kpi-item {
  text-align: center;
  padding: 15px;
  background: rgba(64, 158, 255, 0.1);
  border-radius: 8px;
}

.kpi-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.kpi-value {
  font-size: 32px;
  font-weight: bold;
}

.kpi-value.success {
  color: #67C23A;
}

.kpi-value.warning {
  color: #E6A23C;
}

.kpi-value.danger {
  color: #F56C6C;
}

.line-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  color: #909399;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
}

:deep(.el-card__header) {
  border-bottom: 1px solid #2c3e50;
  color: #409EFF;
}

:deep(.el-card__body) {
  background: transparent;
}
</style>
```

---

## 💡 最佳实践

### 1. SVG 性能优化

```javascript
// 使用 requestAnimationFrame 优化动画
const animateFlow = () => {
  pipes.value.forEach(pipe => {
    // 更新管道流动偏移
    pipe.offset = (pipe.offset + 1) % 100;
  });
  
  requestAnimationFrame(animateFlow);
};

// 启动动画
animateFlow();
```

### 2. 图表懒加载

```javascript
// 仅在可见时才初始化图表
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !chartInstance) {
      initChart();
    }
  });
});

observer.observe(chartRef.value);
```

### 3. 数据缓存策略

```javascript
// 缓存历史数据，避免重复请求
const dataCache = new Map();

const getCachedData = async (key, fetchFn, ttl = 60000) => {
  const cached = dataCache.get(key);
  
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }
  
  const data = await fetchFn();
  dataCache.set(key, { data, timestamp: Date.now() });
  
  return data;
};
```

---

## 🔗 相关资源

- [SVG 官方文档](https://developer.mozilla.org/zh-CN/docs/Web/SVG)
- [ECharts 官方示例](https://echarts.apache.org/examples/zh/index.html)
- [AntV X6 流程图编辑器](https://x6.antv.vision/)

---

**下一步**: 学习 [05-业务抽象设计](./05-business-abstract.md) 🔥，理解设备模型、工单流程、OEE 计算等核心业务逻辑。
