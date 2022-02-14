const pages = config('pages') // Get Pages from config

//Blog
export default [
  {
    title: 'ievent.cms.sidebar.adminGroup',
    icon: 'far fa-calendar',
    children: [
      pages.qevent.events,
      pages.qevent.categories,
    ]
  },
]
