import CustomizeComponentFactory from '@/core/factory/component-customize.factory';
import { DialogAdapter } from '../../../base/dialog/src/BaseDialog.adapter';
import { FormAdapter } from '../../../base/form/form/src/BaseForm.adapter';
import { CompFormDialog } from '../..';
import CoreFactory from '@/core/factory/core.factory';
import { CustomizeComponentAdapter } from '@/core/dtos/component-customize.dto';

export interface CompFormDialogCallbacks {
  close?(instance: CompFormDialog & CustomizeComponentFactory): void;
  success?(instance: CompFormDialog & CustomizeComponentFactory): void;
}

export interface CompFormDialogAdapter extends CustomizeComponentAdapter {
  form: FormAdapter;
  formModel: { [name: string]: any };
  dialog: DialogAdapter;
  api: Function;
  successMessage?: string;
  handleApiParam?(apiParam: { [name: string]: any }): { [name: string]: any };
  on?: {
    success?(this: CoreFactory, name?: string): void;
  };
}

export interface CompFormDialogOutput {
  open: Function;
  close: Function;
  reset: Function;
  validate: Function;
}
