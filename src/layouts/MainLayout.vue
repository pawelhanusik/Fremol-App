<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Fremol
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <!-- LINKS -->
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Fremol
        </q-item-label>
        <route-link
          v-for="link in routeLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>

      <!-- CHATS -->
      <q-list v-if="conversations.length > 0">
        <q-item-label
          header
          class="text-grey-8"
        >
          Conversations
        </q-item-label>
        <conversation-link
          v-for="conversation in conversations"
          :key="conversation.title"
          :conversationID="conversation.id"
          v-bind="conversation"
        />
      </q-list>

      <!-- EXTERNAL LINKS -->
      <!--<q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          External Links
        </q-item-label>
        <external-link
          v-for="link in externalLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>-->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import RouteLink from 'components/RouteLink.vue';
import ConversationLink from 'components/ConversationLink.vue';
import ExternalLink from 'src/components/ExternalLink.vue';

const routeLinksData = [
  {
    title: 'Home',
    icon: 'home',
    link: '/'
  },
  {
    title: 'Settings',
    icon: 'settings',
    link: '/settings'
  },
  {
    title: 'Logout',
    icon: 'logout',
    link: '/logout'
  }
];
const linksData = [
];

let unsubscibe = null
export default {
  name: 'MainLayout',
  components: {
    RouteLink,
    ConversationLink,
    ExternalLink
  },
  beforeMount() {
    // set axios & laravel echo connection
    this.$store.dispatch('server/setAxiosBaseURL')
    this.$store.dispatch('server/setEchoHostOptions')
    // check connection to server
    this.$store.dispatch('server/checkApiConnection')
    // fetch user data & conversations
    this.$store.dispatch('user/fetchUserData')
    this.$store.dispatch('conversations/fetchConversations')
  },
  created() {
    unsubscibe = this.$store.subscribe((mutation, state) => {
      // update axios & laravel echo connection
      if (
        mutation.type == 'server/SET_HOST'
        || mutation.type == 'server/SET_APIPORT'
        || mutation.type == 'server/SET_WSPORT'
      ) {
        this.$store.dispatch('server/setAxiosBaseURL')
        this.$store.dispatch('server/setEchoHostOptions')
      }
      
      // redirect on server connected/disconnected
      else if (
        mutation.type == 'server/SET_ISCONNECTED'
      ) {
        if (mutation.payload === true) {
          this.$router.push('/')
        } else {
          this.$router.push('/settings')
          this.$q.notify('Cannot connect. Check server settings')
        }
      }
    })
  },
  destroyed() {
    if (unsubscibe !== null) {
      unsubscibe()
    }
  },
  computed: {
    conversations() {
      console.log(this)
      return this.$store.getters['conversations/conversationAsLinks']
    }
  },
  data () {
    return {
      leftDrawerOpen: false,
      routeLinks: routeLinksData,
      externalLinks: linksData
    }
  }
}
</script>
