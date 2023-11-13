import './assets/main.css'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import _ from 'lodash'

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)
app.use(router).use(vuetify).mount('#app')
