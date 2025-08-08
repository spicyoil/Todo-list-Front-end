<script setup>
import { TransitionGroup } from 'vue'
import TodoItem from './TodoItem.vue'

const props = defineProps({
  todos: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['toggle-todo', 'delete-todo'])
</script>

<template>
  <div class="space-y-3">
    <TransitionGroup
      name="list"
      tag="div"
      class="space-y-3"
    >
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        @toggle-todo="$emit('toggle-todo', $event)"
        @delete-todo="$emit('delete-todo', $event)"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-move {
  transition: transform 0.3s ease;
}
</style>
