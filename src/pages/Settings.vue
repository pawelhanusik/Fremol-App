<template>
  <q-page>
    
    <div class="flex flex-center">
      <q-card>
        <q-card-section>
          <h3> Settings </h3>
        </q-card-section>
        <q-card-section>
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
        <q-card-section>
          <q-btn color="red" to="/deleteAccount">
            Delete account
          </q-btn>
        </q-card-section>
      </q-card>
    </div>
    
  </q-page>
</template>

<script>
import NativeForm from 'src/components/NativeForm.vue'
export default {
  components: { NativeForm },
  name: 'Settings',
  
  methods: {
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
    }
  }
}
</script>
