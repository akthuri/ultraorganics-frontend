import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import elaboracionesList from '@/components/elaboracionesList'
import elaboracion from '@/components/elaboracion'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', component: index },
    { path: '/elaboraciones-list', component: elaboracionesList },
    { path: '/elaboracion', name: 'elaboracion', props: true, component: elaboracion }
  ]
})
