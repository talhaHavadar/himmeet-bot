import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default,
      meta: {
        breadcrumb: 'Himmeet'
      }
    },
    {
      path: '/commands',
      name: 'commands',
      component: require('@/components/CommandsPage').default,
      meta: {
        breadcrumb: 'Komutlar'
      },
      children: [
        {
          name: 'new-command',
          path: 'new',
          component: require('@/components/CommandsPage/NewCommand').default,
          meta: {
            breadcrumb: 'Yeni Komut'
          }
        }, {
          name: 'edit-command',
          path: ':name/edit',
          component: require('@/components/CommandsPage/EditCommand').default,
          meta: {
            breadcrumb: 'Düzenle'
          }
        }
      ]
    },
    {
      path: '/plugins',
      name: 'plugins',
      component: require('@/components/PluginsPage').default,
      meta: {
        breadcrumb: 'Eklentiler'
      }
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
