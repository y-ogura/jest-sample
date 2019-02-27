import Vuex from 'vuex'
import { mount, createLocalVue } from '@vue/test-utils'
import * as indexStore from '@/store'
import TodoList from '@/components/TodoList.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('components/TodoList.vue', () => {
  let wrapper
  let store
  let todo1
  beforeEach(() => {
    store = new Vuex.Store(indexStore)
    todo1 = { id: '1', title: 'title_1', status: 'todo' }
    wrapper = mount(TodoList, {
      store: store,
      localVue
    })
    store.replaceState({ todos: [todo1] })
  })

  describe('template', () => {
    test('todoのリストが表示されること', () => {
      const li = wrapper.find('li')
      expect(li.find('span').text()).toBe(todo1.title)
      expect(li.find('small').text()).toBe('done')
    })

    describe('todoリストのdoneをクリックする場合', () => {
      test('handleDoneTodoが指定の引数で呼び出されること', () => {
        const mock = jest.fn(todo => todo)
        wrapper.setMethods({ handleDoneTodo: mock })
        wrapper.find('li small').trigger('click')
        expect(mock).toBeCalled()
        expect(mock.mock.results[0].value).toBe(todo1)
      })
    })
  })

  describe('script', () => {
    describe('computed', () => {
      describe('todos', () => {
        test('storeからtodosが取得できること', () => {
          expect(wrapper.vm.todos).toEqual(expect.arrayContaining([todo1]))
        })
      })
    })

    describe('methods', () => {
      describe('handleDoneTodo', () => {
        test('action updateTodoがpayload.status=doneで発行されること', async done => {
          const mock = jest.fn(payload => payload.status === 'done')
          wrapper.setMethods({ updateTodo: mock })
          await wrapper.vm.handleDoneTodo(todo1)
          expect(mock.mock.results[0].value).toBe(true)
          done()
        })
      })
    })
  })
})
