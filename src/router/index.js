import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import elaboracionesList from '@/components/elaboracionesList'
import elaboracion from '@/components/elaboracion'
import trasladosList from '@/components/trasladosList'
import traslado from '@/components/traslado'
import almacenes from '@/components/almacenes'
import usuario from '@/components/usuario'
import usuariosList from '@/components/usuariosList'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', component: index },
    { path: '/elaboraciones-list', component: elaboracionesList },
    { path: '/elaboracion', name: 'elaboracion', props: true, component: elaboracion },
    { path: '/traslados-list', component: trasladosList },
    { path: '/traslado', props: true, name: 'traslado', component: traslado },
    { path: '/almacenes', component: almacenes },
    { path: '/usuarios-list', component: usuariosList },
    { path: '/usuario', name: 'usuario', props: true, component: usuario }
  ]
})
