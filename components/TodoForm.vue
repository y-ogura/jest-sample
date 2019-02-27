<template>
  <div>
    <input
      v-model="todoForm.title"
      type="text">
    <button
      type="button"
      @click="handleAddTodo">
      Submit
    </button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import _ from 'lodash'

export default {
  data() {
    return {
      todoForm: { title: '' }
    }
  },
  methods: {
    async handleAddTodo() {
      if (this.todoForm.title) {
        await this.addTodo(_.cloneDeep(this.todoForm))
        this.todoForm.title = ''
      }
    },
    ...mapActions(['addTodo'])
  }
}
</script>

<style scoped>
</style>
