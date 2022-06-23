<template>
  <base-dialog
    class="comp-dialog"
    :config="Config.dialog"
    inner
    @output-change="copyOutputsToTarget('dialogOutputs', $event)"
    v-on="$listeners"
  >
    <!-- slots -->
    <template #title>
      <slot name="title"></slot>
    </template>
    <slot></slot>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </base-dialog>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import {
  COMPONENT_TYPE,
  CustomizeComponentBase
} from '@/core/dtos/factories.dto';
import CustomizeComponentFactory from '@/core/factory/component-customize.factory';
import { CompDialogAdapter } from './CompDialog.adapter';
import { COMP_DIALOG_DEFAULT_CONFIG } from './CompDialog.default';
import defaultsDeep from 'lodash/defaultsDeep';
import { BaseDialog } from '../../../base';
import { BaseDialogOutput } from '../../../base/dialog/src/BaseDialog.adapter';
import { COMPONENT_CONFIG } from '@/config/component.config';

@Component({
  name: 'CompDialog',
  components: {
    BaseDialog
  }
})
export default class CompDialog extends Mixins(CustomizeComponentFactory)
  implements CustomizeComponentBase {
  @Prop({ type: Object }) dialogConfig!: CompDialogAdapter;
  get Config(): CompDialogAdapter {
    return defaultsDeep(
      this.dialogConfig,
      COMPONENT_CONFIG.dialog,
      COMP_DIALOG_DEFAULT_CONFIG
    );
  }
  get output(): BaseDialogOutput {
    return this.dialogOutputs as BaseDialogOutput;
  }

  type = COMPONENT_TYPE.dialog;
  dialogOutputs: { [k: string]: any } = {};
}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@include b(comp-dialog) {
}
</style>
