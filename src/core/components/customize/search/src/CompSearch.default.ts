import { BASE_FORM_DEFAULT_CONFIG } from './../../../base/form/form/src/BaseForm.default';
import { CompSearchAdapter } from './CompSearch.adapter';
import { COMPONENT_METHOD } from '@/core/dtos/factories.dto';

export const COMP_SEARCH_DEFAULT_CONFIG: CompSearchAdapter = {
  form: {
    formItems: [],
    max: 5
  },
  formModel: {},
  advancedSearchForm: BASE_FORM_DEFAULT_CONFIG,
  advancedSearchType: 'dropDown',
  handleSearchParam(apiParam: any) {
    return apiParam;
  },
  filterNulls: true,
  on: {
    search(searchParam, name) {
      this.emit(COMPONENT_METHOD.gridSetParams, searchParam, name);
      this.emit(COMPONENT_METHOD.gridResetPage, 1, name);
      this.$nextTick(() => {
        this.emit(COMPONENT_METHOD.gridUpdate, null, name);
      });
    }
  }
};
