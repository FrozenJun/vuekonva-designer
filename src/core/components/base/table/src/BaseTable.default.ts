import {
  BaseTableAdapter,
  BaseTableColumnOption,
  BaseTableButtonConfig
} from './BaseTable.adapter';
import Vue from 'vue';

export const BASE_TABLE_OPERATION_DEFAULT: BaseTableButtonConfig = {
  visable: true,
  text: '',
  onClick() {},
  plain: true,
  size: 'mini',
  disabled: false
};

export const BASE_TABLE_COLUMN_DEFAULT_CONFIG: BaseTableColumnOption = {
  prop: '',
  label: '',
  columnType: 'default',
  showOverflowTooltip: true,
  width: '',
  align: 'left',
  iconConfig: {
    handleInjectIcon() {
      return '';
    },
    showProp: true,
    position: 'right'
  },
  buttonConfig: {
    buttons: [],
    handleEachButton(config) {
      return config.map((i) => Vue.observable(i));
    }
  }
};

export const BASE_TABLE_DEFAULT_CONFIG: BaseTableAdapter = {
  apiDataKey: 'records',
  apiTotalKey: 'total',
  headerCellStyle: {
    height: '48px',
    background: '#FAFAFA'
  },
  data: [],
  columns: [],
  stripe: true,
  border: false,
  showNo: false,
  showSelection: false,
  size: 'mini',
  tooltipEffect: 'light',
  loadingText: '数据加载中',
  isPaginationBySelf: false,
  pageNoKey: 'pageNo',
  pageSizeKey: 'pageSize',
  callApiImmediate: true,
  pagination: {
    enable: true,
    noKey: 'pageNo',
    sizeKey: 'pageSize',
    dataKey: 'records',
    totalKey: 'total',
    paginationBySelf: false
  }
};
