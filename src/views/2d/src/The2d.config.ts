import { ZoomService } from './services/zoom';
import { StageData, StageDataContent } from './utils/2d.dto';
import { Component } from 'vue-property-decorator';
import ViewFactory from '@/core/factory/view.factory';
import { COMPONENT_METHOD, COMPONENT_DATA } from '@/core/dtos/factories.dto.ts';
import { getImageObjAsync } from './utils/2d.util';
import { The2dApi } from './The2d.api';
import { State } from 'vuex-class';
import { RecordService } from './services';
import { DEFAULT_STAGE_CONTENT } from './constants/value.constant';
import { BASE_WIDTH, BASE_HEIGHT } from './constants/variable.constant';
import { TheVisualDesignApi } from '@/views/configuration/visual-design/src/TheVisualDesign.api';

@Component({})
export class The2dConfig extends ViewFactory {
  COMPONENT_METHOD = COMPONENT_METHOD;
  COMPONENT_DATA = COMPONENT_DATA;

  @State('content') Content!: StageDataContent;
  @State('zoomService') zoomService!: ZoomService;
  @State('layer') layer: any;

  recordService = new RecordService(); // 记录功能

  mounted() {
    this.$store.commit('setRecordService', this.recordService);
    this.getData();
  }
  beforeDestroy() {
    this.$store.commit('reset2d');
  }

  loading = false;
  stageData: Partial<StageData> = {};
  get id() {
    return this.$route.params.id;
  }
  get isTemplate() {
    return this.$route.path.includes('2d-template');
  }
  /**
   * 获取数据
   */
  async getData() {
    this.loading = true;
    const res = this.isTemplate
      ? await TheVisualDesignApi.template({ id: this.id })
      : await The2dApi.getById({ id: this.id });
    if (!res) return;
    _.assign(this.stageData, res, {
      content: res.content ? res.content : JSON.stringify(DEFAULT_STAGE_CONTENT)
    });
    this.contentInit();
  }
  /**
   * 初始化content数据
   */
  async contentInit() {
    let content = JSON.parse(this.stageData.content || '{}');
    if (!_.isObject(content)) {
      content = {};
    }
    this.Content.canvas = {
      width: BASE_WIDTH,
      height: BASE_HEIGHT,
      ...content.canvas
    };
    // 初始化content的内容
    (content.shapeList || []).length &&
      (await Promise.all(
        content.shapeList.map(async (shape: any) => {
          // Image对象不会被保存，需要重新赋值,并且加载完成后重绘layer
          // 图片加载出错，不能使其加入画布中，会导致严重的渲染错误问题
          // 并且onerror中处理也赶不及，所以需要确认image load之后才能push到shapeList中
          if (shape.type === 'image') {
            try {
              shape.image = await getImageObjAsync(shape.imageSrc);
              this.Content.shapeList.push(shape);
              this.layer.getNode().draw();
              // 加载失败
            } catch (error) {}
          } else {
            this.Content.shapeList.push(shape);
          }
        })
      ));
    this.loading = false;
    // 因为异步的原因shapeList里的shape顺序与stageData里的不一致，会导致进入就会认为已编辑
    // 所以这里再把stageData的shapeList反过来赋值一遍
    this.stageData.content = JSON.stringify(this.Content);
    this.$store.commit('setStageData', this.stageData);
    // 图片都全部push后才能添加记录，不然撤销后因为add时图片还未被push进去图片会消失
    this.recordService.add();
    // 渲染完成后计算缩放比例
    this.$nextTick(() => this.zoomService.computedZoomValue());
  }
}
