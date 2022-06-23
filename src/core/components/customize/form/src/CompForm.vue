<template>
  <div class="comp-form" :class="Config.className">
    <h3 class="comp-form__title">{{ Config.title }}</h3>
    <base-form
      class="comp-form__form"
      :config="Config.form"
      inner
      :formModel="Config.formModel"
      @output-change="copyOutputsToTarget('formOutputs', $event)"
      @validated="handleValidated"
    >
      <template v-for="(_, slot) in $scopedSlots" #[slot]="{scope}">
        <slot :name="slot" :scope="scope"></slot>
      </template>
    </base-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Inject, Mixins } from 'vue-property-decorator';
import {
  COMPONENT_TYPE,
  CustomizeComponentBase
} from '@/core/dtos/factories.dto';
import CustomizeComponentFactory from '@/core/factory/component-customize.factory';
import { CompFormAdapter } from './CompForm.adapter';
import { COMP_FORM_DEFAULT_CONFIG } from './CompForm.default';
import defaultsDeep from 'lodash/defaultsDeep';
import { BaseFormOutput } from '../../../base/form/form/src/BaseForm.adapter';
import BaseForm from '../../../base/form/form/src/BaseForm.vue';
import { COMPONENT_CONFIG } from '../../../../../config/component.config';

@Component({
  name: 'CompForm',
  components: {
    BaseForm
  }
})
export default class CompForm extends Mixins(CustomizeComponentFactory)
  implements CustomizeComponentBase {
  @Prop({ type: Object }) formConfig!: CompFormAdapter;
  @Inject({
    from: 'groupValidate',
    default() {
      return function() {};
    }
  })
  groupValidate?: Function;

  get Config(): CompFormAdapter {
    return defaultsDeep(
      this.formConfig,
      COMPONENT_CONFIG.form,
      COMP_FORM_DEFAULT_CONFIG
    );
  }
  get output(): BaseFormOutput {
    return this.formOutputs as BaseFormOutput;
  }
  get formSlotItems() {
    return this.Config.form.formItems.filter((i) => i.type === 'slot');
  }

  type = COMPONENT_TYPE.form;
  formOutputs: { [k: string]: any } = {};

  handleValidated(isValid: boolean) {
    typeof this.groupValidate === 'function' && this.groupValidate(isValid);
    this.emitEventAndExecuteListener('validated', this.Config.on, isValid);
  }
}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';
@import './__styles__/underline.scss';

@include b(comp-form) {
  width: 100%;

  @include e(title) {
    width: 100%;
    padding-left: 10px;
    text-align: left;
  }

  @include e(form) {
    width: 100%;
    padding: 20px 10px;
    box-sizing: border-box;
  }
}
</style>
