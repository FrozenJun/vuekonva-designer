import { BaseComponentAdapter } from '@/core/dtos/component-base.dto';
import { TreeData, TreeStore, TreeNode, ElTree } from 'element-ui/types/tree';
import { CreateElement, VNode } from 'vue';
import { AsyncData } from '@/core/dtos/component.dto';

type nodeDragEndPosition = 'before' | 'after' | 'inner';

interface TreePropsConfig {
  label?: string;
  disabled?: string;
  isLeaf?: string;
  children?: string;
}

export interface BaseTreeAdapter<
  K = string | number,
  D extends TreeData = TreeData
> extends BaseComponentAdapter<ElTree<string | number, TreeData>> {
  data: D[] | AsyncData<D>;
  defaultCheckedKeys?: K[] | AsyncData<K>;
  slots?: {
    default?: string;
  };
  on?: {
    nodeClick?(data: D, node: TreeNode<K, D>, ref: D | K): void;
    nodeContextmenu?(
      event: Event,
      data: D,
      node: TreeNode<K, D>,
      ref: D | K
    ): void;
    checkChange?(data: D, node: TreeNode<K, D>, ref: D | K): void;
    check?(
      data: D,
      status: {
        checkedNodes: D[];
        checkedKeys: K[];
        halfCheckedNodes: D[];
        halfCheckedKeys: K[];
      }
    ): void;
    currentChange?(data: D, node: TreeNode<K, D>): void;
    nodeExpand?(data: D, node: TreeNode<K, D>, ref: D | K): void;
    nodeCollapse?(data: D, node: TreeNode<K, D>, ref: D | K): void;
    nodeDragStart?(
      node: TreeNode<K, D>,
      startNode: TreeNode<K, D>,
      event: Event
    ): void;
    nodeDragEnter?(
      node: TreeNode<K, D>,
      enterNode: TreeNode<K, D>,
      event: Event
    ): void;
    nodeDragLeave?(
      node: TreeNode<K, D>,
      leaveNode: TreeNode<K, D>,
      event: Event
    ): void;
    nodeDragOver?(
      node: TreeNode<K, D>,
      overNode: TreeNode<K, D>,
      event: Event
    ): void;
    nodeDragEnd?(
      node: TreeNode<K, D>,
      endNode: TreeNode<K, D> | undefined,
      position: nodeDragEndPosition,
      event: Event
    ): void;
    nodeDrop?(
      node: TreeNode<K, D>,
      endNode: TreeNode<K, D>,
      position: nodeDragEndPosition,
      event: Event
    ): void;
  };
  // 以下是 Element UI Attrs 和 events
  // @see https://element.eleme.cn/#/zh-CN/component/tree#attributes
  currentNodeKey?: string | number;
  /** TreeStore */
  // currentNodeKey?: string | number;

  store?: TreeStore<K, D>;

  /** Text displayed when data is void */
  emptyText?: string;

  /** Unique identity key name for nodes, its value should be unique across the whole tree */
  nodeKey?: string;

  /** Configuration options, see the following table */
  props?: TreePropsConfig;

  /** Method for loading subtree data */
  load?: (data: D, resolve: Function) => void;

  /**
   * Render function for a specific node
   *
   * @param h The render function
   */
  renderContent?: (
    h: CreateElement,
    context: { node: TreeNode<K, D>; data: D; store: TreeStore<K, D> }
  ) => VNode;

  /** Whether current node is highlighted */
  highlightCurrent?: boolean;

  /** Whether to expand all nodes by default */
  defaultExpandAll?: boolean;

  /** Whether to expand or collapse node when clicking on the node. If false, then expand or collapse node only when clicking on the arrow icon. */
  expandOnClickNode?: boolean;

  /** Whether to check or uncheck node when clicking on the node, if false, the node can only be checked or unchecked by clicking on the checkbox. */
  checkOnClickNode?: boolean;

  /** Whether to expand father node when a child node is expanded */
  autoExpandParent?: boolean;

  /** Array of keys of initially expanded nodes */
  defaultExpandedKeys?: K[];

  /** Whether node is selectable */
  showCheckbox?: boolean;

  /** Whether checked state of a node not affects its father and child nodes when show-checkbox is true */
  checkStrictly?: boolean;

  /**
   * This function will be executed on each node when use filter method. If return false, tree node will be hidden.
   *
   * @param value The query string
   * @param data The original data object
   * @param node Tree node
   */
  filterNodeMethod?: (value: string, data: D, node: TreeNode<K, D>) => boolean;

  /** Whether only one node among the same level can be expanded at one time */
  accordion?: boolean;

  /** Horizontal indentation of nodes in adjacent levels in pixels */
  indent?: number;

  /** Whether enable tree nodes drag and drop */
  draggable?: boolean;

  /**
   * Function to be executed before dragging a node
   *
   * @param node The node to be dragged
   */
  allowDrag?: (node: TreeNode<K, D>) => boolean;

  /**
   * Function to be executed before the dragging node is dropped
   *
   * @param draggingNode The dragging node
   * @param dropNode The target node
   * @param type Drop type
   */
  allowDrop?: (
    draggingNode: TreeNode<K, D>,
    dropNode: TreeNode<K, D>,
    type: 'prev' | 'inner' | 'next'
  ) => boolean;

  /** Custom tree node icon */
  iconClass?: string;
}

export interface BaseTreeOutput {
  ref?: ElTree<string | number, TreeData>;
  getData?(): void;
  getCheckedKeys?(): void;
}
