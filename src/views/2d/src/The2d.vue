<template>
  <div class="the-2d">
    <!-- 返回按钮 -->
    <bs-top></bs-top>

    <!-- 横向操作栏 -->
    <bs-header ref="header"></bs-header>

    <div class="the-2d__main">
      <!-- 左侧操作栏 -->
      <bs-elements></bs-elements>

      <!-- 画布 -->
      <bs-canvas :loading="loading"></bs-canvas>

      <!-- 右侧操作栏 -->
      <bs-binds></bs-binds>
    </div>

    <!-- 右键菜单 -->
    <bs-context-menu :headerRef="$refs.header"></bs-context-menu>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { The2dConfig } from './The2d.config';
import BsTop from './components/top/top.vue';
import BsHeader from './components/header/header.vue';
import BsElements from './components/elements/elements.vue';
import BsCanvas from './components/canvas/canvas.vue';
import BsBinds from './components/binds/binds.vue';
import BsContextMenu from './components/context-menu/context-menu.vue';

@Component({
  components: {
    BsContextMenu,
    BsBinds, // <bs-binds>
    BsCanvas, // <bs-canvas>
    BsElements, // <bs-elements>
    BsHeader, // <bs-header>
    BsTop // <bs-top>
  }
})
export default class The2d extends Mixins(The2dConfig) {}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@include b(the-2d) {
  position: relative;
  width: 100%;
  min-width: 1200px;
  height: 100%;
  overflow: auto;
  @include layout(column);
  @include layout-wrap(nowrap);

  @include e(main) {
    flex: 1;
    width: 100%;
    height: 100%;
    @include layout();
    @include layout-wrap(nowrap);
  }
}
</style>
