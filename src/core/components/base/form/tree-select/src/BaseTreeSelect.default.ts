import { BaseTreeSelectAdapter } from './BaseTreeSelect.adapter';

export const TREE_SELECT_DEFAULT: BaseTreeSelectAdapter = {
  input: {
    readonly: true,
    size: 'small'
  },
  tree: {
    data: [],
    ref: null
  }
};
