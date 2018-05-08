<template lang="pug">
  .content.content--center(v-if="isActivePage && commands.length === 0")
    h1(style="color:#f5f5f5") Yeni Komut Ekle
    p(style="color:#ddd") Hiç komut eklememişsiniz bir komut ekleyerek başlayın
    .add-container(@click="goToNewCommand" v-bind:title="titleForAddAction")
      .plus
        .up-left
        .center
        .down-right
  .column.is-12(v-else-if="isActivePage")
    .columns
      .column.is-6
        h1.title(style="color: #f5f5f5") Komut Listesi
      .column.is-6
        button.button.is-success.is-outlined.is-medium.is-pulled-right(@click="goToNewCommand")
          span.icon
            i.fa.fa-plus
          span Ekle
    .column.is-12
      .commands-container
        .command-container(v-for="command in commands")
          .command-left
            .command-name
              label.label Komut: {{ command.command }}
            .command-text
              label.label Metin: {{ command.text }}
          .command-right
              p.control.has-addons
                button.button.is-edit
                  span.icon
                    i.fa.fa-edit
                pop-confirm(ok-text="Evet" :show-cancel="false" content="Silmek istediğinize emin misiniz?" :on-ok="deleteCommand.bind(this, command)")
                  button.button.is-delete
                    span.icon
                      i.fa.fa-times
  router-view(v-else)
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'commands',
  mounted () {
    this.refreshCommands()
  },
  computed: {
    ...mapGetters({
      commands: 'getCommands'
    }),
    isActivePage () {
      return this.$store.state.route.name === 'commands'
    },
    titleForAddAction () {
      return 'Yeni Komut Ekle'
    }
  },
  methods: {
    ...mapActions([
      'refreshCommands',
      'removeCommand'
    ]),
    goToNewCommand () {
      this.$router.push({ name: 'new-command' })
    },
    deleteCommand (command) {
      this.removeCommand(command)
      this.$notify.success({ content: 'Komut silindi!' })
    }
  }
}
</script>

<style lang="sass" scoped>
.label
  color: #f5f5f5

.commands-container
  display: grid
  grid-template-columns: 50% 50%
  grid-template-rows: auto

  .command-container
    display: grid
    grid-template-areas: "left left left right"
    cursor: pointer
    color: #f5f5f5
    border: 1px solid #222
    border-radius: 5px
    background: #333
    padding: 10px 20px
    margin: 10px 20px
    &:hover
      transition: all 200ms linear
      box-shadow: 1px 2px 7px #222
    .command-left
      grid-area: left
    .command-right
      grid-area: right
      margin-right: -20px
      margin-top: -10px
      margin-bottom: -10px
      min-height: 100%
      p.control
        width: 100%
        height: 100%
        justify-content: flex-end
        .button
          height: 100%
          border: none
          background: none
          color: #f5f5f5
          &:hover
            &.is-edit
              color: #00c0ef
            &.is-delete
              color: #f56954
.content
  display: grid
  &.content--center
    display: grid
    align-content: center
    justify-items: center
.add-container
  .plus
    cursor: pointer
    position: relative
    left: -26px
    top: 25px
    .up-left
      display: inline-block
      &:before
        display: block
        position: relative
        left: 50px
        content: ' '
        width: 40px
        height: 50px
        background: rgba(#eee, .7)
        border: 1px solid #eee
        border-bottom: none
        border-radius: 5px 5px 0 0
        box-shadow: 0 -3px 10px #222
        transition: all 100ms linear
      &:after
        display: block
        position: relative
        top: 0px
        content: ' '
        width: 50px
        height: 40px
        background: rgba(#eee, .7)
        border: 1px solid #eee
        border-right: none
        border-radius: 5px 0 0 5px
        box-shadow: -3px 0 10px #222
        transition: all 100ms linear
    .center
      z-index: 999
      display: inline-block
      position: relative
      top: 0px
      content: ' '
      width: 40px
      height: 40px
      background: rgba(#eee, .7)
      border: none
      border-radius: 0
      transition: all 100ms linear

    .down-right
      display: block
      position: relative
      top: -46px
      &:before
        display: block
        position: relative
        content: ' '
        left: 90px
        width: 50px
        height: 40px
        background: rgba(#eee, .7)
        border: 1px solid #eee
        border-left: none
        border-radius: 0 5px 5px 0
        box-shadow: 3px 0 10px #222
        transition: all 100ms linear
      &:after
        display: block
        position: relative
        content: ' '
        left: 50px
        width: 40px
        height: 50px
        background: rgba(#eee, .7)
        border: 1px solid #eee
        border-top: none
        border-radius: 0 0 5px 5px
        box-shadow: 0 3px 10px #222
        transition: all 100ms linear
    
    &:hover
      .up-left, .down-right
        &:before, &:after
          transition: all 200ms linear
          background: rgba(#ccff66, .7)
          border: 1px solid #ccff66
      .up-left
        &:before
          border-bottom: none
        &:after
          border-right: none
      .down-right
        &:before
          border-left: none
        &:after
          border-top: none
      .center
        transition: all 200ms linear
        background: rgba(#ccff66, .7)
</style>
