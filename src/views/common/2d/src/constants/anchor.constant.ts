import { RectConfig } from 'konva/types/shapes/Rect';
import { ANCHOR_RECT_OFFSET, ANCHOR_CIRCLE_OFFSET } from './variable.constant';
import { CircleConfig } from 'konva/types/shapes/Circle';

/**
 * ANCHORS 描点基础config
 */
export const RECT_ANCHOR: RectConfig & { [k: string]: any } = {
  id: '',
  x: 0,
  y: 0,
  type: 'rect-anchor',
  width: ANCHOR_RECT_OFFSET * 2,
  height: ANCHOR_RECT_OFFSET * 2,
  stroke: '#068FEB',
  strokeWidth: 1,
  hitStrokeWidth: 20,
  draggable: true,
  fill: '#FFF',
  bindCell: null
};

export const CIRCLE_ANCHOR: CircleConfig & { [k: string]: any } = {
  id: '',
  x: 0,
  y: 0,
  type: 'circle-anchor',
  radius: ANCHOR_CIRCLE_OFFSET,
  stroke: '#068FEB',
  strokeWidth: 1,
  hitStrokeWidth: 20,
  draggable: true,
  fill: '#92D25C',
  bindCell: null
};
