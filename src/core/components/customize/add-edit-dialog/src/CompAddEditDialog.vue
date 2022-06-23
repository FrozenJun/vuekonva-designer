<template>
  <base-dialog
    class="comp-add-edit-dialog"
    :config="Config.dialog"
    inner
    @close="onClose"
    @submit="onSubmit"
    v-on="$listeners"
    @output-change="copyOutputsToTarget('dialogOutputs', $event)"
  >
    <base-form
      :config="Config.form"
      inner
      :formModel="Config.formModel"
      @output-change="copyOutputsToTarget('formOutputs', $event)"
      v-on="$listeners"
      @validated="onValidated"
    >
      <template v-for="(_, slot) in $scopedSlots" #[slot]="{scope}">
        <slot :name="slot" :scope="scope"></slot>
      </template>
    </base-form>

    <slot slot="title" name="title"></slot>
    <slot slot="footer" name="footer"></slot>
  </base-dialog>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { CompAddEditDialogAdapter } from './CompAddEditDialog.adapter';
import { BaseDialogOutput } from '../../../base/dialog/src/BaseDialog.adapter';
import { BaseDialog } from '../../../base';
import BaseForm from '../../../base/form/form/src/BaseForm.vue';
import {
  COMPONENT_TYPE,
  CustomizeComponentBase
} from '@/core/dtos/factories.dto';
import CustomizeComponentFactory from '@/core/factory/component-customize.factory';
import defaultsDeep from 'lodash/defaultsDeep';
import cloneDeep from 'lodash/cloneDeep';
import { BaseFormOutput } from '../../../base/form/form/src/BaseForm.adapter';
import { ADD_EDIT_DIALOG_DEFAULT } from './CompAddEditDialog.default';
import { COMPONENT_CONFIG } from '../../../../../config/component.config';

@Component({
  name: 'CompAddEditDialog',
  components: {
    BaseDialog,
    BaseForm
  }
})
export default class CompAddEditDialog extends Mixins(CustomizeComponentFactory)
  implements CustomizeComponentBase {
  @Prop({ type: Object }) addEditDialogConfig!: CompAddEditDialogAdapter;
  get Config(): CompAddEditDialogAdapter {
    const c = this.addEditDialogConfig;
    if (!c.dialog) {
      this.$set(c, 'dialog', {});
    }
    this.$set(
      c.dialog!,
      'title',
      this.mode === 'add' ? c.addTitle : c.editTitle
    );
    return defaultsDeep(
      c,
      COMPONENT_CONFIG.addEditDialog,
      ADD_EDIT_DIALOG_DEFAULT
    );
  }
  get output(): BaseDialogOutput & BaseFormOutput {
    return {
      ...this.dialogOutputs,
      ...this.formOutputs,
      open: this.onOpen.bind(this)
    };
  }

  type = COMPONENT_TYPE.addEditDialog;
  dialogOutputs: BaseDialogOutput = {};
  formOutputs: BaseFormOutput = {};

  mode: 'add' | 'edit' = 'add';

  onClose() {
    this.formOutputs.reset!();
  }
  onSubmit() {
    this.formOutputs.validate!();
  }
  onOpen(
    data: { type: 'add' | 'edit'; payload: object; requiredKeys: string[] } = {
      type: 'add',
      payload: {},
      requiredKeys: []
    }
  ) {
    this.mode = data.type;
    this.dialogOutputs.open!(data);
    // 防止打开时base-form刚初始化，将data.payload设为了formModel的初始值
    this.$nextTick(() => {
      _.assignWith(
        this.Config.formModel,
        _.pick(data.payload, [
          ...Object.keys(this.Config.formModel),
          ...(data.requiredKeys || [])
        ])
      );
    });
  }
  onValidated(isValid: boolean) {
    isValid && (this.mode === 'add' ? this.add() : this.edit());
  }

  async add() {
    const param = this.Config.handleAddParam
      ? this.Config.handleAddParam(cloneDeep(this.Config.formModel))
      : this.Config.formModel;
    this.dialogOutputs.submiting!();
    const res = await this.Config.addApi(param);
    this.dialogOutputs.submited!();
    if (!res) return this.emitEventAndExecuteListener('fail', this.Config.on);
    this.dialogOutputs.close!();
    this.$message.success('新增成功');
    this.emitEventAndExecuteListener('success', this.Config.on, res, this.id);
  }
  async edit() {
    const param = this.Config.handleEditParam
      ? this.Config.handleEditParam(cloneDeep(this.Config.formModel))
      : this.Config.formModel;
    this.dialogOutputs.submiting!();
    const res = await this.Config.editApi(param);
    this.dialogOutputs.submited!();
    if (!res) return this.emitEventAndExecuteListener('fail', this.Config.on);
    this.dialogOutputs.close!();
    this.$message.success('编辑成功');
    this.emitEventAndExecuteListener('success', this.Config.on, res, this.id);
  }
}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@include b(comp-add-edit-dialog) {
}
</style>
