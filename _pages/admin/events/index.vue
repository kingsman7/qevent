<template>
  <div id="pageEvents" :key="pageId">
    <!--Content-->
    <div id="contentEvents" class="box relative-position">
      <!--Event crud-->
      <crud :crud-data="import('@imagina/qevent/_crud/events')" type="form-only" ref="eventCrud"
            @created="getData(true)" @updated="getData(true)"/>
      <!--Actions-->
      <div class="row justify-between q-py-sm q-px-md items-center">
        <!--Search-->
        <div class="col-12 col-md-4 col-xl-3">
          <dynamic-field :field="dynamicFields.search" v-model="search" @input="getData()"/>
        </div>
        <!--Button new record-->
        <div class="col-12 col-md-8 col-xl-9 text-right">
          <div class="q-hide q-md-show">
            <q-btn icon="fas fa-plus" round unelevated size="12px" style="font-size: 10px; padding: 6px"
                   @click="$refs.eventCrud.create()" color="green" class="q-my-xs">
              <q-tooltip>{{ $tr('qevent.layout.newEvent') }}</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
      <!--Separator-->
      <q-separator/>
      <!--Calendar-->
      <calendar :events-data="eventsData" :event-actions="eventActions"/>
      <!--Inner loading-->
      <inner-loading :visible="loading"/>
    </div>
  </div>
</template>
<script>
import {colors} from 'quasar'
//Components
import calendar from '@imagina/qsite/_components/master/calendar'

export default {
  beforeDestroy() {
    this.$root.$off('page.data.refresh')
  },
  props: {},
  components: {calendar},
  watch: {},
  validations() {
    return {}
  },
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      pageId: this.$uid(),
      loading: false,
      eventsData: [],
      search: null,
      eventActions: [
        {
          label: this.$tr('ui.label.update'),
          icon: 'fas fa-pen',
          color: 'green',
          callBack: (event) => this.$refs.eventCrud.update(event)
        }
      ]
    }
  },
  computed: {
    //Dynamic fields
    dynamicFields() {
      return {
        search: {
          value: null,
          type: 'search'
        }
      }
    }
  },
  methods: {
    async init() {
      //Set filters
      this.setFilters()
      //Get data
      this.getData()
      //Listen refresh event
      this.$root.$on('page.data.refresh', () => {
        this.pageId = this.$uid()
        this.getData(true)
      })
      //Mobile main action
      this.$eventBus.$emit('setMobileMainAction', {
        icon: 'fas fa-plus',
        color: 'green',
        callBack: () => this.$refs.eventCrud.create()
      })
    },
    //Set filters
    setFilters() {
      this.$filter.setFilter({
        name: this.$route.name,
        fields: {
          categoryId: {
            value: null,
            type: 'treeSelect',
            props: {
              label: this.$tr('ui.label.category')
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qevent.categories'
            }
          },
          departmentId: {
            value: null,
            type: 'treeSelect',
            props: {
              label: this.$tr('ui.label.department')
            },
            loadOptions: {
              apiRoute: 'apiRoutes.quser.departments'
            }
          },
          status: {
            value: '1',
            type: 'select',
            props: {
              label: this.$tr('ui.form.status'),
              clearable: true,
              options: [
                {label: this.$tr('ui.label.enabled'), value: '1'},
                {label: this.$tr('ui.label.disabled'), value: '0'},
              ]
            },
          }
        },
        callBack: () => this.getData(true)
      })
    },
    //Get data
    async getData(refresh = false) {
      //Loading
      this.loading = true
      this.eventsData = []
      //Request data
      await Promise.all([
        this.getEvents(refresh),//Get events
        this.getUsersBirthday(refresh)//Get users birthday
      ])
      //Loading
      this.loading = false
    },
    //Get data
    getEvents(refresh = false) {
      return new Promise((resolve, reject) => {
        //Request params
        let requestParams = {
          refresh: refresh,
          params: {
            include: 'department,category',
            filter: {
              ...(this.$filter.values || {}),
              search: this.search,
            }
          }
        }
        //Request
        this.$crud.index('apiRoutes.qevent.events', requestParams).then(response => {
          //Transform events
          response.data.forEach(event => {
            this.eventsData.push({
              id: event.id,
              title: `${!parseInt(event.status) ? this.$tr('ui.label.cancelled') : ''} ${event.title}`,
              color: parseInt(event.status) ? (event.category ? (event.category.options.color || '#26a69a') : '#26a69a') : '#e57373',
              icon: parseInt(event.status) ? 'fas fa-calendar' : 'fas fa-calendar-times',
              image: event.mediaFiles.mainimage.mediumThumb,
              date: event.date,
              mainDetails: [
                {title: this.$tr('ui.label.category'), icon: 'fas fa-calendar-check', value: event.category.title},
                {title: this.$tr('ui.label.department'), icon: 'fas fa-users', value: event.department.title},
              ],
              extraDetails: [
                {title: this.$tr('ui.label.category'), icon: 'fas fa-calendar-check', value: event.category.title},
                {title: this.$tr('ui.label.department'), icon: 'fas fa-users', value: event.department.title},
                {value: event.description}
              ]
            })
          })
          //Response
          resolve(response.data)
        }).catch(error => {
          resolve(true)
        })
      })
    },
    //Get birthdays
    getUsersBirthday(refresh = false) {
      return new Promise((resolve, reject) => {
        //Request params
        let requestParams = {refresh: refresh}
        //Request
        this.$crud.index('apiRoutes.quser.usersBirthday', requestParams).then(response => {
          //Transform events
          response.data.forEach(event => {
            this.eventsData.push({
              //id: event.id,
              title: event.fullName,
              color: '#e57373',
              icon: 'fas fa-birthday-cake',
              date: event.birthday,
              mainDetails: [
                {
                  title: this.$tr('ui.label.category'),
                  icon: 'fas fa-calendar-check',
                  value: this.$tr('ui.label.birthday')
                },
                {
                  title: this.$tr('ui.label.department'),
                  icon: 'fas fa-users',
                  value: this.$tr('ui.label.birthday')
                },
              ],
              extraDetails: [
                {
                  title: this.$tr('ui.label.category'),
                  icon: 'fas fa-calendar-check',
                  value: this.$tr('ui.label.birthday')
                },
                {
                  title: this.$tr('ui.label.department'),
                  icon: 'fas fa-users',
                  value: this.$tr('ui.label.birthday')
                }
              ]
            })
          })
          //Response
          resolve(response.data)
        }).then(error => {
          resolve(false)
        })
      })
    }
  }
}
</script>
<style lang="stylus">
#pageEvents
  #contentEvents
    padding 0
</style>
