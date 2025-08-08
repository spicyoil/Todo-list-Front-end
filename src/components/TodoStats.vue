<script setup>
import { computed } from 'vue'
import { CheckCircleIcon, ClockIcon, ListBulletIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  stats: {
    type: Object,
    required: true
  }
})

const progressColor = computed(() => {
  const percentage = props.stats.percentage
  if (percentage >= 80) return 'from-green-500 to-emerald-600'
  if (percentage >= 60) return 'from-blue-500 to-cyan-600'
  if (percentage >= 40) return 'from-yellow-500 to-orange-600'
  return 'from-red-500 to-pink-600'
})

const progressText = computed(() => {
  const percentage = props.stats.percentage
  if (percentage === 100) return '完美！所有任务都完成了'
  if (percentage >= 80) return '太棒了！继续保持'
  if (percentage >= 60) return '做得不错，继续加油'
  if (percentage >= 40) return '有进步，继续努力'
  if (percentage > 0) return '开始行动，慢慢来'
  return '开始你的第一个任务吧'
})
</script>

<template>
  <div class="mb-6">
    <!-- 进度条 -->
    <div class="card glass mb-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          完成进度
        </h3>
        <span class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {{ stats.percentage }}%
        </span>
      </div>
      
      <!-- 进度条 -->
      <div class="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700 mb-3">
        <div
          class="h-3 rounded-full bg-gradient-to-r transition-all duration-500 ease-out"
          :class="progressColor"
          :style="{ width: `${stats.percentage}%` }"
        ></div>
      </div>
      
      <!-- 进度文字 -->
      <p class="text-sm text-gray-600 dark:text-gray-400 text-center">
        {{ progressText }}
      </p>
    </div>
    
    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- 总任务数 -->
      <div class="card glass text-center group hover:scale-105 transition-transform duration-200">
        <div class="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
          <ListBulletIcon class="w-6 h-6 text-white" />
        </div>
        <h4 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          {{ stats.total }}
        </h4>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          总任务数
        </p>
      </div>
      
      <!-- 进行中任务 -->
      <div class="card glass text-center group hover:scale-105 transition-transform duration-200">
        <div class="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
          <ClockIcon class="w-6 h-6 text-white" />
        </div>
        <h4 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          {{ stats.active }}
        </h4>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          进行中
        </p>
      </div>
      
      <!-- 已完成任务 -->
      <div class="card glass text-center group hover:scale-105 transition-transform duration-200">
        <div class="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
          <CheckCircleIcon class="w-6 h-6 text-white" />
        </div>
        <h4 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          {{ stats.completed }}
        </h4>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          已完成
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
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
