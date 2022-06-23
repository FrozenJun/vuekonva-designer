export const IS_MAC = navigator.platform.indexOf('Mac') > -1;
export const IS_WIN = navigator.platform.indexOf('Win') > -1;

export const BASE_WIDTH = 800; // 初始化画布宽度
export const BASE_HEIGHT = 600; // 初始化画布高度

export const MAX_SCALE = 300; // 画布缩放最大值(%)
export const MIN_SCALE = 10; // 画布缩放最小值(%)

export const HORIZONTAL_BLANK = 100; // 画布与容器水平留白100px
export const VERTICAL_BLANK = 60; //  画布与容器垂直留白60px

export const IMAGE_MAX_WIDTH = 48; // 拖拽图片展示的最大宽度
export const IMAGE_MAX_HEIGHT = 48; // 拖拽图片展示的最大高度
export const IMAGE_MIN_WIDTH = 48; // 拖拽图片展示的最小宽度
export const IMAGE_MIN_HEIGHT = 48; // 拖拽图片展示的最小高度

export const GUIDELINE_OFFSET = 3; // 对象捕捉指南偏移量
export const GUIDELINE_MORE_LENGTH = 20; // 对象辅助线两端增加的长度

export const PASTE_X_OFFSET = 20; // 每次粘贴时x的位移
export const PASTE_Y_OFFSET = 20; // 每次粘贴时y的位移

export const RECORDS_MAX_LENGTH = 100; // 记录功能最大记录操作

export const ANCHOR_RECT_OFFSET = 4; // 方形锚点中心点距四边的距离
export const ANCHOR_CIRCLE_OFFSET = 4; // 圆形锚点半径
export const ANCHOR_LINE_OFFSET = 5; // 锚点拖动时线段水平或者垂直更正偏移量
