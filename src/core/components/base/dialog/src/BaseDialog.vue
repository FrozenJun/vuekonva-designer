<template>
  <el-dialog
    class="base-dialog"
    ref="CoDialog"
    :visible.sync="visible"
    v-bind="bindConfig"
    v-on="mergeEventsAndDasherizeKeys([Config.on, $listeners], ['open'])"
  >
    <!-- slots -->
    <template #title>
      <slot name="title"></slot>
    </template>
    <slot></slot>
    <template #footer>
      <slot name="footer"></slot>
      <!-- 默认页脚 -->
      <base-button-group
        class="base-dialog__button-group"
        v-if="!Config.hiddenDefaultFooter"
        :config="footerButtons"
        inner
      ></base-button-group>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Prop, Watch, Mixins } from 'vue-property-decorator';
import { DialogAdapter, BaseDialogOutput } from './BaseDialog.adapter';
import { DIALOG_DEFAULT } from './BaseDialog.default';
import BaseComponentFactory from '@/core/factory/component-base.factory';
import { COMPONENT_CONFIG } from '@/config/component.config';
import { BaseComponent, COMPONENT_TYPE } from '@/core/dtos/factories.dto';
import BaseButtonGroup from '../../button-group';
import { ButtonAdapter } from '../../button/src/BaseButton.adapter';

@Component({ name: 'CoDialog', components: { BaseButtonGroup } })
export default class BaseDialog extends Mixins(BaseComponentFactory)
  implements BaseComponent {
  @Prop({ type: Object }) config!: DialogAdapter;
  @Prop({ type: String, default: '' }) compName?: string;
  @Prop({ type: Boolean }) inner?: boolean;

  get Config(): DialogAdapter {
    return _(this.config)
      .defaultsDeep(COMPONENT_CONFIG.dialog)
      .defaultsDeep(DIALOG_DEFAULT)
      .value();
  }
  get output(): BaseDialogOutput {
    return {
      config: this.Config,
      close: this.close.bind(this),
      open: this.open.bind(this),
      submit: this.submit.bind(this),
      submiting: this.submiting.bind(this),
      submited: this.submited.bind(this)
    };
  }
  get footerButtons() {
    const buttons = this.Config.footerButtons;
    const inner = this.Config.innerButtons || [];
    if (buttons) {
      return {
        buttons: buttons.map((button) => {
          const { tag } = button;
          switch (tag) {
            case 'submit':
              return _.defaultsDeep(button, this.submitButton);
            case 'close':
              return _.defaultsDeep(button, this.closeButton);
            case 'sure':
              return _.defaultsDeep(button, this.sureButton);
            default:
              return button;
          }
        })
      };
    } else {
      return {
        buttons: inner.map((type) => {
          switch (type) {
            case 'submit':
              return this.submitButton;
            case 'close':
              return this.closeButton;
            case 'sure':
              return this.sureButton;
          }
        })
      };
    }
  }

  @Watch('Config.minWidth', { immediate: true })
  onMinWidthChange(val: string) {
    this.setMinWidth(val);
  }

  $$type = COMPONENT_TYPE.dialog;
  visible = false;
  sureButton: ButtonAdapter = {
    text: '驳 回',
    loading: false,
    type: 'primary',
    size: 'small',
    on: {
      click: () => {
        this.submit();
      }
    }
  };
  closeButton: ButtonAdapter = {
    text: '取 消',
    size: 'small',
    on: {
      click: () => {
        this.close();
      }
    }
  };
  submitButton: ButtonAdapter = {
    text: '确 定',
    loading: false,
    type: 'primary',
    size: 'small',
    on: {
      click: () => {
        this.submit();
      }
    }
  };

  close() {
    this.visible = false;
  }
  open(...args: any[]) {
    this.visible = true;
    this.emitEventAndExecuteListener('open', this.Config.on, ...args);
  }
  submit(...args: any[]) {
    this.emitEventAndExecuteListener('submit', this.Config.on, ...args);
  }
  submiting() {
    this.submitButton.loading = true;
  }
  submited() {
    this.submitButton.loading = false;
  }

  /**
   * 设置最小值
   */
  private async setMinWidth(minWidth: string | undefined) {
    if (!minWidth) return;
    await this.waitUnitResultTrue(() => !!this.$el);
    const dialogContent = this.$el.getElementsByClassName('el-dialog');
    if (dialogContent[0]) {
      (dialogContent[0] as any).style.minWidth = minWidth;
    }
  }
}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';
@import './__styles__/white-header.scss';
// @import './__styles__/blue-header.scss';
@import './__styles__/radius.scss';

@include b(base-dialog) {
  @include e(button-group) {
    display: inline-block;
  }
}
</style>
