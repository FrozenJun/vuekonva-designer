import { ButtonAdapter } from './../../button/src/BaseButton.adapter';
import { BaseComponentAdapter } from '@/core/dtos/component-base.dto';
import { ElTable } from 'element-ui/types/table';
import { AsyncData } from '@/core/dtos/component.dto';

type TableColumnTypes = 'default' | 'button' | 'icon' | 'slot';

export interface BaseTableButtonConfig extends ButtonAdapter {
  onClick?(scope: any, button: ButtonAdapter): void;
}

/** 行 */
export interface BaseTableColumnOption {
  columnType?: TableColumnTypes; // column类型
  buttonConfig?: {
    buttons: BaseTableButtonConfig[]; // type为button的配置
    handleEachButton?(
      operations: BaseTableButtonConfig[],
      scope: any
    ): BaseTableButtonConfig[]; // 能根据表格内容的不同设置不同的按钮状态
  };
  iconConfig?: {
    handleInjectIcon(row: { [name: string]: any }): string;
    showProp?: boolean;
    position?: 'left' | 'right';
  }; // type为icon的配置
  slotConfig?: {
    slot: string;
  };

  // 以下是 Element UI Attrs 和 events
  // @see https://element.eleme.cn/#/zh-CN/component/table#table-column-attributes
  prop?: string; // 数据字段
  label?: string; // 每列标题
  width?: string;
  minWidth?: string;
  fixed?: boolean;
  align?: string;
  headerAlign?: string;
  showOverflowTooltip?: boolean;
  type?: 'selection' | 'index' | 'expand';
  index?: number | ((index: number) => number);
  columnKey?: string;
  sortable?: boolean | 'custom';
  sortMethod?(a: any, b: any): number;
  sortBy?: string | string[] | ((row: any, index: number) => string | string[]);
  sortOrders?: ('ascending' | 'descending' | null)[];
  resizable?: boolean;
  formatter?(row: any, column: any, cellValue: any, index: number): any;
  filters?: { text: string; value: any }[];
}

/** 表格 */
export interface BaseTableAdapter extends BaseComponentAdapter<ElTable> {
  columns: BaseTableColumnOption[]; // 每列参数
  data: any[] | AsyncData<any>;
  dataApiParam?: { [k: string]: any }; // 自定义的api的参数
  apiDataKey?: string;
  apiTotalKey?: string;
  searchParam?: { [k: string]: any };
  showNo?: boolean; // 是否在第一列显示编号
  isDeepHandle?: boolean;
  handleData?(data: { [k: string]: any }): object; // 获取数据后的数据处理，传入数据的每一项
  handleDataList?(list: { [k: string]: any }[]): { [k: string]: any }[]; // 获取数据后的数据处理，传入数据列表
  isPaginationBySelf?: boolean; // 是否需要前端分页
  isDeletePagesParams?: boolean; // 是否删除pageNo,pageSize参数
  page?: number;
  pageSize?: number;
  pageNoKey?: string;
  pageSizeKey?: string;
  callApiImmediate?: boolean; // 是否自动获取一次数据
  pagination?: {
    enable?: boolean; // 是否有分页功能
    page?: number;
    pageSize?: number;
    noKey?: string;
    sizeKey?: string;
    dataKey?: string;
    totalKey?: string;
    paginationBySelf?: boolean;
  };

  loadingText?: string; // 正在加载时显示文字
  showSelection?: boolean; // 是否在第一列显示选择框
  selectable?: (row: any, index: number) => boolean | number;
  reserveSelection?: boolean;

  // 以下是 Element UI Attrs 和 events
  // @see https://element.eleme.cn/#/zh-CN/component/table#table-attributes
  height?: number | string;
  maxHeight?: number | string;
  stripe?: boolean; // 是否显示斑马纹
  border?: boolean; // 是否显示border
  size?: 'medium' | 'small' | 'mini';
  fit?: boolean;
  showHeader?: boolean;
  highlightCurrentRow?: boolean;
  currentRowKey?: string | number;
  rowClassName?: string | ((data: { row: any; rowIndex: number }) => string);
  rowStyle?: object | ((data: { row: any; rowIndex: number }) => object);
  cellClassName?: ((data: any) => string) | string;
  cellStyle?: object | ((data: any) => object);
  headerRowClassName?: string | ((data: any) => string);
  headerRowStyle?: object | ((data: { row: any; rowIndex: number }) => object);
  headerCellClassName?: string | ((data: any) => string);
  headerCellStyle?: object | ((data: any) => object);
  rowKey?: string | ((row: any) => string);
  emptyText?: string;
  defaultExpandAll?: boolean;
  expandRowKeys?: string[];
  defaultSort?: {
    prop: string;
    order?: 'ascending' | 'descending';
  };
  tooltipEffect?: 'dark' | 'light';
  showSummary?: boolean;
  sumText?: string;
  summaryMethod?(data: { columns: any[]; data: any }): void;
  spanMethod?(data: {
    row: any;
    column: any;
    rowIndex: number;
    columnIndex: number;
  }): void;
  selectOnIndeteminate?: boolean;
  indent?: number;
  lazy?: number;
  load?(row: any, treeNode: any, resolve: Function): void;
  treeProps?: object;
  on?: {
    select?(selection: any, row: any): void;
    selectAll?(selection: any): void;
    selectChange?(selection: any): void;
    cellMouseEnter?(row: any, column: any, cell: any, event: any): void;
    cellMouseLeave?(row: any, column: any, cell: any, event: any): void;
    cellClick?(row: any, column: any, cell: any, event: any): void;
    cellDbclik?(row: any, column: any, cell: any, event: any): void;
    rowClick?(row: any, column: any, event: any): void;
    rowContextmenu?(row: any, column: any, event: any): void;
    rowDbclick?(row: any, column: any, event: any): void;
    headerClick?(column: any, event: any): void;
    headerContextmenu?(column: any, event: any): void;
    sortChange?(data: { column: any; prop: string; order: string }): void;
    filterChange?(filters: any[]): void;
    currentChange?(currentRow: any, oldCurrentRow: any): void;
    headerDragend?(
      newWidth: string,
      oldWidth: string,
      column: any,
      event: any
    ): void;
    expandChagne?(row: any, expanded: any): void;
  };
}

export interface BaseTableOutput {
  total?: number;
  update?: Function;
  responseData?: { [name: string]: any };
}
