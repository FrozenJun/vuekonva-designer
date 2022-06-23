import { CompFormDialogAdapter } from './../../../../../../core/components/customize/form-dialog/src/CompFormDialog.adapter';
import { State } from 'vuex-class';
import { Component, Watch } from 'vue-property-decorator';
import UIComponentFactory from '@/core/factory/component-ui.factory';
import { COMPONENT_METHOD, COMPONENT_DATA } from '@/core/dtos/factories.dto';
import { CompDialogAdapter } from '@/core/components/customize/dialog/src/CompDialog.adapter';
import { StageDataContent, StageData } from '../../utils/2d.dto';
import { The2dApi } from '../../The2d.api';
import {
  RecordService,
  ZoomService,
  TransformService,
  AnchorPointsService,
  FormatBrushService
} from '../../services';
import { FormItem } from '@/core/decorators/form-item.decorator';
import {
  LAYOUT_MENU,
  ALIGN_MENU,
  SORT_MENU
} from '../../constants/align-sort.contant';
import { AlignSortService } from '../../services/align-sort';

@Component({})
export class BsHeaderConfig extends UIComponentFactory {
  COMPONENT_METHOD = COMPONENT_METHOD;
  COMPONENT_DATA = COMPONENT_DATA;
  LAYOUT_MENU = LAYOUT_MENU;
  ALIGN_MENU = ALIGN_MENU;
  SORT_MENU = SORT_MENU;

  isPublishByUser = false; // 用户手动点了发布
  get isTemplate() {
    return this.$route.path.includes('2d-template');
  }

  @FormItem('searchDialog.form') search: any;

  @State('zoomService') zoomService!: ZoomService; // 缩放功能
  @State('recordService') recordService!: RecordService; // 记录功能
  @State('anchorPointsService') anchorPointsService!: AnchorPointsService; // 锚点功能
  @State('transformService') transformService!: TransformService; // 转变功能
  @State('formatBrushService') formatBrushService!: FormatBrushService; // 格式刷功能
  @State('alignSortService') alignSortService!: AlignSortService; // 分布对齐顺序功能
  @State('layer') layer: any;
  @State('content') Content!: StageDataContent;
  @State('stageData') StageData?: StageData;
  @State('currentCells') currentCells!: any[];

  @Watch('currentCells', { immediate: true })
  async onCurrentCellsChange(cells: any[] = []) {
    this.searchModel = cells.map((i) => i.id);
  }

  mounted() {
    this.autoSave();
  }
  beforeDestroy() {
    this.autoSaveInterval && clearInterval(this.autoSaveInterval);
  }

  // 监听按键事件，并阻止向上传播，防止删除，后退，前后左右等影响页面的按键被用户无意识按下
  onKeydown(e: KeyboardEvent) {
    e.stopPropagation();
  }

  /**
   * 缩放按钮
   */
  add() {
    this.zoomService.add();
  }
  reduce() {
    this.zoomService.reduce();
  }

  /**
   * 撤销与恢复按钮
   */
  revoke() {
    this.recordService.revoke();
  }
  restore() {
    this.recordService.restore();
  }

  /**
   * 格式刷
   */
  formatSet() {
    this.formatBrushService.set();
  }

  /**
   * 分布、对齐、顺序
   */
  layout(type: string) {
    this.alignSortService.layout(type);
  }
  align(type: string) {
    this.alignSortService.align(type);
  }
  sort(type: string) {
    this.alignSortService.sort(type);
  }
  getSortDisabled(type: string) {
    return this.alignSortService.getSortDisabled(type);
  }

  /**
   * 预览
   */
  previewUrl = '';
  previewDialog: CompDialogAdapter = {
    dialog: {
      title: '预览',
      width: '60%',
      minWidth: '800px',
      footerButtons: [{ tag: 'close' }]
    }
  };
  preview() {
    this.transformService.detach();
    this.previewUrl = this.getLayerImageData();
    this.emit(this.COMPONENT_METHOD.dialogOpen);
  }

  /**
   * 保存
   */
  saveLoading = false;
  autoSaveInterval?: number;
  get isEdited() {
    const stageContent = this.StageData && this.StageData.content;
    const content = JSON.stringify(this.Content);
    return stageContent !== content;
  }
  async save(isAutoSave?: boolean) {
    if (!this.isEdited) return;
    // 清除重复id的shape(开发环境编译或其它问题可能会出现这个问题)
    const ids: string[] = [];
    this.Content.shapeList = this.Content.shapeList.filter((i) => {
      const isIdsIncludeShapeId = ids.includes(i.id);
      !isIdsIncludeShapeId && ids.push(i.id);
      return !isIdsIncludeShapeId;
    });
    this.transformService.detach();
    const previewContent = this.getLayerImageData(1 / 3.75, true);

    this.saveLoading = true;
    const saveContent = {
      ...this.StageData,
      previewContent,
      content: JSON.stringify(this.Content)
    };
    const res = 
       await The2dApi.save(saveContent);
    this.saveLoading = false;
    if (!res) return;
    this.$store.commit('setStageData', saveContent);
    isAutoSave !== true && this.$message.success('已保存');
  }
  autoSave() {
    this.autoSaveInterval = setInterval(() => {
      this.save(true);
    }, 10000);
  }

  /**
   * 发布
   */
  get isPublished() {
    return (
      this.isPublishByUser || (this.StageData && this.StageData.status === 1)
    );
  }
  publish() {
    if (this.isPublished) return;
    this.$confirm('是否确认发布?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        const id = this.StageData && this.StageData.id;
        const res =
          await The2dApi.public({ modelId: id });
        if (!res) return;
        this.$message.success('已发布');
        this.isPublishByUser = true;
      })
      .catch(() => {});
  }

  /**
   * 元件搜索
   */
  searchModel: any[] = [];
  searchSelectRef: any;
  get searchDialog(): CompFormDialogAdapter {
    return {
      name: 'search',
      api() {},
      dialog: {
        title: '元件搜索',
        width: '500px',
        footerButtons: [{ tag: 'close' }],
        on: {
          close: () => {
            // 防止关闭时reset searchModel的值
            const vm = this.getThis();
            const model = [...vm.searchModel];
            vm.$nextTick(() => {
              vm.searchModel = model;
            });
          },
          opened: () => {
            const vm = this.getThis();
            // maybe是使用get的原因，ref第二次会被清除，所以用一个变量保存下拉
            if (vm.search.selectConfig.ref) {
              this.searchSelectRef = vm.search.selectConfig.ref;
            }
            this.searchSelectRef && this.searchSelectRef.focus();
          }
        }
      },
      form: {
        formItems: [
          {
            width: '100%',
            labelWidth: '0',
            modelName: 'search',
            type: 'select',
            selectConfig: {
              ref: null,
              multiple: true,
              options: this.Content.shapeList.map((shape) => {
                return {
                  label: `${shape.name}-${shape.id}`,
                  value: shape.id
                };
              }),
              clearable: true,
              filterable: true,
              on: {
                change: (v: any) => {
                  const vm = this.getThis();
                  const currentCells = vm.Content.shapeList.filter((i) =>
                    v.includes(i.id)
                  );
                  vm.$store.commit('setCurrentCells', currentCells);
                }
              }
            }
          }
        ]
      },
      formModel: {
        search: this.searchModel
      }
    };
  }

  /**
   * 旋转
   */
  rotate() {
    const angle = -45;
    this.currentCells.forEach((cell) => {
      if (cell.type === 'arrow') {
        // 线段的旋转改为自己计算，然后改变point
        const centerX =
          (cell.points[0] + cell.points[cell.points.length - 2]) / 2;
        const centerY =
          (cell.points[1] + cell.points[cell.points.length - 1]) / 2;
        // 逆时针为正
        const sin =
          Math.round(Math.sin(((2 * Math.PI) / 360) * Math.abs(angle)) * 100) /
          100;
        const cos =
          Math.round(Math.cos(((2 * Math.PI) / 360) * Math.abs(angle)) * 100) /
          100;
        cell.points = (cell.points as any[]).map((p, index, arr) => {
          const x = index % 2 === 0 ? p - centerX : arr[index - 1] - centerX;
          const y = index % 2 === 0 ? arr[index + 1] - centerY : p - centerY;
          const res =
            index % 2 === 0
              ? x * cos - y * sin + centerX
              : x * sin + y * cos + centerY;
          return res;
        });
        this.anchorPointsService.update();
      } else {
        cell.rotation += angle;
      }
      this.layer.getNode().draw();
    });
    this.recordService.add();
  }

  /**
   * 获取图层的base64图片数据
   */
  getLayerImageData(pixelRatioScale = 1, isIgnorePrefix?: boolean) {
    const { canvasSize, scale } = this.zoomService;
    const imageData = this.layer.getNode().toDataURL({
      width: canvasSize.width,
      height: canvasSize.height,
      pixelRatio: (1 / scale) * pixelRatioScale
    });
    return isIgnorePrefix
      ? imageData.split('data:image/png;base64,').join('')
      : imageData;
  }
}
