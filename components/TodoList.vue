<template>
  <div>
    <ul>
      <li
        v-for="todo in todos"
        :key="todo.id">
        <span>{{ todo.title }}</span>
        <small
          class="change-status"
          @click="handleDoneTodo(todo)">
          done
        </small>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'

export default {
  computed: {
    ...mapGetters(['todos'])
  },
  methods: {
    async handleDoneTodo(todo) {
      const payload = _.cloneDeep(todo)
      payload.status = 'done'
      await this.updateTodo(payload)
    },
    ...mapActions(['updateTodo'])
  }
}
</script>

<style scoped>
.change-status {
  text-decoration: underline;
  cursor: pointer;
  text-indent: 1em;
}
</style>
