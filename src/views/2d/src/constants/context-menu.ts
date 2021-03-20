import { IS_MAC } from './variable.constant';

// type在js中用到，不要轻易改变
export const CONTEXT_MENU = [
  {
    icon: 'el-icon-scissors',
    text: '剪切',
    key: IS_MAC ? '⌘X' : '⌃X',
    type: 'cut',
    disabled: false
  },
  {
    icon: 'el-icon-copy-document',
    text: '复制',
    key: IS_MAC ? '⌘C' : '⌃C',
    type: 'copy',
    disabled: false
  },
  {
    icon: 'el-icon-document-copy',
    text: '粘贴',
    key: IS_MAC ? '⌘V' : '⌃V',
    type: 'paste',
    showLine: true,
    disabled: false
  },
  {
    icon: 'el-icon-delete',
    text: '删除',
    key: 'Del',
    type: 'del',
    showLine: true,
    disabled: false
  },
  {
    icon: 'iconfont iconpailie',
    text: '顺序',
    type: 'sort',
    disabled: false,
    children: [
      {
        icon: 'iconfont iconqianyi1',
        text: '前移',
        key: IS_MAC ? '⌘]' : '⌃]',
        type: 'forward',
        disabled: false
      },
      {
        icon: 'iconfont iconhouyi1',
        text: '后移',
        key: IS_MAC ? '⌘[' : '⌃[',
        type: 'backward',
        disabled: false
      },
      {
        icon: 'iconfont iconzhiding',
        text: '置顶',
        key: IS_MAC ? '⌘⇧]' : '⌃⇧]',
        type: 'top',
        disabled: false
      },
      {
        icon: 'iconfont iconzhidi',
        text: '置底',
        key: IS_MAC ? '⌘⇧[' : '⌃⇧[',
        type: 'bottom',
        disabled: false
      }
    ]
  },
  {
    icon: 'iconfont iconduiqi',
    text: '对齐',
    type: 'align',
    disabled: false,
    children: [
      {
        icon: 'iconfont iconzuoduiqi',
        text: '左对齐',
        key: IS_MAC ? '⌘⌥L' : '⌃⌥L',
        type: 'left',
        disabled: false
      },
      {
        icon: 'iconfont iconshuipingjuzhong',
        text: '水平居中',
        key: IS_MAC ? '⌘⌥C' : '⌃⌥C',
        type: 'horizontal',
        disabled: false
      },
      {
        icon: 'iconfont iconyouduiqi',
        text: '右对齐',
        key: IS_MAC ? '⌘⌥R' : '⌃⌥R',
        type: 'right',
        disabled: false
      },
      {
        icon: 'iconfont iconshangduiqi',
        text: '上对齐',
        key: IS_MAC ? '⌘⌥T' : '⌃⌥T',
        type: 'up',
        disabled: false
      },
      {
        icon: 'iconfont iconchuizhijuzhong',
        text: '垂直居中',
        key: IS_MAC ? '⌘⌥M' : '⌃⌥M',
        type: 'vertical',
        disabled: false
      },
      {
        icon: 'iconfont iconxiaduiqi',
        text: '下对齐',
        key: IS_MAC ? '⌘⌥B' : '⌃⌥B',
        type: 'down',
        disabled: false
      }
    ]
  },
  {
    icon: 'iconfont iconfenbu',
    text: '分布',
    type: 'layout',
    disabled: false,
    children: [
      {
        icon: 'iconfont iconshuipingfenbu',
        text: '水平分布',
        key: IS_MAC ? '⌘⇧H' : '⌃⇧H',
        type: 'layoutHorizontal',
        disabled: false
      },
      {
        icon: 'iconfont iconchuizhifenbu',
        text: '垂直分布',
        key: IS_MAC ? '⌘⇧U' : '⌃⇧U',
        type: 'layoutVertical',
        disabled: false
      }
    ]
  }
];
