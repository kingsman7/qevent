export default {
  events: {
    permission: 'ievent.events.manage',
    activated: true,
    authenticated: true,
    path: '/event/events',
    name: 'qevent.admin.events',
    page: () => import('@imagina/qevent/_pages/admin/events/index'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qevent.sidebar.adminEvents',
    icon: 'fas fa-calendar-check',
    subHeader: {
      refresh: true,
    }
  },
  categories: {
    permission: 'ievent.categories.manage',
    activated: true,
    authenticated: true,
    path: '/event/categories',
    name: 'qevent.admin.categories',
    page: () => import('@imagina/qevent/_pages/admin/categories/index'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qevent.sidebar.adminCategories',
    icon: 'fas fa-calendar-week',
    subHeader: {
      refresh: true,
    }
  }
}
