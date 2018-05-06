<template>
  <div style="height:100%;">
    <div class="header">
      <div class="navbar">
        <router-link :key="route.path" v-for="route in getRoutes" :to="route.path" v-bind:class="{ active: getActiveParentRoute === route.name }">{{ route.meta.breadcrumb }}</router-link>
      </div>
      <breadcrumbs />
    </div>
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'himmet-bot',
    data () {
      console.log(this.$router)
      return {}
    },
    computed: {
      getRoutes () {
        return this.$router.options.routes.filter(route => route.path !== '*')
      }
    }
  }
</script>

<style lang="sass">
html, body
  background-color: #444
  min-height: 100%
  height: 100%

.navbar
  display: flex
  background-color: #222
  box-shadow: 0 3px 10px #111
  a
    text-decoration: none
    color: #fafafa
    padding: 10px 12px
    font-size: 17px
    border-bottom: 2px solid #222
    transition: all 100ms linear
    
    &.active, &:hover
      border-bottom: 2px solid greenyellow
      background-color: #171717
      transition: all 200ms linear

.checkbox
  &:hover
    color: #eee

nav.breadcrumbs
  display: flex
  align-items: center
  height: calc(100% - 44px)
  padding: 10px 10px

  ul
    list-style: none
    li
      display: inline
      font-size: 14px
      + li:before
        padding: 8px
        color: #fafafa
        content: '/\00a0'

      a
        color: greenyellow
        text-decoration: none
        &:hover
          color: green
</style>
