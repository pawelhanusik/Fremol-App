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
        filled
      />
      
      <q-btn :label="submitLabel" type="submit" color="primary"/>
      
    </q-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      values: this.initialValues,
      submitResult: []
    }
  },
  props: {
    items: Array,
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
