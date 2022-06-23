import { CustomizeComponentAdapter } from './../../../../dtos/component-customize.dto';
import { DialogAdapter } from './../../../base/dialog/src/BaseDialog.adapter';

export interface CompDialogAdapter extends CustomizeComponentAdapter {
  dialog?: DialogAdapter;
}
