import { TabsAdapter } from './../../../base/tabs/src/BaseTabs.adapter';
import { CustomizeComponentAdapter } from './../../../../dtos/component-customize.dto';

export interface CompTabsAdapter extends CustomizeComponentAdapter {
  tabs: TabsAdapter;
}
