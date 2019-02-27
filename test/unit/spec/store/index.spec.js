import Vuex, { Store } from 'vuex'
import * as index from '~/store'
import { createLocalVue } from '@vue/test-utils'
import _ from 'lodash'
import axios from 'axios'

const localVue = createLocalVue()
localVue.use(Vuex)

let mockAxiosGetResult
jest.mock('axios', () => ({
  $get: jest.fn(() => Promise.resolve(mockAxiosGetResult)),
  $post: jest.fn(() => Promise.resolve(mockAxiosGetResult)),
  $patch: jest.fn(() => Promise.resolve(mockAxiosGetResult))
}))

let action
const testedAction = (context = {}, payload = {}) => {
  return index.actions[action].bind({ $axios: axios})(context, payload)
}

describe('store/index.js', () => {
  let store
  let todo1, todo2
  beforeEach(() => {
    store = new Vuex.Store(_.cloneDeep(index))
    todo1 = {id:'1', title:'title_1', status: 'todo'}
    todo2 = {id:'2', title:'title_2', status: 'done'}
  })

  describe('getters', () => {
    let todos
    beforeEach(() => {
      todos = [todo1, todo2]
      store.replaceState({
        todos: todos
      })
    })

    describe('todos', () => {
      test('statusがtodoのtodoが取得できること', () => {
        expect(store.getters['todos']).toContainEqual(todo1)
        expect(store.getters['todos']).not.toContainEqual(todo2)
      })
    })
    describe('todos_all', () => {
      test('すべてのtodoが取得できること', () => {
        expect(store.getters['todos_all']).toEqual(
          expect.arrayContaining(todos)
        )
      })
    })
  })

  describe('actions', () => {
    let commit
    beforeEach(() => {
      commit = store.commit
    })

    describe('fetchTodos', () => {
      test('todosが取得できること', async done => {
        action = 'fetchTodos'
        mockAxiosGetResult = {
          documents: [
            {
              name: `path/to/${todo1.id}`,
              fields: {
                title: { stringValue: todo1.title },
                status: { stringValue: todo1.status }
              }
            }
          ]
        }

        await testedAction({ commit })
        expect(store.getters['todos']).toContainEqual(todo1)
        done()
      })
    })

    describe('addTodo', () => {
      test('todoが追加されること', async done => {
        mockAxiosGetResult = {
          name: `path/to/${todo1.id}`,
          fields: {
            title: { stringValue: todo1.title },
            status: { stringValue: todo1.status }
          }
        }
        action = 'addTodo'
        await testedAction({ commit })
        expect(store.getters['todos']).toContainEqual(todo1)
        done()
      })
    })

    describe('updateTodo', () => {
      beforeEach(() => {
        store.replaceState({
          todos: [todo1]
        })
      })

      test('todoが更新されること', async done => {
        mockAxiosGetResult = {
          name: `path/to/${todo1.id}`,
          fields: {
            title: { stringValue: 'updatedTitle' },
            status: { stringValue: 'done' }
          }
        }
        action = 'updateTodo'
        await testedAction({ commit })
        expect(store.getters['todos_all']).toContainEqual({
          id: todo1.id,
          title: 'updatedTitle',
          status: 'done'
        })
        done()
      })
    })
  })
})
