import { BaseTreeAdapter } from 'src/core/components/base/tree/src/BaseTree.adapter';
import { CustomizeComponentAdapter } from '@/core/dtos/component-customize.dto';

export interface CompTreeAdapter extends CustomizeComponentAdapter {
  tree: BaseTreeAdapter;
}
