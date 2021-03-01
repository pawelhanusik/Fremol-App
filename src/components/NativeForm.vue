<template>
  <div class="q-pa-md">
    <q-form @submit="submit" class="q-gutter-md">
      
      <q-input
        v-for="(item, index) in items"

        :key="index"
        :name="item.name"
        :type="item.type"
        :min="item.min"
        :max="item.max"
        v-model="values[index]"
        color="primary"
        :label="item.label"
        :required="item.required ? true : false"
        filled
      />
      
      <q-btn :label="submitLabel" type="submit" color="primary"/>
      
    </q-form>
  </div>
</template>

<script>
let unsubscibe = null;
export default {
  created() {
    if (this.formPurpose == 'settings') {
      this.values = [
        this.$store.getters['user/email'],
        this.$store.getters['user/name']
      ]

      unsubscibe = this.$store.subscribe((mutation, state) => {
        if (
          mutation.type == 'user/SET_ISFETCHING'
          && !mutation.payload
        ) {
          this.values = [
            this.$store.getters['user/email'],
            this.$store.getters['user/name']
          ]
        }
      })
    } else if (this.formPurpose == 'appSettings') {
      this.values = [
        this.$store.getters['server/host'],
        this.$store.getters['server/apiPort'],
        this.$store.getters['server/wsPort']
      ]
    }
  },
  destroyed() {
    if (unsubscibe !== null) {
      unsubscibe()
    }
  },

  data () {
    return {
      values: [],
      submitResult: []
    }
  },
  props: {
    items: Array[{}],
    submitLabel: {
      type: String,
      default: 'Submit'
    },
    formPurpose: {
      type: String,
      default: 'unknown'
    },
    submit: Function
  }
}
</script>
