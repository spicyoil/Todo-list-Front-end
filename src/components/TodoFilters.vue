<script setup>
import { computed } from 'vue'
import { FunnelIcon, TrashIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  filter: {
    type: String,
    default: 'all'
  },
  stats: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['filter-change', 'clear-completed'])

const filters = computed(() => [
  { key: 'all', label: '全部', count: props.stats.total },
  { key: 'active', label: '进行中', count: props.stats.active },
  { key: 'completed', label: '已完成', count: props.stats.completed }
])
</script>

<template>
  <div class="mb-6">
    <div class="card glass">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <!-- 过滤器按钮 -->
        <div class="flex items-center space-x-2">
          <FunnelIcon class="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            筛选：
          </span>
          <div class="flex space-x-1">
            <button
              v-for="filterOption in filters"
              :key="filterOption.key"
              @click="$emit('filter-change', filterOption.key)"
              class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 relative group"
              :class="filter === filterOption.key 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'"
            >
              {{ filterOption.label }}
              <span 
                class="ml-1.5 px-1.5 py-0.5 rounded-full text-xs"
                :class="filter === filterOption.key 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'"
              >
                {{ filterOption.count }}
              </span>
              
              <!-- 激活状态指示器 -->
              <div 
                v-if="filter === filterOption.key"
                class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"
              ></div>
            </button>
          </div>
        </div>
        
        <!-- 清除已完成按钮 -->
        <button
          v-if="stats.completed > 0"
          @click="$emit('clear-completed')"
          class="inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 group"
        >
          <TrashIcon class="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
          <span>清除已完成</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
