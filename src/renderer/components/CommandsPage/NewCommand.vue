<template lang="pug">
  .column.is-12
    h1.title(style="color: #f5f5f5") Yeni Komut
    .column.is-6.is-offset-3
      label.label {{ formTranslations.command.label }}
      p.control.has-icon.has-icon-left
        input.input(required type='text' :class="{ 'is-danger': $v.form.command.$error }" v-model="form.command" @input="checkCommandAvailability()" :placeholder='formTranslations.command.placeholder')
        i.fa.fa-exclamation
        span.help.is-danger(v-if="!$v.form.command.required") {{ formTranslations.command.validations.required }}
        span.help.is-danger(v-if="!$v.form.command.minLength") {{ formTranslations.command.validations.minLength }}
        span.help.is-success(v-if="command_available && !$v.form.command.$invalid") {{ formTranslations.command.validations.available }}
        span.help.is-danger(v-if="!command_available && !$v.form.command.$invalid") {{ formTranslations.command.validations.duplicated }}
      label.label {{ formTranslations.text.label }}
      p.control
        input.input(required type='text' :class="{ 'is-danger': $v.form.text.$error }" v-model="form.text" @input="commandTextChanged()" :placeholder='formTranslations.text.placeholder')
        span.help.is-danger(v-if="!$v.form.text.required") {{ formTranslations.text.validations.required }}
        span.help.is-danger(v-if="!$v.form.text.minLength") {{ formTranslations.text.validations.minLength }}
      p.control
        label.checkbox
          input(type='checkbox' v-model="form.auto_repeat")
          |     Tekrar eden komut
      .advanced-settings.control(v-if="show_advanced_settings")
        label.label {{ formTranslations.repeat.minutes.label }}
        p.control
          input-number(:min="0" :max="1440" :val="form.repeat.minutes" :disabled="!form.auto_repeat" :on-change="updateRepeatMinutes")
          span.help(style="color:#ddd") {{ formTranslations.repeat.minutes.help }}
        label.label {{ formTranslations.repeat.lines.label }}
        p.control
          input-number(:min="0" :max="9999" :val="form.repeat.lines" :disabled="!form.auto_repeat" :on-change="updateRepeatLines")
          span.help(style="color:#ddd") {{ formTranslations.repeat.lines.help }}
        label.label {{ formTranslations.cooldown.label }}
        p.control
          input-number(:min="0" :max="1440" :val="form.cooldown" :on-change="updateCooldown")
          span.help(style="color:#ddd") {{ formTranslations.cooldown.help }}
        label.label {{ formTranslations.permissions.label }}
        p.control.has-addons
          span.select
            select(v-model="selected_permission_in_selectbox")
              option(v-for="userGroup in unselectedPermissions" :key="userGroup.id" :value="userGroup") {{ userGroup.name }}
          button.button.is-primary(@click="addPermission") {{ formTranslations.permissions.add_button }}
          p.control
            tag(style="margin: 0 5px" type="primary" :closable="true" :key="userGroup.id" v-for="userGroup in selectedPermissions" :on-close="removePermission.bind(this, userGroup.id)") {{ userGroup.name }}
            span.help(style="color: #ddd") {{ formTranslations.permissions.help }}
      p.control
        button.button.is-info(@click="toggleAdvancedSettings") {{ show_advanced_settings ? formTranslations.advanced_settings_button.hide : formTranslations.advanced_settings_button.show }}
        button.button.is-success.is-pulled-right(@click="addCommand" :disabled="$v.$invalid || saving") {{ formTranslations.submit.value }}
      .box
        h1 {{ exampleWindowTranslations.title }}
        br
        p
          span(style="color: blue;font-weight: bold") SomeoneElse: 
            span(style="color: black; font-weight: 400") &excl;{{form.command}}
        p
          span(style="color: red; font-weight: bold") Himmeet: 
            span(style="color: black; font-weight: 400") {{rendered_command_text}}
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'
import { ipcRenderer } from 'electron'

export default {
  name: 'new-component',
  data () {
    return {
      saving: false,
      command_available: true,
      show_advanced_settings: false,
      selected_permission_in_selectbox: undefined,
      rendered_command_text: '',
      form: {
        enabled: true,
        command: '',
        text: '',
        cooldown: 5,
        permissions: [{
          id: 1,
          name: 'Normal Users',
          selected: true
        },
        {
          id: 2,
          name: 'Moderators',
          selected: true
        },
        {
          id: 3,
          name: 'Subscribers',
          selected: true
        }],
        auto_repeat: false,
        repeat: {
          minutes: 5,
          lines: 10
        }
      }
    }
  },
  mounted () {
    this.checkCommandAvailability()
  },
  computed: {
    formTranslations () {
      return {
        command: {
          placeholder: 'Komut adını girin.',
          label: 'Komut',
          validations: {
            available: 'Bu komut kullanılabilir.',
            duplicated: 'Bu komut adını kullanamazsınız. Daha önce oluşturulmuş.',
            required: 'Bu alanı doldurmak zorunlu.',
            minLength: 'Minimum 3 karakter giriniz.'
          }
        },
        text: {
          label: 'Metin',
          placeholder: 'Verilecek cevabı girin.',
          validations: {
            required: 'Bu alanı doldurmak zorunlu.',
            minLength: 'Minimum 3 karakter giriniz.'
          }
        },
        cooldown: {
          label: 'Yeniden kullanım süresi',
          help: 'Komutu yeniden kullanmak için üstünden geçmesi gereken süreyi dakika cinsinden belirtiniz.'
        },
        permissions: {
          label: 'Kullanım izinleri',
          help: 'Bu komutu kimlerin kullanabileceğini seçin.',
          add_button: 'Ekle'
        },
        repeat: {
          minutes: {
            label: 'Dakika',
            help: 'Komutun kaç dakikada bir otomatik çalışacağını girin.'
          },
          lines: {
            label: 'Satır sayısı',
            help: 'Komutun kaç satırda bir otomatik çalışacağını girin.'
          }
        },
        submit: {
          value: 'Kaydet'
        },
        advanced_settings_button: {
          show: 'Gelişmiş ayarları göster',
          hide: 'Gelişmiş ayarları gizle'
        }
      }
    },
    exampleWindowTranslations () {
      return {
        title: 'Komutun Örnek Kullanımı'
      }
    },
    selectedPermissions () {
      return this.form.permissions.filter(userGroup => {
        return userGroup.selected
      })
    },
    unselectedPermissions () {
      return this.form.permissions.filter(userGroup => !userGroup.selected)
    }
  },
  methods: {
    ...mapActions({
      addCommandAction: 'addCommand'
    }),
    addCommand () {
      // TODO: do saving process
      this.saving = true
      if (!this.$v.$invalid) {
        this.addCommandAction(this.form)
        this.$notify.success({content: 'Kaydedildi!'})
        this.$router.push({ name: 'commands' })
      }
      this.saving = false
    },
    commandTextChanged () {
      this.$v.form.text.$touch()
      this.rendered_command_text = ipcRenderer.sendSync('render_command_text', this.form, { 'display-name': 'SomeoneElse' }, { sandbox: true })
    },
    checkCommandAvailability () {
      this.$v.form.command.$touch()
      // TODO: do some checks for availability
      this.command_available = true
    },
    toggleAdvancedSettings () {
      this.show_advanced_settings = !this.show_advanced_settings
    },
    updateCooldown (num) {
      if (num > 0 && num < 1440) {
        this.form.cooldown = num
      }
    },
    updateRepeatMinutes (num) {
      if (num > 0 && num < 1440) {
        this.form.repeat.minutes = num
      }
    },
    updateRepeatLines (num) {
      if (num > 0 && num < 9999) {
        this.form.repeat.lines = num
      }
    },
    removePermission (id) {
      this.form.permissions.forEach(function (userGroup) {
        if (userGroup.id === id) {
          userGroup.selected = false
        }
      })
    },
    addPermission () {
      if (this.selected_permission_in_selectbox) {
        let selectIdx
        this.form.permissions.forEach((perm, index) => {
          if (perm.id === this.selected_permission_in_selectbox.id) {
            selectIdx = index
          }
        })
        if (selectIdx !== undefined) {
          this.form.permissions[selectIdx].selected = true
        }
      }
    }
  },
  validations: {
    form: {
      command: { required, minLength: minLength(3) },
      text: { required, minLength: minLength(3) }
    }
  }
}
</script>


<style lang="sass" scoped>
label
  color: #fafafa

.button-success
  background-color: #4BB543
  border-color: #4BB543
  color: #fff
  &:hover
    background-color: #3ca235
    border-color: #3ca235
    color: #fff
</style>
