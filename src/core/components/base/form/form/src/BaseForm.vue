<template>
  <el-form class="base-form" ref="CoForm" v-bind="bindConfig">
    <ValidationObserver ref="observer" tag="div" class="base-form__container">
      <base-form-item
        v-for="(formItem, index) in formItems"
        :key="index"
        :config="formItem"
        :formModel="formModel"
        :formConfig="Config"
        inner
      >
        <template v-for="(_, slot) in $scopedSlots" #[slot]="{scope}">
          <slot :name="slot" :scope="scope"></slot>
        </template>
      </base-form-item>
      <slot name="append"></slot>
    </ValidationObserver>
  </el-form>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import BaseComponentFactory from '@/core/factory/component-base.factory';
import { FormAdapter, BaseFormOutput } from './BaseForm.adapter';
import { BASE_FORM_DEFAULT_CONFIG } from './BaseForm.default';
import BaseTreeSelect from '../../tree-select/src/BaseTreeSelect.vue';
import cloneDeep from 'lodash/cloneDeep';
import defaultsDeep from 'lodash/defaultsDeep';
import omit from 'lodash/omit';
import BaseFormItem from '../../form-item';

@Component({
  name: 'CoForm',
  components: {
    BaseFormItem
  }
})
export default class BaseForm extends Mixins(BaseComponentFactory) {
  @Prop({ type: Object }) config!: FormAdapter;
  @Prop({ type: Object }) formModel!: { [name: string]: any };
  @Prop({ type: String, default: '' }) compName?: string;
  @Prop({ type: Boolean }) inner?: boolean;

  get Config(): FormAdapter {
    return defaultsDeep(this.config, BASE_FORM_DEFAULT_CONFIG);
  }
  get formItems() {
    const items = this.Config.formItems;
    const max = this.Config.max;
    return max ? items.slice(0, max) : items;
  }
  get output(): BaseFormOutput {
    return {
      reset: this.onReset.bind(this),
      validate: this.onValidate.bind(this)
    };
  }

  @Watch('formModel', { deep: true, immediate: true })
  onFormModelChange(val: { [name: string]: any }) {
    this.emitEventAndExecuteListener(
      'formModelChange',
      this.Config.on,
      val,
      this.oldFormModel,
      this.Config
    );
    this.oldFormModel = cloneDeep(val);
  }

  $refs!: {
    observer: any;
    treeSelect: BaseTreeSelect[];
  };
  originalFormModle: { [name: string]: any } = {};
  oldFormModel: { [name: string]: any } = {};

  onReset() {
    Object.assign(this.formModel, this.originalFormModle);
    // formModel可能会被添加了其它的属性
    Object.keys(
      omit(this.formModel, Object.keys(this.originalFormModle))
    ).forEach((key) => Reflect.deleteProperty(this.formModel, key));
    this.$refs.observer.reset();
    if (this.$refs.treeSelect && this.$refs.treeSelect.length) {
      this.$refs.treeSelect.forEach((i) => i.handleReset());
    }
  }
  onValidate() {
    this.$refs.observer.validate().then((res: any) => {
      this.emitEventAndExecuteListener('validated', this.Config.on, res);
    });
  }

  created() {
    this.originalFormModle = cloneDeep(this.formModel);
  }
}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';
@import './__styles__/look.scss';

@include b(base-form) {
  width: 100%;
  @include e(container) {
    width: 100%;
    @include layout();
    @include layout-align();
    @include layout-wrap();

    @include e(validation) {
      position: relative;
      @include e(item) {
        position: relative;

        @include when(error) {
          .el-input__inner {
            border-color: #eb2828;
          }
        }
      }
    }

    @include e(error) {
      display: inline;
      position: absolute;
      bottom: -12px;
      left: 10px;
      width: 100%;
      color: red;
      font-size: 0.75rem;
      line-height: 1;
      text-align: left;
    }
    @include e(tip) {
      display: inline;
      position: absolute;
      bottom: -12px;
      left: 10px;
      width: 100%;
      color: #aaa;
      font-size: 0.75rem;
      line-height: 1;
      text-align: left;
    }
  }
}
</style>
