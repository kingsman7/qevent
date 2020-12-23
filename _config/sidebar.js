const pages = config('pages') // Get Pages from config

//Blog
export default [
  {
    title: 'qevent.sidebar.adminGroup',
    icon: 'fab fa-blogger',
    children: [
      pages.qevent.events,
      pages.qblog.categories,
    ]
  },
]
