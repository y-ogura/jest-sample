import _ from 'lodash'

export const state = () => ({
  todos: []
})

export const getters = {
  todos_all: state => state.todos,
  todos: state => state.todos.filter(todo => todo.status === 'todo')
}

export const mutations = {
  updateTodos(state, todos) {
    state.todos = todos
  },
  addTodo(state, newTodo) {
    state.todos.push(newTodo)
  },
  updateTodo(state, newTodo) {
    const todo = state.todos.find(todo => todo.id === newTodo.id)
    if (todo) {
      todo.title = newTodo.title
      todo.status = newTodo.status
    }
  }
}

export const actions = {
  async fetchTodos({ commit }) {
    await this.$axios.$get('/todos').then(res => {
      let todos = []
      if (_.has(res, 'documents')) {
        todos = res.documents.map(doc => {
          return {
            id: _.last(doc.name.split('/')),
            title: doc.fields.title.stringValue,
            status: doc.fields.status.stringValue
          }
        })
      }
      commit('updateTodos', todos)
    })
  },
  async addTodo({ commit }, payload) {
    const req = {
      fields: {
        title: {
          stringValue: payload.title
        },
        status: {
          stringValue: 'todo'
        }
      }
    }
    await this.$axios.$post('/todos', req).then(res => {
      const newTodo = {
        id: _.last(res.name.split('/')),
        title: res.fields.title.stringValue,
        status: res.fields.status.stringValue
      }
      commit('addTodo', newTodo)
    })
  },
  async updateTodo({ commit }, payload) {
    const req = {
      fields: {
        title: {
          stringValue: payload.title
        },
        status: {
          stringValue: payload.status
        }
      }
    }
    await this.$axios.$patch(`/todos/${payload.id}`, req).then(res => {
      const newTodo = {
        id: _.last(res.name.split('/')),
        title: res.fields.title.stringValue,
        status: res.fields.status.stringValue
      }
      commit('updateTodo', newTodo)
    })
  }
}
