import {
  ZoomService,
  RecordService,
  TransformService,
  FontService,
  DragGuideService,
  AnchorPointsService,
  FormatBrushService,
  GroupService
} from '@/views/common/2d/src/services';
import _ from 'lodash';
import { AlignSortService } from '@/views/common/2d/src/services/align-sort';
import { DEFAULT_STAGE_CONTENT } from '@/views/common/2d/src/constants/value.constant';

const Canvas2D = {
  state: {
    // 保存画布的实时内容
    content: _.cloneDeep(DEFAULT_STAGE_CONTENT),
    // 接口返回的2d数据
    stageData: {},
    currentCells: [], // 当前选中的元件列表
    layer: {},
    stage: {},
    zoomService: {},
    recordService: {},
    transformService: {},
    fontService: {},
    dragGuideService: {},
    anchorPointsService: {},
    formatBrushService: {},
    alignSortService: {},
    groupService: {}
  },
  mutations: {
    setCurrentCells(state: Record<string, any>, cells: any[]) {
      state.currentCells = cells;
    },
    setZoomService(state: Record<string, any>, zoomService: ZoomService) {
      state.zoomService = zoomService;
    },
    setRecordService(state: Record<string, any>, recordService: RecordService) {
      state.recordService = recordService;
    },
    setTransformService(
      state: Record<string, any>,
      transformService: TransformService
    ) {
      state.transformService = transformService;
    },
    setFontService(state: Record<string, any>, fontService: FontService) {
      state.fontService = fontService;
    },
    setDragGuideService(
      state: Record<string, any>,
      dragGuideService: DragGuideService
    ) {
      state.dragGuideService = dragGuideService;
    },
    setAnchorPointsService(
      state: Record<string, any>,
      anchorPointsService: AnchorPointsService
    ) {
      state.anchorPointsService = anchorPointsService;
    },
    setFormatBrushService(
      state: Record<string, any>,
      formatBrushService: FormatBrushService
    ) {
      state.formatBrushService = formatBrushService;
    },
    setAlignSortService(
      state: Record<string, any>,
      alignSortService: AlignSortService
    ) {
      state.alignSortService = alignSortService;
    },
    setGroupService(state: Record<string, any>, groupService: GroupService) {
      state.groupService = groupService;
    },
    setLayer(state: Record<string, any>, layer: any) {
      state.layer = layer;
    },
    setStage(state: Record<string, any>, stage: any) {
      state.stage = stage;
    },
    setStageData(state: Record<string, any>, stageData: any) {
      state.stageData = stageData;
    },
    reset2d(state: Record<string, any>) {
      state.currentCells = [];
      state.content = _.cloneDeep(DEFAULT_STAGE_CONTENT);
      state.stageData = {};
      state.stage = {};
      state.layer = {};
      state.zoomService = {};
      state.recordService = {};
      state.transformService = {};
      state.fontService = {};
      state.dragGuideService = {};
      state.anchorPointsService = {};
      state.formatBrushService = {};
      state.alignSortService = {};
    }
  }
};

export default Canvas2D;
