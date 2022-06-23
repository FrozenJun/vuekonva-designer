import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import UIComponentFactory from '@/core/factory/component-ui.factory';
import { COMPONENT_METHOD, COMPONENT_DATA } from '@/core/dtos/factories.dto.ts';
import { State } from 'vuex-class';
import {
  ZoomService,
  TransformService,
  FontService,
  DragGuideService,
  AnchorPointsService,
  RecordService,
  MulitpleChoiceService,
  FormatBrushService,
  GroupService
} from '../../services';
import { StageDataContent } from '../../utils/2d.dto';
import { KonvaEventObject } from 'konva/types/Node';
import { AlignSortService } from '../../services/align-sort';
import {
  VERTICAL_BLANK,
  HORIZONTAL_BLANK,
  IS_MAC
} from '../../constants/variable.constant';

@Component({})
export class BsCanvasConfig extends UIComponentFactory {
  COMPONENT_METHOD = COMPONENT_METHOD;
  COMPONENT_DATA = COMPONENT_DATA;
  VERTICAL_BLANK = VERTICAL_BLANK;
  HORIZONTAL_BLANK = HORIZONTAL_BLANK;

  @Prop({ type: Boolean }) loading!: boolean;

  @State('content') Content!: StageDataContent;
  @State('recordService') recordService!: RecordService;
  @State('currentCells') currentCells!: any[]; // 当前选择的cell
  @Watch('currentCells', { immediate: true })
  async onCurrentCellsChange(cells: any[] = []) {
    // 如果用户已选择格式刷的本体cell，并且cells存在，这次的cells change应该视为格式刷操作，而不是选择cell
    if (this.formatBrushService.selectCell && cells.length)
      return this.formatBrushService.format();
    this.$nextTick(() => this.transformService.update(cells));
    this.anchorPointsService.currentCellsChange(cells);
    this.fontService.currentCellsChange(cells);
  }

  zoomService = new ZoomService(); // 画布放大缩小功能
  transformService = new TransformService(); // 图片图标转变功能
  fontService = new FontService(); // 字体功能
  dragGuideService = new DragGuideService(); // 辅助线功能
  anchorPointsService = new AnchorPointsService(); // 直线描点功能
  mulitpleChoiceService = new MulitpleChoiceService(); // 多选功能
  formatBrushService = new FormatBrushService(); // 格式刷功能
  alignSortService = new AlignSortService(); // 格式刷功能
  groupService = new GroupService(); // 组合，打散功能

  get shapeList() {
    return this.Content.shapeList || [];
  }
  get transformerCells() {
    // 除去线段
    return this.Content.shapeList.filter((cell) => cell.type !== 'arrow');
  }
  get containerStyle() {
    return {
      ...this.zoomService.containerSize,
      background: this.Content.canvas.background
    };
  }

  mounted() {
    this.$store.commit('setLayer', this.$refs.layer);
    this.$store.commit('setStage', this.$refs.stage);
    this.$store.commit('setZoomService', this.zoomService);
    this.$store.commit('setTransformService', this.transformService);
    this.$store.commit('setFontService', this.fontService);
    this.$store.commit('setDragGuideService', this.dragGuideService);
    this.$store.commit('setAnchorPointsService', this.anchorPointsService);
    this.$store.commit('setFormatBrushService', this.formatBrushService);
    this.$store.commit('setAlignSortService', this.alignSortService);
    this.$store.commit('setGroupService', this.groupService);
    this.zoomService.init(this.$refs.canvas);
    this.transformService.initRef(this.$refs);
    this.dragGuideService.init(this.$refs.stage, this.$refs.helpLayer);
  }
  beforeDestroy() {
    this.zoomService.removeListener();
  }

  /**
   * 在stage上的点击操作
   */
  onStageMouseDown(e: KonvaEventObject<MouseEvent>) {
    if (e.target === e.target.getStage()) {
      // 点击在空白的画布时清空所有选中的cell
      this.$store.commit('setCurrentCells', []);
      // 开始多选
      this.mulitpleChoiceService.start(e);
    }
  }
  onStageMouseMove(e: KonvaEventObject<MouseEvent>) {
    this.mulitpleChoiceService.moving(e);
  }
  onStageMouseUp() {
    this.mulitpleChoiceService.end();
  }
  onStageMouseLeave() {
    this.mulitpleChoiceService.end();
  }

  /**
   * 选择当前的cell
   * @param item 当前点击的cell图形
   */
  shapeMousedown(e: KonvaEventObject<MouseEvent>, item: any) {
    const isSelected = this.currentCells.some((cell) => cell.id === item.id);
    if (IS_MAC ? e.evt.metaKey : e.evt.ctrlKey) {
      // ctrl 或者 command被按住时，添加该cell,再次点击取消该cell
      const cells = isSelected
        ? this.currentCells.filter((cell) => cell.id !== item.id)
        : [...this.currentCells, item];
      this.$store.commit('setCurrentCells', cells);
    } else {
      if (isSelected) return;
      this.$store.commit('setCurrentCells', [item]);
    }
  }

  /**
   * 画布中的元素拖拽操作
   */
  shapeDragStart() {
    // 开始移动时删除锚点或者transform
    this.anchorPointsService.remove();
    this.transformService.isMoving(true);
  }
  shapeDragMove(e: KonvaEventObject<DragEvent>, item: any) {
    // 拖拽默认改的是x,y
    const diffX = Math.round(e.currentTarget.x()) - item.x;
    const diffY = Math.round(e.currentTarget.y()) - item.y;
    this.currentCells.forEach((cell) => {
      cell.x += diffX;
      cell.y += diffY;
    });
    // 启用辅助线服务
    _.throttle((e) => this.dragGuideService.draw(e), 200)(e);
  }
  shapeDragEnd() {
    // 结束移动时重绘锚点 & transform
    this.anchorPointsService.update();
    this.transformService.isMoving(false);
    this.recordService.add();
    this.dragGuideService.remove();
  }

  /**
   * 直线，折线锚点功能
   */
  anchorRectDragmove(e: KonvaEventObject<DragEvent>, anchor: any) {
    this.anchorPointsService.rectDragmove(e, anchor);
  }
  anchorCircleDragmove(e: KonvaEventObject<DragEvent>, anchor: any) {
    this.anchorPointsService.cirDragmove(e, anchor);
  }
  anchorDragend() {
    this.anchorPointsService.dragend();
  }
  anchorMouseover(anchor: any) {
    this.anchorPointsService.mouseover(anchor);
  }
  anchorMousedown(anchor: any) {
    this.anchorPointsService.mousedown(anchor);
  }
  anchorMouseout() {
    this.anchorPointsService.mouseout();
  }

  /**
   * 鼠标经过各个区域形状改为可移动
   */
  shapeMouseover() {
    document.body.style.cursor = 'move';
  }
  shapeMouseout() {
    document.body.style.cursor = 'default';
  }

  /**
   * transform功能
   */
  transform(e: KonvaEventObject<MouseEvent>, item: any) {
    this.transformService.transform(e, item);
  }
  transformEnd() {
    this.transformService.transformEnd();
  }

  // 监听按键事件，并阻止向上传播，防止删除，后退，前后左右等影响页面的按键被用户无意识按下
  onKeydown(e: KeyboardEvent) {
    e.stopPropagation();
  }

  $refs!: {
    canvas: Element;
    stage: any;
    layer: any;
    helpLayer: any;
    transformer: Vue[];
  };
}
