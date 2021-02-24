<template>
  <div>
    <q-layout container style="height: calc(100vh - 150px);" class="shadow-2 rounded-borders row row-grow">
      <q-page-container>
        <q-page padding>
          <div class="q-pa-md col items-start q-gutter-md">
            <q-card v-for="(msg, msgID) in messages" :key="msgID" v-bind="msg" class="q-pa-md">
              <q-card-section horizontal>
                  {{ msg.user_id }}
              </q-card-section>
              <q-card-section horizontal>
                {{ msg.text }}
              </q-card-section>
            </q-card>
          </div>

          <q-page-scroller reverse position="bottom-right" :scroll-offset="10" :offset="[18, 18]">
            <q-btn fab icon="keyboard_arrow_down" color="secondary" />
          </q-page-scroller>
        </q-page>
      </q-page-container>
    </q-layout>
    <div class="row q-mt-md">
      <q-input class="q-pb-md q-pl-md q-pr-md col-grow" v-model="test" outlined type="text">
        <template v-slot:append>
          <q-btn icon="keyboard_arrow_right" color="secondary" />
        </template>
      </q-input>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageChat',
  data() {
    return {
      test: ''
    }
  },
  beforeCreate() {
    this.$store.dispatch('conversations/fetchMessages', this.$route.params.conversationID)
  },
  beforeUpdate() {
    this.$store.dispatch('conversations/fetchMessages', this.$route.params.conversationID)
  },
  computed: {
    messages() {
      return this.$store.getters['conversations/conversationMessages'](this.$route.params.conversationID)
    }
  }
}
</script>
