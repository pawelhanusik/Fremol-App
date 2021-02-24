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
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Chats
        </q-item-label>
        <conversation-link
          v-for="conversation in conversations"
          :key="conversation.title"
          :conversationID="conversation.id"
          v-bind="conversation"
        />
      </q-list>

      <!-- EXTERNAL LINKS -->
      <q-list>
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
      </q-list>
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
  {
    title: 'Homepage',
    caption: 'Homepage of Fremol',
    icon: 'favorite',
    link: 'http://fremol.pawel.hanusik.pl'
  }
];

export default {
  name: 'MainLayout',
  components: {
    RouteLink,
    ConversationLink,
    ExternalLink
  },
  created() {
    this.$store.dispatch('user/fetchUserData')
    this.$store.dispatch('conversations/fetchConversations')
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
