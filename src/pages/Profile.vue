<template>
  <q-page>
    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="col q-ml-md q-ma-lg"
    >
      <div class="row">
        <q-file
          @input="onNewAvatarSelected"
          @rejected="onNewAvatarRejected"
          ref="avatar_picker"
          class="hidden"
          accept="image/png,image/jpeg"
          max-file-size=2097152
        />
        <q-avatar
          @mouseenter="setMouseOverAvatar(true)"
          @mouseleave="setMouseOverAvatar(false)"
          size="100px"
          class="q-ma-md"
        >
          <q-img
            :src="avatar_url"
            @error="onAvatarError"
            ratio="1"
          >
            <transition
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
            >
              <div
                v-if="isMouseOverAvatar"
                
                @click="onChangeAvatarClick"
                class="absolute-full text-subtitle1 flex flex-center"
                style="cursor: pointer"
              >
                Change
              </div>
            </transition>
            <transition
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
            >
              <div
                v-if="!avatar_url && !isMouseOverAvatar"
                
                @click="onChangeAvatarClick"
                class="absolute-full text-subtitle1 flex flex-center"
                style="cursor: pointer"
              >
                Avatar
              </div>
            </transition>
            
          </q-img>
        </q-avatar>
        <q-input class="col-grow q-ma-md" label="name" name="name" v-model="name"/>
      </div>
      <q-input class="col-grow q-ma-md" type="email" label="email" name="email" v-model="email"/>
      
      <transition
        enter-active-class="animated fadeInDown"
        leave-active-class="animated fadeOutRight"
      >
        <div v-if="showChangePasswordFields">
          <q-input class="col-grow q-ma-md" type="password" label="new password" name="password" v-model="password" />
          <q-input class="col-grow q-ma-md" type="password" label="repeat new password" name="password2" v-model="password2" />
        </div>
      </transition>
      <q-input class="col-grow q-ma-md" type="password" label="current password" name="oldPassword" v-model="oldPassword" required />


      <q-btn color="green" type="submit" class="col-grow q-ma-md"> Submit </q-btn>
      <q-btn type="reset" class="col-grow q-ma-md"> Reset </q-btn>
      <q-btn @click="onChangePasswordClick" class="col-grow q-ma-md">
        <div v-if="showChangePasswordFields"> Cancel </div>
        <div v-else> Change password </div>
      </q-btn>
      <q-btn color="red" to="/deleteAccount" class="col-grow q-ma-md"> Delete account </q-btn>
    </q-form>
  </q-page>
</template>
<script>
async function fileObjectToImgBlob(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function(e)  {
      resolve(e.target.result)
    }
    reader.readAsDataURL(file);
  })
}
export default {
  name: 'Profile',
  data() {
    return {
      email: this.$store.getters['user/email'],
      name: this.$store.getters['user/name'],
      avatar_url: this.$store.getters['user/avatar_url'],
      avatar: null,
      password: '',
      password2: '',
      oldPassword: '',
      // ------------
      showChangePasswordFields: false,
      isMouseOverAvatar: false
    }
  },
  methods: {
    onChangePasswordClick() {
      this.showChangePasswordFields = !this.showChangePasswordFields
    },
    setMouseOverAvatar(b) {
      this.isMouseOverAvatar = b
    },
    onAvatarError(evt) {
      this.avatar_url = ""
    },
    onChangeAvatarClick() {
      const avatarPicker = this.$refs['avatar_picker']
      avatarPicker.pickFiles()
    },
    onNewAvatarSelected(evt) {
      fileObjectToImgBlob(evt).then((imageBlob) => {
        this.avatar_url = imageBlob
        this.avatar = evt
      })
    },
    onNewAvatarRejected(evt) {
      let errorMsg = ""
      for (let err of evt) {
        if (err.failedPropValidation) {
          switch (err.failedPropValidation) {
          case 'accept':
            errorMsg += "Selected file must be an image" + "\n"
            break
          case 'max-file-size':
            errorMsg += "Selected image should be smaller than 2MB" + "\n"
            break
          }
        }
      }
      if (errorMsg.length > 0) {
        this.$q.notify(errorMsg)
      }
    },

    onSubmit(evt) {
      const formData = new FormData(evt.target)
      if(
        !formData.has('email')
        || !formData.has('name')
        || !formData.has('oldPassword')
      ) {
        this.$q.notify('Please fill in all fields')
        return
      }

      if (this.avatar !== null) {
        formData.append('avatar', this.avatar);
      }

      if (
        (formData.has('password') && formData.get('password').length > 0)
        || (formData.has('password2') && formData.get('password2').length > 0)
      ) {
        if (
          !formData.has('password')
          || !formData.has('password2')
        ) {
          this.$q.notify('Please fill in all f2ields')
          return
        }
        if (formData.get('password') !== dormData.get('password2')) {
          this.$q.notify('New passwords doesn\'t match!')
          return
        }
      }

      console.log("SENDING FORM DATA", formData)
      this.$store.dispatch('user/updateSettings', formData)
    },
    onReset() {
      this.name = this.$store.getters['user/name']
      this.email = this.$store.getters['user/email']
      this.avatar_url = this.$store.getters['user/avatar_url']
      this.avatar = null
      this.password = ''
      this.password2 = ''
      this.oldPassword = ''
    }
  }
}
</script>
