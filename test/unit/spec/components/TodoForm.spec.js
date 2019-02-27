import Vuex from 'vuex'
import { mount, createLocalVue } from '@vue/test-utils'
import * as store from '~/store'
import TodoForm from '~/components/TodoForm.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('components/TodoForm.vue', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(TodoForm, {
      store: store,
      localVue
    })
  })

  describe('template', () => {
    test('入力フォームが存在すること', () => {
      expect(wrapper.contains('input[type="text"]')).toBe(true)
      expect(wrapper.contains('button')).toBe(true)
    })

    describe('フォームの操作', () => {
      beforeEach(() => {
        wrapper.find('input[type="text"]').setValue('this title')
      })
      test('dataに入力が反映されること', () => {
        expect(wrapper.vm.todoForm.title).toBe('this title')
      })
      test('ボタンクリックでhandleAddTodoが呼ばれること', () => {
        const mock = jest.fn()
        wrapper.setMethods({ handleAddTodo: mock })
        wrapper.find('button').trigger('click')
        expect(mock).toBeCalled()
      })
    })
  })

  describe('script', () => {
    describe('data', () => {
      test('dataの構造が正しいこと', () => {
        expect(wrapper.vm.$data).toHaveProperty('todoForm.title')
      })
    })

    describe('methods', () => {
      describe('handleAddTodo', () => {
        let mock
        beforeEach(() => {
          mock = jest.fn()
          wrapper.setMethods({ addTodo: mock })
        })

        describe('titleに入力がある場合', () => {
          test('action addTodoが発行されること', async done => {
            wrapper.find('input[type="text"]').setValue('this title')
            await wrapper.vm.handleAddTodo()
            expect(mock).toBeCalled()
            done()
          })
        })

        describe('titleが空の場合', () => {
          test('action addTodoが発行されないこと', async done => {
            wrapper.find('input[type="text"]').setValue('')
            await wrapper.vm.handleAddTodo()
            expect(mock).not.toBeCalled()
            done()
          })
        })
      })
    })
  })
})
