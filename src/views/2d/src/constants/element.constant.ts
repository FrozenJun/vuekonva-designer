import lineImg from '@/assets/images/line.png';
import polylineImg from '@/assets/images/polyline.png';
import textImg from '@/assets/images/text.png';
import textareaImg from '@/assets/images/textarea.png';
import circleImg from '@/assets/images/circle.png';
import rectImg from '@/assets/images/rect.png';
import { ArrowConfig } from 'konva/types/shapes/Arrow';

/**
 * 左侧的tabs配置
 */
export const CELL_TABS = [
  { icon: 'iconfont iconleixing', text: '基础库' },
  { icon: 'iconfont iconsucai', text: '标准库' },
  { icon: 'iconfont iconzidingyi', text: '自定义' }
];

/**
 * CELL - 左侧拖动元素的基础cell
 * 当时组件取名element.vue,这里文件名与之对应
 * 因为是存数据的模板，所以赋值的时候需要深拷贝
 */
export const LINE_CELL: ArrowConfig & Record<string, any> = {
  id: '',
  name: '直线',
  img: lineImg,
  type: 'arrow',
  tab: 'attr',
  points: [0, 0, 100, 100],
  x: 0,
  y: 0,
  draggable: true,
  stroke: '#000',
  fill: '#000',
  strokeWidth: 1,
  hitStrokeWidth: 20,
  shadowColor: 'transparent',
  shadowBlur: 0,
  lineCap: 'round',
  lineJoin: 'round',
  dashEnabled: false,
  dash: [30, 10],
  scaleX: 1,
  scaleY: 1,
  rotation: 0,
  pointerWidth: 0,
  pointerLength: 0,
  pointerAtBeginning: false,
  binds: {
    model: '',
    device: '',
    warnType: null,
    warn: null
  }
};

export const IMAGE_CELL: Record<string, any> = {
  id: '',
  name: '设备',
  type: 'image',
  tab: 'attr',
  img: null,
  image: null,
  imageSrc: '', // 保存后Image对象无法保存下来，这个src用于Image对象的初始化
  x: 0,
  y: 0,
  draggable: true,
  stroke: 'transparent',
  fill: 'transparent',
  strokeWidth: 0,
  hitStrokeWidth: 10,
  shadowColor: 'transparent',
  shadowBlur: 0,
  lineCap: 'round',
  lineJoin: 'round',
  dashEnabled: false,
  dash: [30, 10],
  scaleX: 1,
  scaleY: 1,
  rotation: 0,
  width: 30,
  height: 30,
  offsetX: 15,
  offsetY: 15,
  binds: {
    linkTitle: '',
    linkUrl: '',
    model: '',
    device: '',
    warnType: null,
    warnColor: '#FE2C19'
  }
};

export const TEXT_CELL: Record<string, any> = {
  id: '',
  name: '文本',
  type: 'text',
  tab: 'attr',
  img: textImg,
  x: 0,
  y: 0,
  text: '',
  fontSize: 16,
  fontFamily: '微软雅黑',
  fontStyle: 'normal',
  textDecoration: 'empty',
  align: 'left',
  verticalAlign: 'middle',
  width: 150,
  height: 40,
  offsetX: 75,
  offsetY: 20,
  draggable: true,
  lineHeight: 1,
  stroke: 'transparent',
  fill: '#000',
  strokeWidth: 0,
  hitStrokeWidth: 10,
  lineCap: 'round',
  lineJoin: 'round',
  dashEnabled: false,
  dash: [30, 10],
  scaleX: 1,
  scaleY: 1,
  rotation: 0,
  padding: 10
};

export const TEXTAREA_CELL: Record<string, any> = {
  id: '',
  name: '多行文本',
  type: 'textarea',
  tab: 'attr',
  img: textareaImg,
  x: 0,
  y: 0,
  text: '',
  fontSize: 16,
  fontFamily: '微软雅黑',
  fontStyle: 'normal',
  textDecoration: 'empty',
  align: 'left',
  verticalAlign: 'top',
  width: 150,
  height: 80,
  offsetX: 75,
  offsetY: 40,
  draggable: true,
  lineHeight: 1,
  stroke: 'transparent',
  fill: '#000',
  strokeWidth: 0,
  hitStrokeWidth: 10,
  lineCap: 'round',
  lineJoin: 'round',
  dashEnabled: false,
  dash: [30, 10],
  scaleX: 1,
  scaleY: 1,
  rotation: 0,
  padding: 10
};

export const POLYLINE_CELL: ArrowConfig & Record<string, any> = {
  id: '',
  name: '折线',
  img: polylineImg,
  type: 'arrow',
  tab: 'attr',
  polylinePoints: 1, // 折点数
  points: [0, 0, 50, 50, 100, 100],
  x: 0,
  y: 0,
  draggable: true,
  stroke: '#000',
  fill: '#000',
  strokeWidth: 1,
  hitStrokeWidth: 20,
  lineCap: 'butt',
  lineJoin: 'miter',
  dashEnabled: false,
  dash: [30, 10],
  scaleX: 1,
  scaleY: 1,
  rotation: 0,
  pointerWidth: 0,
  pointerLength: 0,
  pointerAtBeginning: false,
  binds: {
    model: '',
    device: '',
    warnType: null,
    warn: null,
    warnColor: '#FE2C19'
  }
};

export const CIRCLE_CELL: Record<string, any> = {
  id: '',
  name: '圆形',
  img: circleImg,
  type: 'circle',
  tab: 'attr',
  radius: 50,
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  offsetX: 50,
  offsetY: 50,
  draggable: true,
  stroke: '#000',
  fill: 'rgba(255, 255, 255, 0)',
  strokeWidth: 1,
  hitStrokeWidth: 20,
  lineCap: 'butt',
  lineJoin: 'miter',
  dashEnabled: false,
  dash: [30, 10],
  scaleX: 1,
  scaleY: 1,
  rotation: 0
};

export const RECT_CELL: Record<string, any> = {
  id: '',
  name: '方形',
  img: rectImg,
  type: 'rect',
  tab: 'attr',
  cornerRadius: 0,
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  offsetX: 50,
  offsetY: 50,
  draggable: true,
  stroke: '#000',
  fill: 'rgba(255, 255, 255, 0)',
  strokeWidth: 1,
  hitStrokeWidth: 20,
  lineCap: 'butt',
  lineJoin: 'miter',
  dashEnabled: false,
  dash: [30, 10],
  scaleX: 1,
  scaleY: 1,
  rotation: 0,
  pointerWidth: 0,
  pointerLength: 0,
  pointerAtBeginning: false
};

export const GROUP_CELL: Record<string, any> = {
  id: '',
  name: '组',
  type: 'group',
  members: [],
  offsetX: 0,
  offsetY: 0,
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  scaleX: 1,
  scaleY: 1,
  rotation: 0
};
