import { TabsAdapter } from './BaseTabs.adapter';
import { hasPermission } from '@/core/acl/src/acl.util';

export const TABS_DEFAULT: TabsAdapter = {
  model: '',
  hasPermission: hasPermission,
  tabPanes: []
};
