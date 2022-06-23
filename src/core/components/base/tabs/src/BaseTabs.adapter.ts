import { BaseComponentAdapter } from '@/core/dtos/component-base.dto';
import { ElTabs } from 'element-ui/types/tabs';
import { ElTabPane } from 'element-ui/types/tab-pane';

export interface BaseTabPanes {
  slot: string;
  permissionName?: string;
  // 以下是 Element UI Attrs 和 events
  // @see https://element.eleme.cn/#/zh-CN/component/tabs#tab-pane-attributes
  label: string;
  name: string;
  disabled?: boolean;
  closable?: boolean;
  lazy?: boolean;
}

export interface TabsAdapter extends BaseComponentAdapter<ElTabs> {
  model: string;
  tabPanes: BaseTabPanes[];
  activeTabScale?: number;
  hasPermission?: (permission: string) => boolean;
  // 以下是 Element UI Attrs 和 events
  // @see https://element.eleme.cn/#/zh-CN/component/tabs#tabs-attributes
  type?: 'card' | 'border-card';
  closable?: boolean;
  addable?: boolean;
  editable?: boolean;
  tabPosition?: 'top' | 'right' | 'bottom' | 'left';
  stretch?: boolean;
  beforeLeave?(
    activeName: string,
    oldActiveName: string
  ): boolean | Promise<any>;
  on?: {
    tabClick?(tab: ElTabPane): void;
    tabRemove?(removeName: string): void;
    tabAdd?(): void;
    edit?(targetName: string, action: string): void;
  };
}

export interface BaseTabsOutput {
  setTab?(tabName: string): void;
}
