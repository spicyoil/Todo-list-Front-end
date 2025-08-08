<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import TodoList from './components/TodoList.vue'
import TodoHeader from './components/TodoHeader.vue'
import TodoStats from './components/TodoStats.vue'
import TodoFilters from './components/TodoFilters.vue'
import { todoAPI, todoTransformers } from './services/api.js'

// 响应式数据
const todos = ref([])
const filter = ref('all') // 'all', 'active', 'completed'
const isDarkMode = ref(false)
const loading = ref(false)
const error = ref(null)

// 从 localStorage 加载主题设置
onMounted(async () => {
  const savedTheme = localStorage.getItem('theme')
  
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark'
  } else {
    // 检测系统主题偏好
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  
  applyTheme()
  
  // 从后端加载数据
  await loadTodos()
})

// 监听主题变化
watch(isDarkMode, (newValue) => {
  localStorage.setItem('theme', newValue ? 'dark' : 'light')
  applyTheme()
})

// 应用主题
const applyTheme = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// 从后端加载待办事项
const loadTodos = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await todoAPI.getAllTodos()
    if (response.success) {
      todos.value = response.data.map(todoTransformers.fromAPI)
    } else {
      error.value = response.message
    }
  } catch (err) {
    error.value = '加载待办事项失败: ' + err.message
    console.error('Failed to load todos:', err)
  } finally {
    loading.value = false
  }
}

// 计算属性
const filteredTodos = computed(() => {
  switch (filter.value) {
    case 'active':
      return todos.value.filter(todo => !todo.completed)
    case 'completed':
      return todos.value.filter(todo => todo.completed)
    default:
      return todos.value
  }
})

const stats = computed(() => {
  const total = todos.value.length
  const completed = todos.value.filter(todo => todo.completed).length
  const active = total - completed
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
  
  return { total, completed, active, percentage }
})

// 方法
const addTodo = async (text) => {
  if (!text.trim()) return
  
  loading.value = true
  error.value = null
  
  try {
    const response = await todoAPI.addTodo(text.trim())
    if (response.success) {
      const newTodo = todoTransformers.fromAPI(response.data)
      todos.value.unshift(newTodo)
    } else {
      error.value = response.message
    }
  } catch (err) {
    error.value = '添加待办事项失败: ' + err.message
    console.error('Failed to add todo:', err)
  } finally {
    loading.value = false
  }
}

const toggleTodo = async (id) => {
  loading.value = true
  error.value = null
  
  try {
    const response = await todoAPI.updateTodoStatus(id)
    if (response.success) {
      const updatedTodo = todoTransformers.fromAPI(response.data)
      const index = todos.value.findIndex(t => t.id === id)
      if (index > -1) {
        todos.value[index] = updatedTodo
      }
    } else {
      error.value = response.message
    }
  } catch (err) {
    error.value = '更新待办事项失败: ' + err.message
    console.error('Failed to update todo:', err)
  } finally {
    loading.value = false
  }
}

const deleteTodo = async (id) => {
  loading.value = true
  error.value = null
  
  try {
    const response = await todoAPI.deleteTodo(id)
    if (response.success) {
      const index = todos.value.findIndex(t => t.id === id)
      if (index > -1) {
        todos.value.splice(index, 1)
      }
    } else {
      error.value = response.message
    }
  } catch (err) {
    error.value = '删除待办事项失败: ' + err.message
    console.error('Failed to delete todo:', err)
  } finally {
    loading.value = false
  }
}

const clearCompleted = async () => {
  const completedTodos = todos.value.filter(todo => todo.completed)
  
  loading.value = true
  error.value = null
  
  try {
    // 逐个删除已完成的待办事项
    for (const todo of completedTodos) {
      await todoAPI.deleteTodo(todo.id)
    }
    
    // 从本地数组中移除已完成的待办事项
    todos.value = todos.value.filter(todo => !todo.completed)
  } catch (err) {
    error.value = '清除已完成待办事项失败: ' + err.message
    console.error('Failed to clear completed todos:', err)
  } finally {
    loading.value = false
  }
}

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  applyTheme()
}
</script>

<template>
  <div id="app" :class="['min-h-screen transition-all duration-300', { 'dark': isDarkMode }]">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- 错误提示 -->
      <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
          <span class="text-red-800 dark:text-red-200">{{ error }}</span>
          <button @click="error = null" class="ml-auto text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="loading" class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
        <div class="flex items-center">
          <svg class="animate-spin w-5 h-5 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-blue-800 dark:text-blue-200">正在处理...</span>
        </div>
      </div>
      
      <!-- 头部 -->
      <TodoHeader 
        :is-dark-mode="isDarkMode"
        @toggle-theme="toggleTheme"
        @add-todo="addTodo"
      />
      
      <!-- 统计信息 -->
      <TodoStats :stats="stats" />
      
      <!-- 过滤器 -->
      <TodoFilters 
        :filter="filter"
        :stats="stats"
        @filter-change="filter = $event"
        @clear-completed="clearCompleted"
      />
      
      <!-- Todo 列表 -->
      <TodoList
        :todos="filteredTodos"
        @toggle-todo="toggleTodo"
        @delete-todo="deleteTodo"
      />
      
      <!-- 空状态 -->
      <div v-if="filteredTodos.length === 0 && !loading" class="text-center py-16">
        <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          {{ filter === 'all' ? '还没有待办事项' : filter === 'active' ? '没有进行中的任务' : '没有已完成的任务' }}
        </h3>
        <p class="text-gray-500 dark:text-gray-400">
          {{ filter === 'all' ? '开始添加你的第一个任务吧！' : '继续努力完成更多任务' }}
        </p>
      </div>
    </div>
  </div>
</template>

<style>
#app {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

#app.dark {
  background: linear-gradient(135deg, #0a0f1a 0%, #1a1f2e 100%);
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.8);
}

.dark ::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.5);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 85, 99, 0.8);
}
</style>
