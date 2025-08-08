<script setup>
import { CheckIcon, TrashIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['toggle-todo', 'delete-todo'])

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return '今天'
  if (diffDays === 2) return '昨天'
  if (diffDays <= 7) return `${diffDays - 1}天前`
  
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <div 
    class="card glass group hover:shadow-xl transition-all duration-300"
    :class="{ 'opacity-75': todo.completed }"
  >
    <div class="flex items-center space-x-4">
      <!-- 完成状态按钮 -->
      <button
        @click="$emit('toggle-todo', todo.id)"
        class="flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2"
        :class="todo.completed 
          ? 'bg-green-500 border-green-500 focus:ring-green-500' 
          : 'border-gray-300 hover:border-green-400 focus:ring-green-400 dark:border-gray-600 dark:hover:border-green-400'"
      >
        <CheckIcon 
          v-if="todo.completed"
          class="w-4 h-4 text-white" 
        />
      </button>
      
      <!-- 任务内容 -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <p 
              class="text-gray-900 dark:text-gray-100 transition-all duration-200"
              :class="{ 'line-through text-gray-500 dark:text-gray-400': todo.completed }"
            >
              {{ todo.text }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ formatDate(todo.createdAt) }}
            </p>
          </div>
          
          <!-- 操作按钮 -->
          <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              @click="$emit('delete-todo', todo.id)"
              class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
              title="删除任务"
            >
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 完成动画效果 -->
    <div 
      v-if="todo.completed"
      class="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl pointer-events-none"
    ></div>
  </div>
</template>

<style scoped>
.card {
  position: relative;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 完成状态的动画 */
.card:has(.bg-green-500) {
  animation: completePulse 0.6s ease-out;
}

@keyframes completePulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}
</style>
