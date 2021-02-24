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
        <RouteLink
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
        <ChatLink
          v-for="chat in conversations"
          :key="chat.title"
          :chatId="chat.chatId"
          v-bind="chat"
        />
      </q-list>

      <!-- EXTERNAL LINKS -->
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Essential Links
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
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
import EssentialLink from 'components/EssentialLink.vue';
import RouteLink from 'components/RouteLink.vue';
import ChatLink from 'components/ChatLink.vue';

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
    EssentialLink,
    RouteLink,
    ChatLink
  },
  created() {
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
      essentialLinks: linksData
    }
  }
}
</script>
