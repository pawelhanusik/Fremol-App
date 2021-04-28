<template>
  <div :style="'background-color: ' + primaryColor" class="fullscreen text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        404
      </div>

      <div class="text-h2" style="opacity:.4">
        Oops. Nothing here...
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="green"
        unelevated
        to="/"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error404',
  data() {
    return {
      primaryColor: this.$store.getters['theme/primaryColor'],
      secondaryColor: this.$store.getters['theme/secondaryColor']
    }
  }
}
</script>
