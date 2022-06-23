import { KonvaEventObject } from 'konva/types/Node';
import Konva from 'konva';
import store from '@/store';
import {
  GUIDELINE_OFFSET,
  GUIDELINE_MORE_LENGTH
} from '../constants/variable.constant';

/**
 * 导航线（辅助线）服务
 * 拖拽选中cell时会出现的帮助对齐的虚线条，并强制位移cell以对齐
 */
export class DragGuideService {
  stage: any = null;
  layer: any = null; // 辅助layer

  get scale() {
    const zoom = store.state.zoomService;
    return zoom ? zoom.scale : 1;
  }
  get shapeList(): Record<string, any>[] {
    return store.state.content.shapeList;
  }
  get currentCells(): any[] {
    return store.state.currentCells || [];
  }
  get currentBoxs(): any[] {
    return this.currentCells
      .map((cell) => {
        const node = this.stage.findOne(`#${cell.id}`);
        return node && { ...node.getClientRect(), cell };
      })
      .filter((box) => !!box);
  }

  init(stage: any, layer: any) {
    this.stage = stage.getStage();
    this.layer = layer.getNode();
  }

  draw(e: KonvaEventObject<DragEvent>) {
    // 清除屏幕上的所有先前的导航线
    this.remove();
    // 查找所有的导航线
    const lineGuideStops = this.getLineGuideStops(e.target.attrs.id);
    // 查找当前对象的捕捉点
    const itemBounds = this.getObjectSnappingEdges(e.target);
    // 现在找到哪些是可以捕捉的对象
    const guides = this.getGuides(lineGuideStops, itemBounds);
    // 没有的话不做任何事
    if (!guides.length) return;
    // 画出所有导航线
    this.drawGuides(guides);
    // 强制移动对象位置
    this.forceAdjust(guides, e);
  }
  remove() {
    // 清除屏幕上的所有先前的导航线
    this.layer.find('.guid-line').destroy();
    this.layer.batchDraw();
  }

  // 可以捕获哪些物体？
  getLineGuideStops(skipShapeId: string) {
    const { stage, shapeList } = this;
    // box这里存下去为了最后计算辅助线的长度
    const getBox = (x: number, y: number, width: number, height: number) => {
      const box = { x, y, width, height };
      return {
        horizontal: [
          { value: x, box },
          { value: x + width / 2, box },
          { value: x + width, box }
        ],
        vertical: [
          { value: y, box },
          { value: y + height / 2, box },
          { value: y + height, box }
        ]
      };
    };
    // 可以捕捉到舞台边界和舞台中心
    const stageBox = getBox(0, 0, stage.width(), stage.height());
    const vertical = [...stageBox.vertical];
    const horizontal = [...stageBox.horizontal];

    // 然后可以捕捉画布上每个对象的边缘和中心
    shapeList
      .filter((i) => !this.currentCells.some((cell) => cell.id === i.id))
      .map((i) => {
        // 这里需要使用id,name可能不唯一
        const guideItem = stage.findOne(`#${i.id}`);
        const box = guideItem.getClientRect();
        // 可以捕捉到形状的所有边缘
        const shapeBox = getBox(box.x, box.y, box.width, box.height);
        vertical.push(...shapeBox.vertical);
        horizontal.push(...shapeBox.horizontal);
      });
    return {
      vertical: vertical.flat(),
      horizontal: horizontal.flat()
    };
  }
  // 对象的哪些点将触发捕捉？它可以只是对象的中心, 但这里启用所有边缘和中心
  getObjectSnappingEdges(node: any) {
    const getHorizontal = (box: any) => {
      return [
        {
          guide: box.x,
          offset: node.x() - box.x,
          snap: 'start',
          box
        },
        {
          guide: box.x + box.width / 2,
          offset: node.x() - box.x - box.width / 2,
          snap: 'center',
          box
        },
        {
          guide: box.x + box.width,
          offset: node.x() - box.x - box.width,
          snap: 'end',
          box
        }
      ];
    };
    const getVertical = (box: any) => {
      return [
        {
          guide: box.y,
          offset: node.y() - box.y,
          snap: 'start',
          box
        },
        {
          guide: box.y + box.height / 2,
          offset: node.y() - box.y - box.height / 2,
          snap: 'center',
          box
        },
        {
          guide: box.y + box.height,
          offset: node.y() - box.y - box.height,
          snap: 'end',
          box
        }
      ];
    };
    const horizontal: any[] = [];
    const vertical: any[] = [];
    this.currentBoxs.map((box) => {
      horizontal.push(...getHorizontal(box));
      vertical.push(...getVertical(box));
    });
    return { horizontal, vertical };
  }
  // 找到所有导航线
  getGuides(lineGuideStops: any, itemBounds: any) {
    const resultV: any[] = [];
    const resultH: any[] = [];
    const OFFSET = GUIDELINE_OFFSET; // 这个最好写死，不根据scale的变化而变化

    lineGuideStops.vertical.forEach((lineGuide: any) => {
      itemBounds.vertical.forEach((itemBound: any, index: number) => {
        const diff = lineGuide.value - itemBound.guide;
        // 如果导航线和对象捕捉点之间的距离很近，可以考虑将其捕捉
        if (Math.abs(diff) < OFFSET) {
          resultV.push({
            lineGuide: lineGuide.value,
            itemGuide: itemBound.guide,
            box: lineGuide.box,
            itemBox: itemBound.box,
            diff: diff,
            snap: itemBound.snap,
            offset: itemBound.offset
          });
        }
      });
    });

    lineGuideStops.horizontal.forEach((lineGuide: any) => {
      itemBounds.horizontal.forEach((itemBound: any) => {
        const diff = lineGuide.value - itemBound.guide;
        if (Math.abs(diff) < OFFSET) {
          resultH.push({
            lineGuide: lineGuide.value,
            itemGuide: itemBound.guide,
            box: lineGuide.box,
            itemBox: itemBound.box,
            diff: diff,
            snap: itemBound.snap,
            offset: itemBound.offset
          });
        }
      });
    });

    const guides = [];

    // 找到最接近的导航线
    const minV = resultV.sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff))[0];
    const minH = resultH.sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff))[0];
    if (minV) {
      guides.push({
        lineGuide: minV.lineGuide,
        itemGuide: minV.itemGuide,
        box: minV.box,
        diff: minV.diff,
        itemBox: minV.itemBox,
        offset: minV.offset,
        orientation: 'V',
        snap: minV.snap
      });
    }
    if (minH) {
      guides.push({
        lineGuide: minH.lineGuide,
        itemGuide: minH.itemGuide,
        box: minH.box,
        diff: minH.diff,
        itemBox: minH.itemBox,
        offset: minH.offset,
        orientation: 'H',
        snap: minH.snap
      });
    }
    return guides;
  }
  drawGuides(guides: any[]) {
    const { layer, scale } = this;
    guides.forEach((lg) => {
      if (lg.orientation === 'V') {
        const left = Math.min(lg.box.x, lg.itemBox.x) - GUIDELINE_MORE_LENGTH;
        const right =
          Math.max(lg.box.x + lg.box.width, lg.itemBox.x + lg.itemBox.width) +
          GUIDELINE_MORE_LENGTH;
        const line = new Konva.Line({
          points: [left, lg.lineGuide, right, lg.lineGuide].map(
            (i) => i / scale
          ),
          stroke: '#E05F68',
          strokeWidth: 1,
          name: 'guid-line',
          dash: [5 / this.scale, 5 / this.scale]
        });
        layer.add(line);
        layer.batchDraw();
      } else if (lg.orientation === 'H') {
        const top = Math.min(lg.box.y, lg.itemBox.y) - GUIDELINE_MORE_LENGTH;
        const bottom =
          Math.max(lg.box.y + lg.box.height, lg.itemBox.y + lg.itemBox.height) +
          GUIDELINE_MORE_LENGTH;
        const line = new Konva.Line({
          points: [lg.lineGuide, top, lg.lineGuide, bottom].map(
            (i) => i / scale
          ),
          stroke: '#E05F68',
          strokeWidth: 1,
          name: 'guid-line',
          dash: [5 / this.scale, 5 / this.scale]
        });
        layer.add(line);
        layer.batchDraw();
      }
    });
  }
  // 强制位移
  forceAdjust(guides: any[], e: KonvaEventObject<DragEvent>) {
    guides.forEach((lg) => {
      // 多选时需要改变全部cell的x.y值
      const verticalAdjust = () => {
        this.currentCells.forEach((cell) => {
          cell.y += lg.diff;
        });
        e.target.y(lg.lineGuide + lg.offset);
      };
      const horizontalAdjust = () => {
        this.currentCells.forEach((cell) => {
          cell.x += lg.diff;
        });
        e.target.x(lg.lineGuide + lg.offset);
      };
      switch (lg.snap) {
        case 'start': {
          switch (lg.orientation) {
            case 'V': {
              verticalAdjust();
              break;
            }
            case 'H': {
              horizontalAdjust();
              break;
            }
          }
          break;
        }
        case 'center': {
          switch (lg.orientation) {
            case 'V': {
              verticalAdjust();
              break;
            }
            case 'H': {
              horizontalAdjust();
              break;
            }
          }
          break;
        }
        case 'end': {
          switch (lg.orientation) {
            case 'V': {
              verticalAdjust();
              break;
            }
            case 'H': {
              horizontalAdjust();
              break;
            }
          }
          break;
        }
      }
    });
  }
}
