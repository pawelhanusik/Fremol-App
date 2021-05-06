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
          {{ title }}
        </q-toolbar-title>

        <q-btn
          v-if="showRightDrawerOpenButton"
          flat
          dense
          round
          icon="info"
          aria-label="Menu"
          @click="rightDrawerOpen = !rightDrawerOpen"
        />
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
        <div v-for="(link, key) in routeLinks" :key="key">
          <route-link
            v-if="link.requiresAuth === false || isUserLoggedIn()"
            v-bind="link"
          />
        </div>
      </q-list>

      <!-- CHATS -->
      <q-list v-if="isUserLoggedIn()">
        <q-item-label
          header
          class="text-grey-8"
        >
          Conversations
        </q-item-label>
        <route-link
          :key="newConversationLink.title"
          v-bind="newConversationLink"
        />
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
    
    <q-drawer
        v-if="showRightDrawerOpenButton"
        side="right"
        v-model="rightDrawerOpen"
        bordered
        :width="400"
        :breakpoint="50"
        overlay
        content-class="bg-grey-1"
      >
        <right-drawer />
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
import RightDrawer from 'src/components/RightDrawer.vue'

const routeLinksData = [
  {
    title: 'Home',
    icon: 'home',
    link: '/',
    requiresAuth: false
  },
  {
    title: 'Profile',
    icon: 'person',
    link: '/profile',
    requiresAuth: true
  },
  {
    title: 'Settings',
    icon: 'settings',
    link: '/settings',
    requiresAuth: false
  },
  {
    title: 'Logout',
    icon: 'logout',
    link: '/logout',
    requiresAuth: true
  }
];
const linksData = [
];

export default {
  name: 'MainLayout',
  components: {
    RouteLink,
    ConversationLink,
    ExternalLink,
    RightDrawer
  },
  computed: {
    conversations() {
      return this.$store.getters['conversations/conversationAsLinks']
    },
    title() {
      if (
        this.$route.name === 'conversations'
        && this.$route.params.conversationID
      ) {
        let conversation = this.$store.getters['conversations/conversationByID'](this.$route.params.conversationID)
        if (conversation) {
          return conversation.name
        }
      }
      return 'Fremol'
    },
    showRightDrawerOpenButton() {
      return (this.$route.name === 'conversations')
    }
  },
  data () {
    return {
      leftDrawerOpen: false,
      rightDrawerOpen: false,
      routeLinks: routeLinksData,
      externalLinks: linksData,
      newConversationLink: {
        id: 0,
        title: 'new conversation',
        icon: 'add',
        link: '/newConversation'
      }
    }
  },
  methods: {
    isUserLoggedIn() {
      if ( typeof(this.$store) !== 'undefined' && this.$store !== null && this.$store.getters['server/isConnected']) {
        return this.$store.getters['user/isLoggedIn']
      }
      return false
    }
  }
}
</script>
