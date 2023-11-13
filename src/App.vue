<template>
  <v-layout>
    <v-app-bar prominent>
      <v-app-bar-nav-icon variant="text" @click.stop="rail = !rail"></v-app-bar-nav-icon>
      <v-toolbar-title class="font-weight-bold">{{ title }}</v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" permanent expand-on-hover :rail="rail">
      <v-list>
        <v-list-item v-for="(item, index) in listItems" :key="index" :to="item.router">
          <template v-slot:prepend>
            <v-avatar>
              <div :class="item.name" style="width: 25px; height: 25px"></div>
            </v-avatar>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main class="d-flex align-center justify-center">
      <RouterView />
    </v-main>
  </v-layout>
</template>

<script>
import { ref } from 'vue'
import _ from 'lodash'
export default {
  setup() {
    const title = ref('')
    const drawer = ref(true)
    const rail = ref(true)
    const listItems = ref([
      { name: 'mosquitoyo', title: '蚊子YO', router: '/' },
      { name: 'venus_calendar', title: '卓爾金曆', router: '/calendar' },
      { name: 'friendlist', title: '好友列表', router: '/friends' }
    ])
    return {
      title,
      drawer,
      listItems,
      rail
    }
  },
  mounted() {
    this.setTitle()
  },
  watch: {
    $route() {
      this.$nextTick(this.setTitle())
    }
  },
  methods: {
    setTitle() {
      const path = location.pathname
      this.title = _.find(this.listItems, (v) => v.router == path)?.title ?? ''
    }
  }
}
</script>