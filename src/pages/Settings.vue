<template>
  <q-page>
    <!-- APP SETTINGS -->
    <div class="text-center text-h6 q-mt-lg">App settings</div>
    <q-form
      @submit="onAppSettingsSubmit"
      @reset="onAppSettingsReset"
      class="q-pa-lg"
    >
      <q-input v-model="host" name="host" type="text" label="server address" required />
      <q-input v-model="apiPort" name="apiPort" type="number" min=0 max=65535 label="api port" required />
      <q-input v-model="wsPort" name="wsPort" type="number" min=0 max=65535 label="websockets port" required />

      <div class="row q-mt-md">
        <q-btn class="row q-ma-sm" type="submit"> Connect </q-btn>
        <q-btn class="row q-ma-sm" type="reset"> Reset </q-btn>
        <q-btn class="row q-ma-sm" @click="onAppSettingsRestoreDefaults"> Restore defaults </q-btn>
      </div>
    </q-form>
    <!-- THEME SETTINGS -->
    <div class="text-center text-h6">Theme settings</div>
    <q-form
      @submit="onThemeSettingsSubmit"
      @reset="onThemeSettingsReset"
      class="q-pa-lg"
    >
      <q-input
        name="theme_primary"
        label="primary color"
        v-model="theme_primary"
      >
        <template v-slot:prepend>
          <q-icon :name="themeColorSquarePrimary" />
        </template>
        <template v-slot:append>
          <q-icon name="colorize" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-color v-model="theme_primary" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input
        name="theme_secondary"
        label="secondary color"
        v-model="theme_secondary"
      >
        <template v-slot:prepend>
          <q-icon :name="themeColorSquareSecondary" />
        </template>
        <template v-slot:append>
          <q-icon name="colorize" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-color v-model="theme_secondary" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <div class="row q-mt-sm">
        <q-btn class="row q-ma-sm" type="submit"> Change </q-btn>
        <q-btn class="row q-ma-sm" type="reset"> Reset </q-btn>
        <q-btn class="row q-ma-sm" @click="onThemeSettingsRestoreDefaults"> Restore defaults </q-btn>
      </div>
    </q-form>
  </q-page>
</template>

<script>
export default {
  name: 'Settings',
  data() {
    return {
      // app settings
      host: this.$store.getters['server/host'],
      apiPort: this.$store.getters['server/apiPort'],
      wsPort: this.$store.getters['server/wsPort'],
      // theme settings
      theme_primary: this.$store.getters['theme/primaryColor'],
      theme_secondary: this.$store.getters['theme/secondaryColor']
    }
  },
  computed: {
    themeColorSquarePrimary() {
      return `M0 0h24v24H0V0z@@fill:${this.theme_primary};stroke:${this.theme_primary}`
    },
    themeColorSquareSecondary() {
      return `M0 0h24v24H0V0z@@fill:${this.theme_secondary};stroke:${this.theme_secondary}`
    }
  },
  methods: {
    onAppSettingsSubmit: function(evt) {
      const formData = new FormData(evt.target)
      if(
        !formData.has('host')
        || !formData.has('apiPort')
        || !formData.has('wsPort')
      ) {
        this.$q.notify('Please fill in all fields')
        return
      }

      const serverData = {
        host: formData.get('host'),
        apiPort: formData.get('apiPort'),
        wsPort: formData.get('wsPort')
      }
      
      this.$store.dispatch('server/connect', serverData)
    },
    onAppSettingsReset() {
      this.host = this.$store.getters['server/host']
      this.apiPort = this.$store.getters['server/apiPort']
      this.wsPort = this.$store.getters['server/wsPort']
    },
    onAppSettingsRestoreDefaults() {
      this.$store.dispatch('server/restoreDefaults')
      this.onAppSettingsReset()
    },

    onThemeSettingsSubmit(evt) {
      const formData = new FormData(evt.target)
      const themeData = {
        primaryColor: formData.get('theme_primary') || null,
        secondaryColor: formData.get('theme_secondary') || null,
      }
      this.$store.dispatch('theme/changeTheme', themeData)
    },
    onThemeSettingsReset() {
      this.theme_primary = this.$store.getters['theme/primaryColor'],
      this.theme_secondary = this.$store.getters['theme/secondaryColor']
    },
    onThemeSettingsRestoreDefaults() {
      this.$store.dispatch('theme/restoreDefaults')
    }
  }
}
</script>
