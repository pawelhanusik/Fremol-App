<template>
  <q-item
    :to="link"
    clickable
    tag="a"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: 'ChatLink',
  computed: {
    link () {
      return `/chat/${this.id}`;
    }
  },
  props: {
    id: {
      type: Number,
      required: true
    },

    title: {
      type: String,
      required: true
    },

    icon: {
      type: String,
      default: ''
    }
  }
}
</script>
