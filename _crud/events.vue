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
            requestParams: {include: 'parent'}
          },
          update: {
            title: this.$tr('qevent.layout.updateEvent'),
            requestParams: {include: 'parent,city'}
          },
          delete: true,
          formLeft: {
            id: {value: ''},
            userId: {value: this.$store.state.quserAuth.userId},
            departmentId: {value: this.$store.state.quserAuth.selectedDepartmentId},
            mainImage: {
              value: null,
              type: 'image',
              isFakeField : true,
              props: {
                label: this.$tr('ui.label.logo'),
                defaultImage : `${this.$store.state.app.baseUrl}/modules/iblog/img/category/default.jpg`
              }
            },
            title: {
              value: '',
              type: 'input',
              props: {
                label: `${this.$tr('ui.form.title')}*`,
                rules: [val => !!val || this.$tr('ui.message.fieldRequired')]
              },
            },
            isPublic: {
              value: 1,
              type: 'select',
              props: {
                label: `${this.$tr('qevent.layout.form.public')}`,
                options: [
                  {label: this.$tr('ui.label.yes'), value: 1},
                  {label: this.$tr('ui.label.no'), value: 0},
                ]
              }
            },
            date: {
              value: null,
              type: 'date',
              props: {
                label: `${this.$tr('ui.form.date')}*`,
                rules: [val => !!val || this.$tr('ui.message.fieldRequired'), 'date'],
                options : (date) => date >= this.$moment().format('YYYY/MM/DD')
              },
            },
            hour: {
              value: null,
              type: 'hour',
              props: {
                label: `${this.$tr('ui.form.hour')}*`,
                rules: [val => !!val || this.$tr('ui.message.fieldRequired'), 'time'],
                options : (hr, min, sec) => {
                  //If is diferent day permit all times
                  if(!this.crudInfo.date || (this.crudInfo.date) != this.$moment().format('YYYY/MM/DD'))
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
              type: 'select',
              props: {
                label: `${this.$tr('ui.form.category')}*`,
                rules: [val => !!val || this.$tr('ui.message.fieldRequired')],
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qevent.categories',
                requestParams: {filter: {departmentId: this.$store.state.teamMaster.selectedDiscipline.id}}
              }
            },
            placeId: {
              value: null,
              type: 'select',
              props: {
                label: `${this.$tr('qevent.layout.form.place')}*`,
              }
            },
            description: {
              value: '',
              type: 'input',
              props: {
                label: `${this.$tr('ui.form.description')}*`,
                type: 'textarea',
                rows: 2,
                rules: [
                  val => !!val || this.$tr('ui.message.fieldRequired'),
                  val => val.length >= 20 || this.$tr('ui.message.fieldMinLeng', {num: 20})
                ],
              }
            },
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
