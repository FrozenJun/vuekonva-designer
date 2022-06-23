<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class App extends Vue {}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

#app {
  width: 100%;
  height: 100%;
}
</style>
