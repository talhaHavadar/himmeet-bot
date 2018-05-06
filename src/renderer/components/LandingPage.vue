<template>
  <div>
    <div class="container">
      <h1>LandingPage</h1>
      <router-link to="/commands">Komutlar</router-link>
    </div>
  </div>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'

  export default {
    name: 'landing-page',
    components: { SystemInformation },
    data: function () {
      console.log(this.$electron.ipcRenderer)
      return {
        commands: [{
          name: '!discord',
          action: { name: 'print', message: 'Print my discord link.' }
        }]
      }
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }


</style>