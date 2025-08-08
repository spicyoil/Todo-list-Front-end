const API_BASE_URL = 'https://nyuuvqltdiwu.sealosbja.site/api'

// 通用请求函数
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  
  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  }
  
  try {
    const response = await fetch(url, config)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }
    
    return data
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// API 函数
export const todoAPI = {
  // 获取所有待办事项
  async getAllTodos() {
    return request('/get-todo')
  },
  
  // 添加新的待办事项
  async addTodo(value, isCompleted = false) {
    return request('/add-todo', {
      method: 'POST',
      body: JSON.stringify({ value, isCompleted }),
    })
  },
  
  // 更新待办事项状态
  async updateTodoStatus(id) {
    return request(`/update-todo/${id}`, {
      method: 'POST',
    })
  },
  
  // 删除待办事项
  async deleteTodo(id) {
    return request(`/del-todo/${id}`, {
      method: 'POST',
    })
  },
}

// 数据转换函数
export const todoTransformers = {
  // 将后端数据转换为前端格式
  fromAPI(apiTodo) {
    return {
      id: apiTodo.id,
      text: apiTodo.value,
      completed: apiTodo.isCompleted,
      createdAt: apiTodo.createdAt,
      updatedAt: apiTodo.updatedAt,
    }
  },
  
  // 将前端数据转换为后端格式
  toAPI(frontendTodo) {
    return {
      value: frontendTodo.text,
      isCompleted: frontendTodo.completed,
    }
  },
}

