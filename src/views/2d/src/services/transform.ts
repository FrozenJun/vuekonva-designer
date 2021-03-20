import { KonvaEventObject } from 'konva/types/Node';
import { Vue } from 'vue-property-decorator';
import store from '@/store';

/**
 * 转换功能
 * 选中图片，圆形，方形。文本等非线段cell时，出现的帮助转换的transformer
 */
export class TransformService {
  $refs!: any;

  enabledAnchors = [
    'top-left',
    'top-center',
    'top-right',
    'middle-right',
    'middle-left',
    'bottom-left',
    'bottom-center',
    'bottom-right'
  ];

  get refs(): any[] {
    return (this.$refs && this.$refs.transformer) || [];
  }
  get layer() {
    return store.state.layer.getNode();
  }
  get selectedShapeIds(): any[] {
    return this.currentCells
      .filter((i: any) => i.type !== 'arrow')
      .map((i: any) => i.id);
  }
  get currentCells(): any[] {
    return store.state.currentCells || [];
  }
  get shapeList() {
    return store.state.content.shapeList;
  }
  get recordService() {
    return store.state.recordService;
  }
  get anchorPointsService() {
    return store.state.anchorPointsService;
  }
  get transformerConfig() {
    return {
      borderDash: [5, 5],
      borderStroke: '#666666',
      anchorStrokeWidth: 1,
      anchorStroke: '#008CEA',
      anchorSize: 7,
      rotateAnchorOffset: 15,
      enabledAnchors: this.enabledAnchors,
      rotateEnabled: true
    };
  }

  transform(e: KonvaEventObject<MouseEvent>, item: any) {
    const node = e.currentTarget;
    item.rotation = node.rotation();
    // 文本，方形拉伸时不是改变scale,而是对应改变宽和高
    if (
      item.type === 'text' ||
      item.type === 'textarea' ||
      item.type === 'rect'
    ) {
      item.width = Math.round(node.width() * node.scaleX());
      node.width(item.width);
      item.height = Math.round(node.height() * node.scaleY());
      node.height(item.height);
      item.scaleX = 1;
      node.scaleX(1);
      item.scaleY = 1;
      node.scaleY(1);
    } else {
      item.scaleX = node.scaleX();
      item.scaleY = node.scaleY();
    }
  }
  transformEnd() {
    this.recordService.add();
  }

  initRef(refs: any) {
    this.$refs = refs;
  }

  /**
   * 连接或者分离Transformer Node
   * 当前选择改变时的回调
   */
  update(currentCells?: any[]) {
    this.detach();
    const cells: any[] = currentCells || this.currentCells;
    if (cells && cells.length) {
      cells
        .filter((i) => i.type !== 'arrow')
        .forEach((cell, index) => {
          const transformerNode = this.refs[index].getStage();
          const stage = transformerNode.getStage();
          const selectedNode = stage.findOne('#' + cell.id);
          // 如果选择的node早已经被连接，直接return
          if (selectedNode === transformerNode.node()) {
            return;
          }

          if (selectedNode && selectedNode.nodeType !== 'Layer') {
            // 连接另一个node
            transformerNode.attachTo(selectedNode);
          } else {
            // 取消连接
            transformerNode.detach();
          }
          transformerNode.getLayer().batchDraw();
        });
    }
  }
  isMoving(isMoving = false) {
    this.refs.forEach((ref, index) => {
      const transformerNode = ref.getStage();
      transformerNode.detach();
      const node = this.refs[index].getStage();
      node.enabledAnchors(isMoving ? [] : this.enabledAnchors);
      node.rotateEnabled(!isMoving);
    });
    this.update();
  }
  detach() {
    this.refs.forEach((ref) => {
      const transformerNode = ref.getStage();
      transformerNode.detach();
    });
    Vue.nextTick(() => this.layer.draw());
  }
  // 强制更新,当因为顺序改变导致transformer显示错误时调用
  forceUpdate() {
    this.detach();
    Vue.nextTick(() => {
      this.update();
      this.layer.batchDraw();
    });
  }
}
