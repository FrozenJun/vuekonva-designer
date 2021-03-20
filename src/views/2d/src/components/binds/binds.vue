<template>
  <div class="bs-2d-binds" @keydown="onKeydown">
    <co-tabs class="bs-2d-binds__tabs" :config="tabs">
      <comp-form slot="canvas" :formConfig="canvasTab"></comp-form>
      <comp-form slot="attr" :formConfig="attrTab">
        <template #fontStyle>
          <el-tooltip
            :class="[
              'bs-2d-binds__font-icon',
              (currentCell.textDecoration === item.type ||
                currentCell.fontStyle.includes(item.type)) &&
                'is-active'
            ]"
            v-for="(item, index) in FONT_STYLE_ICONS"
            :key="index"
            placement="top"
            :content="item.text"
            effect="light"
          >
            <i :class="item.icon" @click="setFontStyle(item.type)"></i>
          </el-tooltip>
        </template>
        <template #fontAlign>
          <el-tooltip
            v-for="(item, index) in FONT_ALIGN_ICONS"
            :class="[
              'bs-2d-binds__font-icon',
              (currentCell.align === item.type ||
                currentCell.verticalAlign === item.type) &&
                'is-active'
            ]"
            :key="index"
            placement="top"
            :content="item.text"
            effect="light"
          >
            <i :class="item.icon" @click="setFontAlign(item.type)"></i>
          </el-tooltip>
        </template>
      </comp-form>
      <comp-form slot="bind" :formConfig="bindTab">
        <template #warnContent>
          <p class="bs-2d-binds__warn-content">{{ warnContent }}</p>
          <p
            :class="['bs-2d-binds__warn-add', !modelId && 'is-disabled']"
            @click="addWarn"
          >
            添加告警规则
          </p>
        </template>
        <template #showText>
          <p>浮窗</p>
        </template>
        <template #warnText>
          <p class="bs-2d-binds__warn-content">告警未解决</p>
        </template>
      </comp-form>
    </co-tabs>

    <!-- 添加告警规则 -->
    <bs-warn-set :id="modelId" @success="addWarnSuccess"></bs-warn-set>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { BsBindsConfig } from './binds.config';
import BsWarnSet from '@/views/configuration/model-management/src/components/tabs/components/warn-set/warn-set.vue';

@Component({
  components: { BsWarnSet }
})
export default class BsBinds extends Mixins(BsBindsConfig) {}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@include b(bs-2d-binds) {
  width: 274px;
  flex-shrink: 0;
  height: 100%;
  background: rgba(246, 247, 251, 1);
  box-shadow: -1px 0px 0px 0px rgba(203, 211, 223, 1);

  @include e(tabs) {
    width: 100%;
    height: 100%;

    @include e(font-icon) {
      width: 20px;
      height: 20px;
      font-size: 18px;
      margin-left: 8px;
      cursor: pointer;
      border-radius: 2px;
      padding: 1px;
      @include when(active) {
        background: #3ea7ee;
        color: #fff;
      }
    }
    @include e(warn-content) {
      text-align: left;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.45);
      line-height: 1.5;
      padding-top: 9px;
    }
    @include e(warn-add) {
      text-align: left;
      height: 17px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 136, 255, 1);
      line-height: 17px;
      text-decoration: underline;
      cursor: pointer;
      @include when(disabled) {
        cursor: not-allowed;
        color: #ccc;
      }
    }

    .el-tabs__nav-scroll {
      background: #e1e5ec;
      padding-left: 10px;
    }
    .el-tabs__item.is-active {
      background: #f6f7fb;
      border-bottom: 0;
    }
    .el-tabs__content {
      width: 100%;
      height: calc(100% - 56px);
      padding: 12px 10px;
      overflow-y: auto;
    }

    .comp-form__form {
      padding: 0;
    }
    .el-form-item {
      margin-bottom: 0;
    }
  }
}
</style>
