const pages = config('pages') // Get Pages from config

//Blog
export default [
  {
    title: 'qevent.sidebar.adminGroup',
    icon: 'far fa-calendar',
    children: [
      pages.qevent.events,
      pages.qevent.categories,
    ]
  },
]
