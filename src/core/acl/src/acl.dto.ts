export interface ACLType {
  /**
   * 角色
   */
  role?: string[];
  /**
   * 权限
   */
  permission?: number[] | string[];
  /**
   * 校验模式
   * all 须满足所有角色或权限数组
   * one 只须满足角色或权限数组中的一项
   * 默认 all
   */
  mode?: 'all' | 'one';
  /**
   * 是否取反
   */
  except?: boolean;

  [key: string]: any;
}

export type ACLDataType = number | number[] | string | string[] | ACLType;
