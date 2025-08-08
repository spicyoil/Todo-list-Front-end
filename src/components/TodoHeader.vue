<script setup>
import { ref } from 'vue'
import { SunIcon, MoonIcon, PlusIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  isDarkMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-theme', 'add-todo'])

const newTodoText = ref('')

const addTodo = () => {
  if (newTodoText.value.trim()) {
    emit('add-todo', newTodoText.value)
    newTodoText.value = ''
  }
}

const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    addTodo()
  }
}
</script>

<template>
  <div class="mb-8">
    <!-- 标题和主题切换 -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-3">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
        </div>
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
            Todo List
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            管理你的任务，提升效率
          </p>
        </div>
      </div>
      
      <!-- 主题切换按钮 -->
      <button
        @click="$emit('toggle-theme')"
        class="p-3 rounded-xl bg-white/80 backdrop-blur-lg border border-white/20 shadow-lg hover:shadow-xl transition-all duration-200 dark:bg-gray-800/80 dark:border-gray-700/50 group"
        :title="isDarkMode ? '切换到亮色模式' : '切换到暗色模式'"
      >
        <SunIcon v-if="isDarkMode" class="w-5 h-5 text-yellow-500 group-hover:rotate-12 transition-transform duration-200" />
        <MoonIcon v-else class="w-5 h-5 text-gray-600 group-hover:rotate-12 transition-transform duration-200" />
      </button>
    </div>
    
    <!-- 添加任务输入框 -->
    <div class="card glass">
      <div class="flex items-center space-x-3">
        <div class="flex-1 relative">
          <input
            v-model="newTodoText"
            @keypress="handleKeyPress"
            type="text"
            placeholder="添加新的待办事项..."
            class="input pr-12"
            autofocus
          />
          <button
            @click="addTodo"
            class="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!newTodoText.trim()"
          >
            <PlusIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
