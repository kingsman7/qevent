<template></template>
<script>
export default {
  data() {
    return {crudId: this.$uid()}
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        entityName: config("main.qevent.entityNames.event"),
        apiRoute: 'apiRoutes.qevent.events',
        permission: null,
        create: {
          title: this.$tr('qevent.layout.newEvent'),
        },
        read: {
          columns: [
            {name: 'id', label: this.$tr('ui.form.id'), field: 'id', style: 'width: 50px'},
            {name: 'title', label: this.$tr('ui.form.title'), field: 'title', align: 'rigth'},
            {
              name: 'parent', label: this.$tr('ui.form.parent'), field: 'parent', align: 'left',
              format: val => val ? (val.title ? val.title : '-') : '-'
            },
            {
              name: 'created_at', label: this.$tr('ui.form.createdAt'), field: 'createdAt', align: 'left',
              format: val => val ? this.$trd(val) : '-',
            },
            {name: 'actions', label: this.$tr('ui.form.actions'), align: 'left'},
          ],
          requestParams: {}
        },
        update: {
          title: this.$tr('qevent.layout.updateEvent'),
          requestParams: {}
        },
        delete: true,
        formLeft: {
          id: {value: ''},
          userId: {value: this.$store.state.quserAuth.userId},
          title: {
            value: '',
            type: 'input',
            props: {
              label: `${this.$tr('ui.form.title')}*`,
              rules: [val => !!val || this.$tr('ui.message.fieldRequired')]
            },
          },
          slug: {
            value: '',
            type: 'input',
            props: {
              label: `${this.$tr('ui.form.slug')}*`,
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            },
          },
          description: {
            value: '',
            type: 'html',
            props: {
              label: `${this.$tr('ui.form.description')}*`,
              rules: [
                val => !!val || this.$tr('ui.message.fieldRequired')
              ],
            }
          },
        },
        formRight: {
          date: {
            value: null,
            type: 'date',
            props: {
              label: `${this.$tr('ui.form.date')}*`,
              rules: [val => !!val || this.$tr('ui.message.fieldRequired')],
              options: (date) => date >= this.$moment().format('YYYY/MM/DD')
            },
          },
          hour: {
            value: null,
            type: 'hour',
            props: {
              label: `${this.$tr('ui.form.hour')}*`,
              rules: [val => !!val || this.$tr('ui.message.fieldRequired')],
              options: (hr, min, sec) => {
                //If is diferent day permit all times
                if (!this.crudInfo.date || (this.crudInfo.date) != this.$moment().format('YYYY/MM/DD'))
                  return true
                //Validate time same or up to current
                if (hr && (hr < this.$moment().format('h'))) return false
                if ((min !== null) && (min <= this.$moment().format('mm'))) return false
                return true
              }
            },
          },
          categoryId: {
            value: null,
            type: 'crud',
            props: {
              crudType: 'select',
              crudData: import('@imagina/qevent/_crud/categories'),
              crudProps: {
                label: `${this.$tr('ui.form.category')}*`,
                rules: [val => !!val || this.$tr('ui.message.fieldRequired')],
              },
            },
          },
          departmentId: {
            value: null,
            type: 'select',
            props: {
              label: `${this.$tr('ui.label.department')}*`,
              rules: [val => !!val || this.$tr('ui.message.fieldRequired')],
            },
            loadOptions: {
              apiRoute: 'apiRoutes.quser.departments'
            }
          },
          isPublic: {
            value: 1,
            type: 'select',
            props: {
              label: `${this.$tr('ui.form.type')}`,
              options: [
                {label: this.$tr('ui.label.public'), value: 1},
                {label: this.$tr('ui.label.private'), value: 0},
              ]
            }
          },
          status: {
            value: '1',
            type: 'select',
            props: {
              label: this.$tr('ui.form.status'),
              options: [
                {label: this.$tr('ui.label.enabled'), value: '1'},
                {label: this.$tr('ui.label.disabled'), value: '0'},
              ]
            },
          },
          mediasSingle: {
            value: {},
            type: 'media',
            props: {
              label: this.$tr('ui.form.image'),
              zone: 'mainimage',
              entity: "Modules\\Ievent\\Entities\\Event",
              entityId: null
            }
          }
        }
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    },
  },
  methods: {}
}
</script>
