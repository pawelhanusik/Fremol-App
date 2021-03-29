<template>
  <div class="q-pa-md">
    <q-form @submit="submit" class="q-gutter-md">
      
      <div v-for="(item, index) in items" :key="index">
        <q-checkbox
          v-if="item.type == 'checkbox'"

          :name="item.name"
          v-model="values[index]"
          :label="item.label"
        />
        <div v-else-if="item.type == 'file'">
          <q-file 
            v-if="!item.depentsOn || values[item.depentsOn]"

            :name="item.name"
            v-model="values[index]"
            :label="item.label"
            hidden
          >
            <template v-slot:prepend>
              <q-icon name="cloud_upload" />
            </template>
          </q-file>
        </div>
        <q-color
          v-else-if="item.type == 'color'"

          :name="item.name"
          v-model="values[index]"
          :aria-label="item.label"
        />
        <q-input
          v-else

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
      </div>
      
      <q-btn :label="submitLabel" type="submit" color="primary"/>
      
    </q-form>
  </div>
</template>

<script>
let unsubscibe = null;
export default {
  created() {
    if (this.formPurpose == 'appSettings') {
      this.values = [
        this.$store.getters['server/host'],
        this.$store.getters['server/apiPort'],
        this.$store.getters['server/wsPort'],
        this.$store.getters['server/useHttps'],
      ]
    } else if (this.formPurpose == 'custom') {
      this.values = this.initValues
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
    initValues: {
      type: Array
    },
    submit: Function
  }
}
</script>
