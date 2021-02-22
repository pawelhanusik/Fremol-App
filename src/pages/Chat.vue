<template>
  <q-page>
    
    <div class="q-m-lg">
      <div class="flex flex-center">
        <h1>Chat {{ $route.params.chatID }}</h1>
      </div>

      <div class="full-width row wrap justify-start items-start content-start">
        <input class="col-grow" type='text'>
        <button>SEND</button>
      </div>
    </div>
    
  </q-page>
</template>

<script>
export default {
  name: 'PageChat',
  
  
}
</script>
