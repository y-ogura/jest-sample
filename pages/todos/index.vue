<template>
  <section>
    <TodoForm/>
    <TodoList/>
  </section>
</template>

<script>
import TodoForm from '~/components/TodoForm.vue'
import TodoList from '~/components/TodoList.vue'

export default {
  async asyncData({ store }) {
    await store.dispatch('fetchTodos')
  },
  components: {
    TodoForm,
    TodoList
  }
}
</script>

<style>
</style>
