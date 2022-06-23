import { ButtonAdapter } from './../../button/src/BaseButton.adapter';
import { BaseComponentAdapter } from '@/core/dtos/component-base.dto';
import { ElDialog } from 'element-ui/types/dialog';

type innerButtonType = 'submit' | 'close' | 'sure';
interface DialogFooterButton extends ButtonAdapter {
  /** 弹窗footer中自定义的按钮 */
  tag?: innerButtonType;
}

export interface DialogAdapter extends BaseComponentAdapter<ElDialog> {
  minWidth?: string;
  hiddenDefaultFooter?: boolean;
  submiting?: boolean;
  footerButtons?: DialogFooterButton[];
  innerButtons?: innerButtonType[]; // footerButtons存在时无效
  on?: {
    submit?(...args: any[]): void;
    // 以下是 Element events
    open?(...args: any[]): void;
    opened?(): void;
    close?(): void;
    closed?(): void;
  };
  // @see https://element.eleme.cn/#/zh-CN/component/dialog
  appendToBody?: boolean;
  /** Title of Dialog */
  title?: string;

  /** Width of Dialog */
  width?: string;

  /** Whether the Dialog takes up full screen */
  fullscreen?: boolean;

  /** Value for margin-top of Dialog CSS */
  top?: string;

  /** Whether a mask is displayed */
  modal?: boolean;

  /** Whether to append modal to body element. If false, the modal will be appended to Dialog's parent element */
  modalAppendToBody?: boolean;

  /** Whether scroll of body is disabled while Dialog is displayed */
  lockScroll?: boolean;

  /** Custom class names for Dialog */
  customClass?: string;

  /** Whether the Dialog can be closed by clicking the mask */
  closeOnClickModal?: boolean;

  /** Whether the Dialog can be closed by pressing ESC */
  closeOnPressEscape?: boolean;

  /** Whether to show a close button */
  showClose?: boolean;

  /** Callback before Dialog closes, and it will prevent Dialog from closing */
  beforeClose?: (done: Function) => void;

  /** Whether to align the header and footer in center */
  center?: boolean;

  /** Whether to destroy elements in Dialog when closed */
  destroyOnClose?: boolean;
  [k: string]: any;
}

export interface BaseDialogOutput {
  open?: Function;
  close?: Function;
  submit?: Function;
  submiting?: Function;
  submited?: Function;
  config?: DialogAdapter;
}
