<template>
  <base-dialog
    class="comp-form-dialog"
    :config="Config.dialog"
    inner
    @close="onClose"
    @submit="onSubmit"
    @output-change="copyOutputsToTarget('dialogOutputs', $event)"
    v-on="$listeners"
  >
    <base-form
      :config="Config.form"
      :formModel="Config.formModel"
      inner
      @output-change="copyOutputsToTarget('formOutputs', $event)"
      @validated="onValidated"
      v-on="$listeners"
    >
      <template v-for="(_, slot) in $scopedSlots" #[slot]="{scope}">
        <slot :name="slot" :scope="scope"></slot>
      </template>
    </base-form>
  </base-dialog>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { CompFormDialogAdapter } from './CompFormDialog.adapter';
import BaseForm from '../../../base/form/form/src/BaseForm.vue';
import { BaseDialog } from '../../../base';
import { BaseFormOutput } from '../../../base/form/form/src/BaseForm.adapter';
import { BaseDialogOutput } from '../../../base/dialog/src/BaseDialog.adapter';
import {
  COMPONENT_TYPE,
  CustomizeComponentBase
} from '@/core/dtos/factories.dto';
import CustomizeComponentFactory from '@/core/factory/component-customize.factory';
import assignWith from 'lodash/assignWith';
import defaultsDeep from 'lodash/defaultsDeep';
import { COMP_FORM_DIALOG_DEFAULT_CONFIG } from './CompFormDialog.default';
import { COMPONENT_CONFIG } from '../../../../../config/component.config';
import cloneDeep from 'lodash/cloneDeep';

@Component({
  name: 'compFormDialog',
  components: {
    BaseDialog,
    BaseForm
  }
})
export default class CompFormDialog extends Mixins(CustomizeComponentFactory)
  implements CustomizeComponentBase {
  @Prop({ type: Object }) formDialogConfig!: CompFormDialogAdapter;
  @Prop({ type: String, default: '' }) name!: string;
  get Config(): CompFormDialogAdapter {
    return defaultsDeep(
      this.formDialogConfig,
      {
        dialog: {
          submiting: this.submiting
        }
      },
      COMPONENT_CONFIG.formDialog,
      COMP_FORM_DIALOG_DEFAULT_CONFIG
    );
  }
  get output(): BaseDialogOutput & BaseFormOutput {
    return {
      ...this.dialogOutputs,
      ...this.formOutputs,
      open: this.onOpen.bind(this)
    };
  }

  type = COMPONENT_TYPE.formDialog;
  dialogOutputs: BaseDialogOutput = {};
  formOutputs: BaseFormOutput = {};
  submiting = false;

  onClose() {
    this.emitEventAndExecuteListener('close', this.Config.on);
    this.formOutputs.reset!();
  }
  onSubmit() {
    this.formOutputs.validate!();
  }
  onOpen(payload?: object) {
    this.dialogOutputs.open!();
    // 防止打开时base-form刚初始化，将data.payload设为了formModel的初始值
    this.$nextTick(() => {
      assignWith(this.Config.formModel, payload);
    });
  }
  onValidated(isValid: boolean) {
    isValid && this.send();
  }

  async send() {
    const param = this.Config.handleApiParam
      ? this.Config.handleApiParam(cloneDeep(this.Config.formModel))
      : this.Config.formModel;
    this.submiting = true;
    const res = await this.Config.api(param);
    this.submiting = false;
    if (!res) return;
    this.dialogOutputs.close!();
    this.$message.success(this.Config.successMessage || '操作成功');
    this.emitEventAndExecuteListener('success', this.Config.on, this.name);
  }
}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@include b(comp-form-dialog) {
}
</style>
