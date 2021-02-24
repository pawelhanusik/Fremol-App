<template>
  <div class="q-pa-md">
    <q-form @submit="submit" class="q-gutter-md">
      
      <q-input
        v-for="(item, index) in items"

        :key="index"
        :name="item.name"
        :type="item.type"
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
  },
  destroyed() {
    unsubscibe()
  },

  data () {
    return {
      values: this.initialValues,
      submitResult: []
    }
  },
  props: {
    items: Array[{}],
    submitLabel: {
      type: String,
      default: 'Submit'
    },
    initialValues: {
      type: Array,
      default: function() {
        return []
      }
    },
    submit: Function
  }
}
</script>
