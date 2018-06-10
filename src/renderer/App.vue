<template>
  <div style="height:100%;">
    <div class="header">
      <div class="navbar">
        <router-link :key="route.path" v-for="route in getRoutes" :to="route.path" v-bind:class="{ active: getActiveParentRoute === route.name }">{{ route.meta.breadcrumb }}</router-link>
      </div>
      <div class="sub-header">
        <breadcrumbs />
        <div class="integrations">
          <a :href="spotifyAuthorizeURL">
            <svg class="logo spotify-logo" :class="{ authorized: ısSpotifyAuthorized }" xmlns="http://www.w3.org/2000/svg" height="168px" width="168px" version="1.1" viewBox="0 0 168 168">
              <path d="m83.996 0.277c-46.249 0-83.743 37.493-83.743 83.742 0 46.251 37.494 83.741 83.743 83.741 46.254 0 83.744-37.49 83.744-83.741 0-46.246-37.49-83.738-83.745-83.738l0.001-0.004zm38.404 120.78c-1.5 2.46-4.72 3.24-7.18 1.73-19.662-12.01-44.414-14.73-73.564-8.07-2.809 0.64-5.609-1.12-6.249-3.93-0.643-2.81 1.11-5.61 3.926-6.25 31.9-7.291 59.263-4.15 81.337 9.34 2.46 1.51 3.24 4.72 1.73 7.18zm10.25-22.805c-1.89 3.075-5.91 4.045-8.98 2.155-22.51-13.839-56.823-17.846-83.448-9.764-3.453 1.043-7.1-0.903-8.148-4.35-1.04-3.453 0.907-7.093 4.354-8.143 30.413-9.228 68.222-4.758 94.072 11.127 3.07 1.89 4.04 5.91 2.15 8.976v-0.001zm0.88-23.744c-26.99-16.031-71.52-17.505-97.289-9.684-4.138 1.255-8.514-1.081-9.768-5.219-1.254-4.14 1.08-8.513 5.221-9.771 29.581-8.98 78.756-7.245 109.83 11.202 3.73 2.209 4.95 7.016 2.74 10.733-2.2 3.722-7.02 4.949-10.73 2.739z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import { ipcRenderer } from 'electron'

  export default {
    name: 'himmet-bot',
    data () {
      console.log(this.$router)
      return {}
    },
    computed: {
      getRoutes () {
        return this.$router.options.routes.filter(route => route.path !== '*')
      },
      spotifyAuthorizeURL () {
        return ipcRenderer.sendSync('get_spotify_authorize_url')
      },
      ısSpotifyAuthorized () {
        let spotify = ipcRenderer.sendSync('is_spotify_authorized')
        console.log('is spotify authorized', !!spotify.access_token)
        return !!spotify.access_token
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

.sub-header
  display: flex
  align-items: center
  justify-content: space-between
  .integrations
    .logo
      margin: 8px
    .spotify-logo
      cursor: pointer
      fill: #999
      width: 24px
      height: 24px
      transition: all .1s linear
      &.authorized, &:hover
        fill: #1ED760
        transition: all .3s linear

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
