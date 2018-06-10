<template lang="pug">
  .plugins
    .plugin
      .plugin-icon Burada eklenti ikonu olacak
      .plugin-name Çekiliş Eklentisi
      .plugin-control-panel
        .plugin-enable Enable button
        .plugin-configuration Configuration icon
    .plugin
      .plugin-icon Burada eklenti ikonu olacak
      .plugin-name Çekiliş Eklentisi
      .plugin-control-panel
        .plugin-enable Enable button
        .plugin-configuration Configuration icon
    .plugin
      .plugin-icon Burada eklenti ikonu olacak
      .plugin-name Çekiliş Eklentisi
      .plugin-control-panel
        .plugin-enable Enable button
        .plugin-configuration Configuration icon
    .plugin
      .plugin-icon Burada eklenti ikonu olacak
      .plugin-name Çekiliş Eklentisi
      .plugin-control-panel
        .plugin-enable Enable button
        .plugin-configuration Configuration icon
</template>


<script>
  export default {
    name: 'plugins-page',
    data: function () {
      return {
        commands: []
      }
    }
  }
</script>

<style lang="sass" scoped>
  .plugins
    display: grid
    grid-template-areas: "plugin plugin plugin plugin"
    .plugin
      background: pink
      min-width: 200px
      margin: 5px 15px
</style>
