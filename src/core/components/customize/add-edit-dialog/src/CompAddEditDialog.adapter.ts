import { CustomizeComponentAdapter } from '@/core/dtos/component-customize.dto';
import CoreFactory from '@/core/factory/core.factory';
import { DialogAdapter } from '../../../base/dialog/src/BaseDialog.adapter';
import { FormAdapter } from '../../../base/form/form/src/BaseForm.adapter';

export interface CompAddEditDialogAdapter extends CustomizeComponentAdapter {
  form: FormAdapter;
  formModel: { [name: string]: any };
  dialog?: DialogAdapter;
  addApi: Function;
  handleAddParam?(apiParam: { [name: string]: any }): { [name: string]: any };
  editApi: Function;
  handleEditParam?(apiParam: { [name: string]: any }): { [name: string]: any };
  addTitle?: string;
  editTitle?: string;
  on?: {
    fail?(): void;
    success?(this: CoreFactory, res: any, name: string): void;
  };
}

export interface CompAddEditDialogOutput {
  open(data?: {
    type: 'add' | 'edit';
    payload: object;
    requiredKeys?: string[];
  }): void;
  close: Function;
  reset: Function;
  validate: Function;
}
