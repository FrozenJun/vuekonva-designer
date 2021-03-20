<template>
  <!-- 注意，为简单右键菜单根据父节点定位，如果当前页不再是全屏，需要将右键菜单根据body定位 -->
  <div class="bs-2d-context-menu" ref="menu">
    <ul class="bs-2d-context-menu__menu-list">
      <li
        v-for="(menu, index) in CONTEXT_MENU"
        :key="index"
        :class="[
          'bs-2d-context-menu__menu-item',
          menu.showLine && 'is-show-line',
          menu.disabled && 'is-disabled'
        ]"
        @click.stop="onMenuClick(menu)"
      >
        <i :class="['left-icon', menu.icon]"></i>
        <p class="text">{{ menu.text }}</p>
        <p v-if="menu.key" class="key">{{ menu.key }}</p>
        <i v-if="menu.children" class="el-icon-caret-right key"></i>
        <div
          v-if="menu.children"
          class="bs-2d-context-menu__child-context-menu"
        >
          <ul class="bs-2d-context-menu__menu-list">
            <li
              v-for="(item, no) in menu.children"
              :key="no"
              :class="[
                'bs-2d-context-menu__menu-item small',
                item.showLine && 'is-show-line',
                item.disabled && 'is-disabled'
              ]"
              @click.stop="onMenuClick(item)"
            >
              <i :class="['left-icon', item.icon]"></i>
              <p class="text">{{ item.text }}</p>
              <p v-if="item.key" class="key">{{ item.key }}</p>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { BsContextMenuConfig } from './context-menu.config';

@Component({})
export default class BsContextMenu extends Mixins(BsContextMenuConfig) {}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@include b(bs-2d-context-menu) {
  position: absolute;
  pointer-events: auto;
  display: none;
  overflow: visible;
  width: 130px;

  @include e(menu-list) {
    position: relative;
    width: 100%;
    padding: 5px 0;
    box-shadow: rgba(0, 0, 0, 0.12) 0px 2px 10px;
    background: #fff;
    outline: none;
    @include layout(column);

    @include e(menu-item) {
      position: relative;
      width: 100%;
      padding: 0 10px 0 5px;
      height: 30px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      cursor: pointer;
      transition: color 0.3s, background 0.3s;
      @include layout();
      @include layout-align(center, center);
      &:hover {
        color: rgb(16, 142, 233);
        background: rgba(16, 142, 233, 0.1);
        .bs-2d-context-menu__child-context-menu {
          display: block;
        }
      }
      &.small {
        font-size: 12px;
      }
      @include when(disabled) {
        color: #ccc;
        cursor: not-allowed;
        background: #fff;
        &:hover {
          .bs-2d-context-menu__child-context-menu {
            display: none;
          }
        }
      }
      @include when(show-line) {
        height: 31px;
        border-bottom: 1px solid #ddd;
      }

      .left-icon {
        flex-shrink: 0;
      }
      .text {
        margin-left: 10px;
        flex: 1;
      }
      .key {
        flex-shrink: 0;
      }

      @include e(child-context-menu) {
        display: none;
        position: absolute;
        left: 100%;
        bottom: -5px;
        overflow: visible;
        width: 130px;
      }
    }
  }
}
</style>
