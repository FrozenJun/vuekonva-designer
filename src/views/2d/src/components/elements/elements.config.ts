import { Component } from 'vue-property-decorator';
import UIComponentFactory from '@/core/factory/component-ui.factory';
import { COMPONENT_METHOD, COMPONENT_DATA } from '@/core/dtos/factories.dto.ts';
import { InputAdapter } from '@/core/components/base/form/input/src/BaseInput.adapter';
import { TheImageApi } from '@/views/configuration/image/src/TheImage.api';
import { The2dApi } from '../../The2d.api';
import { CompFormDialogAdapter } from '@/core/components/customize/form-dialog/src/CompFormDialog.adapter';
import { API_CONFIG } from '@/config/http.config';
import {
  getListMaxId,
  getBase64Image,
  getImageSize
} from '../../utils/2d.util';
import uploadImg from '@/assets/images/upload@2x.png';
import loadFailImg from '@/assets/images/img-fail.png';
import { State } from 'vuex-class';
import { ZoomService, TransformService, RecordService } from '../../services';
import { StageDataContent } from '../../utils/2d.dto';
import {
  CELL_TABS,
  LINE_CELL,
  POLYLINE_CELL,
  CIRCLE_CELL,
  RECT_CELL,
  TEXT_CELL,
  TEXTAREA_CELL,
  IMAGE_CELL
} from '../../constants/element.constant';

@Component({})
export class BsElementsConfig extends UIComponentFactory {
  COMPONENT_METHOD = COMPONENT_METHOD;
  COMPONENT_DATA = COMPONENT_DATA;
  CELL_TABS = CELL_TABS;

  UPLOAD_IMG = uploadImg;
  IMG_LOAD_FAIL = loadFailImg;

  @State('zoomService') zoomService!: ZoomService; // 缩放功能
  @State('recordService') recordService!: RecordService; // 缩放功能
  @State('transformService') transformService!: TransformService; // 转变功能

  @State('content') Content!: StageDataContent;
  @State('stage') stage: any;
  @State('layer') layer: any;

  /**
   * Tabs功能
   */
  baseList = [
    // 基础库列表
    LINE_CELL,
    POLYLINE_CELL,
    CIRCLE_CELL,
    RECT_CELL,
    TEXT_CELL,
    TEXTAREA_CELL
  ];
  imageList: any[] = []; // 素材库列表
  iconList: any[] = []; // 自定义素材列表

  activeNo = 0;
  cellList: any[] = this.baseList; // 当前展示的列表

  /**
   * 搜索功能
   */
  search = '';
  searchInput: InputAdapter = {
    prefixIcon: 'el-icon-search',
    placeholder: '搜索可视化元件',
    on: {
      modelChange: (v) => {
        const vm = this.getThis();
        switch (vm.activeNo) {
          case 0:
            vm.cellList = vm.baseList.filter((i) => i.name.includes(v));
            break;
          case 1:
            vm.cellList = vm.imageList.filter((i) => i.name.includes(v));
            break;
          case 2:
            vm.cellList = vm.iconList.filter((i) => i.name.includes(v));
        }
      }
    }
  };

  /**
   * 拖拽图标到画布上
   */
  dragCell: any = null;
  /** 开始拖拽 */
  dragStart(e: Event, item: any) {
    // 图片加载出错，不能使其拖入画布中，会导致严重的渲染错误问题
    if (!item.draggable) e.preventDefault();
    this.dragCell = item;
  }
  /** 结束拖拽 */
  dragEnd(e: any) {
    /**
     * 图片需要Image对象，这里通过现有的imagedom获取
     */
    this.dragCell.type === 'image' && this.copyImageToCell(this.dragCell);
    /**
     * 计算x, y时要算上当前画布的缩放
     */
    const stageRect = this.stage.$el.getBoundingClientRect();
    const x = Math.round(
      (e.originalEvent.clientX - stageRect.left) / this.zoomService.scale
    );
    const y = Math.round(
      (e.originalEvent.clientY - stageRect.top) / this.zoomService.scale
    );
    const id = String(getListMaxId(this.Content.shapeList) + 1); // knova中的id必须是字符串
    const { width, height } = this.Content.canvas;
    if (x > 0 && x < width && y > 0 && y < height) {
      const dragCell = _.cloneDeep(this.dragCell);
      Reflect.deleteProperty(dragCell, 'img'); // 防止无用，巨长的图片属性被保存

      if (dragCell.type === 'circle') {
        // 圆形x，y需要各加对应的offset值
        this.Content.shapeList.push(
          _.assign(dragCell, {
            x: x + dragCell.offsetX,
            y: y + dragCell.offsetY,
            id
          })
        );
      } else {
        this.Content.shapeList.push(_.assign(dragCell, { x, y, id }));
      }

      this.recordService.add();

      // 拖过来就应该是transformer选中的状态
      setTimeout(() => this.$store.commit('setCurrentCells', [dragCell]), 0);
    }
  }

  mounted() {
    this.getImageList();
    this.getIconList();
  }

  // 监听按键事件，并阻止向上传播，防止删除，后退，前后左右等影响页面的按键被用户无意识按下
  onKeydown(e: KeyboardEvent) {
    e.stopPropagation();
  }

  setActiveNo(no: number) {
    this.search = '';
    this.activeNo = no;
    switch (no) {
      case 0:
        this.cellList = this.baseList;
        break;
      case 1:
        this.cellList = this.imageList;
        break;
      case 2:
        this.cellList = this.iconList;
    }
  }

  async getImageList() {
    const res = await TheImageApi.all({ pageSize: 9999 });
    if (!res) return;
    this.imageList = res.records.map(this.getImageCell);
  }
  async getIconList() {
    const res = await The2dApi.iconList({ pageSize: 9999 });
    if (!res) return;
    this.iconList = res.records.map(this.getImageCell);
  }

  getImageCell(i: any) {
    const imageCell = _.cloneDeep(IMAGE_CELL);
    const src = `${API_CONFIG.apiPrefixUrl}/file/download?id=${i.fileId}`;
    imageCell.img = src;
    imageCell.imgId = i.fileId;
    imageCell.imageSrc = src;
    imageCell.name = i.fileName;
    imageCell.draggable = true;
    return imageCell;
  }
  copyImageToCell(dragCell: any) {
    // 通过img节点获取图片的base64字符串
    const refName = `image${this.dragCell.imgId}`;
    const dom = this.$refs[refName] as Element[];
    const imgs = dom.length && dom[0].getElementsByClassName('el-image__inner');
    if (!imgs || !imgs[0]) return;
    const { width, height } = getImageSize(imgs[0]);
    // 使用图片的源尺寸获取base64字符串，防止图片放大容易模糊
    const base64Url = getBase64Image(imgs[0], true);
    // 通过base64字符串生成新的Image对象，并赋予cell
    const image = new Image();
    image.src = base64Url;
    dragCell.image = image;
    dragCell.width = width;
    dragCell.height = height;
    dragCell.offsetX = width / 2;
    dragCell.offsetY = height / 2;
  }

  /**
   * 上传弹窗
   */
  upload: CompFormDialogAdapter = {
    api: The2dApi.iconUpload,
    handleApiParam(params) {
      return params;
    },
    on: {
      success: async () => {
        await this.getIconList();
        this.cellList = this.iconList;
      }
    },
    form: {
      itemWidth: '100%',
      formItems: [
        {
          label: '本地图片',
          modelName: 'icons',
          rule: 'required',
          tip: '文件格式：JPG，PNG，大小：3M以内',
          type: 'upload',
          uploadConfig: {
            ref: null,
            accept: 'image/png, image/jpeg, image/jpg',
            multiple: true,
            limit: Infinity,
            modelKey: 'value',
            beforeUpload: (file) => {
              if (file.size > 3000 * 1000) {
                this.$message.warning('图片不能大于3M!');
                return false;
              } else {
                return true;
              }
            },
            getModelByRes: (res, config, oldModel) => {
              if (res.code !== API_CONFIG.successCode) {
                this.$message.error(res.message || '上传失败');
                return '';
              }
              let arrayModel: string[];
              if (_.isArray(oldModel)) {
                arrayModel = oldModel;
              } else if (oldModel) {
                arrayModel = [oldModel];
              } else {
                arrayModel = [];
              }
              const result = res.result;
              return [
                ...arrayModel,
                {
                  fileId: result.id,
                  fileUrl: result.url,
                  fileName: result.name
                }
              ];
            },
            async getUploadsByModel(model, config) {
              return model.map((i: any) => {
                return {
                  id: i.fileId,
                  url: `${API_CONFIG.apiPrefixUrl}/file/download?id=${i.fileId}`,
                  name: i.fileName,
                  value: {
                    fileId: i.fileId,
                    fileUrl: `${API_CONFIG.apiPrefixUrl}/file/download?id=${i.fileId}`,
                    fileName: i.fileName
                  }
                };
              });
            }
          }
        }
      ]
    },
    formModel: {
      icons: []
    },
    dialog: {
      title: '上传自定义图标',
      minWidth: '700px'
    }
  };
}
