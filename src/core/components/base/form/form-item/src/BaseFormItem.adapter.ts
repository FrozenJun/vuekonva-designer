import { BaseComponentAdapter } from '@/core/dtos/component-base.dto';
import { InputAdapter } from '../../input/src/BaseInput.adapter';
import { BaseSelectAdapter } from '../../select/src/BaseSelect.adapter';
import { BaseDatetimeAdapter } from '../../datetime/src/BaseDatetime.adapter';
import { BaseTreeSelectAdapter } from '../../tree-select/src/BaseTreeSelect.adapter';
import { BaseUploadAdapter } from '../../upload/src/BaseUpload.adapter';
import { BaseCascaderAdapter } from '../../cascader/src/BaseCascader.adapter';
import { CheckboxAdapter } from '../../checkbox/src/BaseCheckbox.adapter';
import { BaseCheckboxGroupAdapter } from '../../checkbox-group/src/BaseCheckboxGroup.adapter';
import { BaseAutocompleteAdapter } from '../../autocomplete/src/BaseAutocomplete.adapter';
import { BaseSwitchAdapter } from '../../switch/src/BaseSwitch.adapter';
import { BaseRaidoAdapter } from '../../raido/src/BaseRaido.adapter';
import { BaseInputNumberAdapter } from '../../input-number/src/BaseInputNumber.adapter';
import { BaseArrayFormAdapter } from '../../array-form/src/BaseArrayForm.adapter';
import { BaseColorPickerAdapter } from '../../color-picker/src/BaseColorPicker.adapter';

export type BaseFormItemType =
  | 'input'
  | 'select'
  | 'datetime'
  | 'checkbox'
  | 'checkboxGroup'
  | 'switch'
  | 'raido'
  | 'treeSelect'
  | 'upload'
  | 'cascader'
  | 'empty'
  | 'slot'
  | 'inputNumber'
  | 'arrayForm'
  | 'colorPicker'
  | 'autocomplete';

export interface BaseFormItemAdapter extends BaseComponentAdapter {
  type?: BaseFormItemType;
  modelName?: string;
  modelClassName?: string;
  labelIcon?: string;
  rule?: string | object;
  validateOn?: string[];
  validateName?: string;
  width?: string;
  visible?: boolean;
  contentAlign?: 'left' | 'mid' | 'right';
  tip?: string;
  slots?: {
    prefix?: string;
    append?: string;
  };

  inputConfig?: InputAdapter;
  selectConfig?: BaseSelectAdapter;
  datetimeConfig?: BaseDatetimeAdapter;
  treeSelectConfig?: BaseTreeSelectAdapter;
  uploadConfig?: BaseUploadAdapter;
  cascaderConfig?: BaseCascaderAdapter;
  checkboxConfig?: CheckboxAdapter;
  checkboxGroupConfig?: BaseCheckboxGroupAdapter;
  autocompleteConfig?: BaseAutocompleteAdapter;
  switchConfig?: BaseSwitchAdapter;
  raidoConfig?: BaseRaidoAdapter;
  inputNumberConfig?: BaseInputNumberAdapter;
  arrayFormConfig?: BaseArrayFormAdapter;
  colorPickerConfig?: BaseColorPickerAdapter;
  slotConfig?: {
    name: string;
    scope?: any;
  };
  // 以下是 Element UI Attrs 和 events
  // @see https://element.eleme.cn/#/zh-CN/component/form
  label?: string;
  labelWidth?: string;
}
