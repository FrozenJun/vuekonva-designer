import { CustomizeComponentAdapter } from './../../../../dtos/component-customize.dto';
import { FormAdapter } from '../../../base/form/form/src/BaseForm.adapter';
import CoreFactory from '@/core/factory/core.factory';

export interface CompSearchAdapter extends CustomizeComponentAdapter {
  handleSearchParam?(apiParam: {
    [name: string]: any;
  }): { [name: string]: any };
  form: FormAdapter;
  showAdvancedSearch?: boolean;
  advancedSearchType?: 'dropDown';
  advancedSearchForm?: FormAdapter;
  formModel: { [name: string]: any };
  filterNulls?: boolean;
  on?: {
    search?(
      this: CoreFactory,
      searchParam: { [name: string]: any },
      name?: string
    ): void;
  };
}

export interface CompSearchOutput {
  params: { [name: string]: any };
  reset?(): void;
  search?(): void;
}
