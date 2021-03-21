<template>
  <q-page>
    
    <div class="flex flex-center">
      <q-card>
        <q-card-section>
          <h3> Settings </h3>
        </q-card-section>
        <q-card v-if="isSectionVisible(0)">
          <q-card-actions>
            <q-btn @click="onRollBtnClick(0)" size="sm" color="primary" padding="none" :icon="getRollBtnIcon(0)" class="q-mr-sm" />
            <div class="text-h6">App settings</div>
          </q-card-actions>
          <q-card-section v-if="!isSectionRolledUp(0)">
            <native-form
              submitLabel="Connect"
              formPurpose="appSettings"
              :submit="submitAppSettingsForm"
              :items="[
                {
                  name: 'host',
                  type: 'text',
                  label: 'server address',
                  required: true
                },
                {
                  name: 'apiPort',
                  type: 'number',
                  min: 0,
                  max: 65535,
                  label: 'api port',
                  required: true
                },
                {
                  name: 'wsPort',
                  type: 'number',
                  min: 0,
                  max: 65535,
                  label: 'websockets port',
                  required: true
                },
                {
                  name: 'useHttps',
                  type: 'checkbox',
                  label: 'use https'
                },
                /*{
                  name: 'cert',
                  type: 'file',
                  label: 'Select certificate file',
                  depentsOn: 3
                }*/
              ]"
            />
          </q-card-section>
        </q-card>
        <q-card v-if="isSectionVisible(1)">
          <q-card-actions>
            <q-btn @click="onRollBtnClick(1)" size="sm" color="primary" padding="none" :icon="getRollBtnIcon(1)" class="q-mr-sm" />
            <div class="text-h6">User settigns</div>
          </q-card-actions>
          <q-card-section v-if="!isSectionRolledUp(1)">
            <native-form
              formPurpose="settings"
              submitLabel="Update"
              :submit="submitSettingsForm"
              :items="[
                {
                  name: 'email',
                  type: 'text',
                  label: 'email',
                  required: true
                },
                {
                  name: 'name',
                  type: 'text',
                  label: 'name',
                  required: true
                },
                {
                  name: 'password',
                  type: 'password',
                  label: 'new password'
                },
                {
                  name: 'password2',
                  type: 'password',
                  label: 'repeat new password'
                },
                {
                  name: 'oldPassword',
                  type: 'password',
                  label: 'current password',
                  required: true
                }
              ]"
            />
          </q-card-section>
          <q-card-section v-if="!isSectionRolledUp(1)">
            <q-btn color="red" to="/deleteAccount">
              Delete account
            </q-btn>
          </q-card-section>
        </q-card>
        <q-card v-if="isSectionVisible(2)">
          <q-card-actions>
            <q-btn @click="onRollBtnClick(2)" size="sm" color="primary" padding="none" :icon="getRollBtnIcon(2)" class="q-mr-sm" />
            <div class="text-h6">Theme settings</div>
          </q-card-actions>
          <q-card-section v-if="!isSectionRolledUp(2)">
            <q-btn
              label="Restore defaults"
              @click="themeSettingsRestoreDefaults"
            />
            <native-form
              formPurpose="custom"
              submitLabel="Change"
              :submit="submitThemeSettingsForm"
              :initValues="[
                getBrand('primary'),
                getBrand('secondary')
              ]"
              :items="[
                {
                  name: 'primary',
                  type: 'color',
                  label: 'primary color',
                  required: true
                },
                {
                  name: 'secondary',
                  type: 'color',
                  label: 'secondary color',
                  required: true
                },
              ]"
            />
          </q-card-section>
          <q-card-section v-if="!isSectionRolledUp(1)">
            <q-btn color="red" to="/deleteAccount">
              Delete account
            </q-btn>
          </q-card-section>
        </q-card>

      </q-card>
    </div>
    
  </q-page>
</template>

<script>
import NativeForm from 'src/components/NativeForm.vue'

export default {
  components: { NativeForm },
  name: 'Settings',
  data() {
    return {
      sections: [
        {
          rolled: false,
          visible: true
        },
        {
          rolled: false,
          visible: this.$store.getters['user/isLoggedIn']
        },
        {
          rolled: false,
          visible: true
        }
      ]
    }
  },
  methods: {
    submitAppSettingsForm: function(evt) {
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
        useHttps: formData.get('useHttps') || false,
        apiPort: formData.get('apiPort'),
        wsPort: formData.get('wsPort'),
        cert: formData.get('cert') || null
      }
      
      this.$store.dispatch('server/connect', serverData)
    },
    submitSettingsForm: function(evt) {
      const formData = new FormData(evt.target)
      if(
        !formData.has('email')
        || !formData.has('name')
        || !formData.has('password')
        || !formData.has('password2')
        || !formData.has('oldPassword')
      ) {
        this.$q.notify('Please fill in all fields')
        return
      }

      const updatedUserData = {
        email: formData.get('email'),
        name: formData.get('name'),
        password: formData.get('password'),
        password2: formData.get('password2'),
        oldPassword: formData.get('oldPassword')
      }

      if (updatedUserData.password !== updatedUserData.password2) {
        this.$q.notify('New passwords doesn\'t match!')
        return
      }

      this.$store.dispatch('user/updateSettings', updatedUserData)
    },
    submitThemeSettingsForm(evt) {
      const formData = new FormData(evt.target)
      const themeData = {
        primaryColor: formData.get('primary') || null,
        secondaryColor: formData.get('secondary') || null,
      }
      this.$store.dispatch('theme/changeTheme', themeData)
    },
    themeSettingsRestoreDefaults() {
      this.$store.dispatch('theme/restoreDefaults')
    },
    getRollBtnIcon(sectionID) {
      return (this.sections[sectionID].rolled) ? 'keyboard_arrow_right' : 'keyboard_arrow_down'
    },
    isSectionVisible(sectionID) {
      return this.sections[sectionID].visible
    },
    isSectionRolledUp(sectionID) {
      return this.sections[sectionID].rolled
    },
    onRollBtnClick(sectionID) {
      this.sections[sectionID].rolled = !this.sections[sectionID].rolled
    },
    getBrand(s) {
      if (s == 'primary') {
        return this.$store.getters['theme/primaryColor']
      }
      if (s == 'secondary') {
        return this.$store.getters['theme/secondaryColor']
      }
      return '';
    }
  }
}
</script>
