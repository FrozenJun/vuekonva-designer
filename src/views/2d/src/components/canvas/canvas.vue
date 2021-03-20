<template>
  <div
    class="bs-2d-canvas"
    ref="canvas"
    :class="{
      'is-align-center-center':
        !zoomService.isHeightOverflow && !zoomService.isWidthOverflow,
      'is-align-start-center':
        zoomService.isHeightOverflow && !zoomService.isWidthOverflow,
      'is-align-center-start':
        !zoomService.isHeightOverflow && zoomService.isWidthOverflow,
      'is-align-start-start':
        zoomService.isHeightOverflow && zoomService.isWidthOverflow
    }"
    :style="{
      padding: `${VERTICAL_BLANK / 2}px ${HORIZONTAL_BLANK / 2}px`
    }"
  >
    <div
      class="bs-2d-canvas__container"
      :style="containerStyle"
      v-loading="loading"
    >
      <v-stage
        class="bs-2d-canvas__stage"
        ref="stage"
        :config="zoomService.canvasSize"
        :style="containerStyle"
        @mousedown="onStageMouseDown"
        @mousemove="onStageMouseMove"
        @mouseup="onStageMouseUp"
        @mouseleave="onStageMouseLeave"
      >
        <v-layer ref="layer">
          <template v-for="(shape, index) in shapeList">
            <v-image
              v-if="shape.type === 'image'"
              :config="shape"
              :key="index"
              @dragstart="shapeDragStart"
              @dragmove="shapeDragMove($event, shape)"
              @dragend="shapeDragEnd(shape)"
              @mousedown="shapeMousedown($event, shape)"
              @transform="transform($event, shape)"
              @transformend="transformEnd"
              @mouseover="shapeMouseover"
              @mouseout="shapeMouseout"
            ></v-image>
            <v-arrow
              v-else-if="shape.type === 'arrow'"
              :config="shape"
              :key="index"
              @dragstart="shapeDragStart"
              @dragmove="shapeDragMove($event, shape)"
              @dragend="shapeDragEnd(shape)"
              @mousedown="shapeMousedown($event, shape)"
              @transform="transform($event, shape)"
              @transformend="transformEnd"
              @mouseover="shapeMouseover"
              @mouseout="shapeMouseout"
            ></v-arrow>
            <v-text
              v-else-if="shape.type === 'text' || shape.type === 'textarea'"
              :config="shape"
              :key="index"
              @dragstart="shapeDragStart"
              @dragmove="shapeDragMove($event, shape)"
              @dragend="shapeDragEnd(shape)"
              @mousedown="shapeMousedown($event, shape)"
              @transform="transform($event, shape)"
              @transformend="transformEnd"
              @mouseover="shapeMouseover"
              @mouseout="shapeMouseout"
              @dblclick="fontService.dblclick.call(fontService, $event)"
            ></v-text>
            <v-circle
              v-else-if="shape.type === 'circle'"
              :config="shape"
              :key="index"
              @dragstart="shapeDragStart"
              @dragmove="shapeDragMove($event, shape)"
              @dragend="shapeDragEnd(shape)"
              @mousedown="shapeMousedown($event, shape)"
              @transform="transform($event, shape)"
              @transformend="transformEnd"
              @mouseover="shapeMouseover"
              @mouseout="shapeMouseout"
            ></v-circle>
            <v-rect
              v-else-if="shape.type === 'rect'"
              :config="shape"
              :key="index"
              @dragstart="shapeDragStart"
              @dragmove="shapeDragMove($event, shape)"
              @dragend="shapeDragEnd(shape)"
              @mousedown="shapeMousedown($event, shape)"
              @transform="transform($event, shape)"
              @transformend="transformEnd"
              @mouseover="shapeMouseover"
              @mouseout="shapeMouseout"
            ></v-rect>
          </template>
          <v-transformer
            v-for="cell in transformerCells"
            :key="`transformer-${cell.id}`"
            ref="transformer"
            v-bind="transformService.transformerConfig"
          ></v-transformer>
        </v-layer>

        <!-- 锚点、范围选择等辅助layer -->
        <v-layer ref="helpLayer">
          <template v-for="(anchor, index) in anchorPointsService.anchors">
            <v-rect
              v-if="anchor.type === 'rect-anchor'"
              :key="index"
              :config="anchor"
              @dragmove="anchorRectDragmove($event, anchor)"
              @dragend="anchorDragend"
              @mouseover="anchorMouseover(anchor)"
              @mousedown="anchorMousedown(anchor)"
              @mouseout="anchorMouseout"
            ></v-rect>
            <v-circle
              v-if="anchor.type === 'circle-anchor'"
              :key="index"
              :config="anchor"
              @dragmove="anchorCircleDragmove($event, anchor)"
              @dragend="anchorDragend"
              @mouseover="anchorMouseover(anchor)"
              @mousedown="anchorMousedown(anchor)"
              @mouseout="anchorMouseout"
            ></v-circle>
          </template>
        </v-layer>
      </v-stage>

      <!-- 文本输入框 -->
      <span @keydown="onKeydown">
        <co-input
          v-show="fontService.showTextInput"
          class="bs-2d-canvas__cell-text"
          :style="fontService.textStyle"
          :config="fontService.textCellConfig"
          v-model="fontService.textCellValue"
          @keydown.native="fontService.keydown.call(fontService, $event)"
        ></co-input>
        <!-- 多行文本输入框 -->
        <co-input
          v-show="fontService.showTextareaInput"
          class="bs-2d-canvas__cell-textarea"
          :style="fontService.textStyle"
          :config="fontService.textareaCellConfig"
          v-model="fontService.textareaCellValue"
          @keydown.native="fontService.keydown.call(fontService, $event)"
        ></co-input>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { BsCanvasConfig } from './canvas.config';
import draggable from 'vuedraggable';

@Component({
  components: { draggable }
})
export default class BsCanvas extends Mixins(BsCanvasConfig) {}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@include b(bs-2d-canvas) {
  flex: 1;
  overflow: auto;
  background: #e2e5ec;
  @include layout();
  @include layout-align(center, center);
  @include when(align-center-center) {
    @include layout-align(center, center);
  }
  @include when(align-start-start) {
    @include layout-align(start, start);
  }
  @include when(align-start-center) {
    @include layout-align(start, center);
  }
  @include when(align-center-start) {
    @include layout-align(center, start);
  }
  @include e(container) {
    position: relative;
    @include e(stage) {
      background: #fff;
      outline: none;
    }
    @include e(cell-text) {
      position: absolute;
      left: 0;
      top: 0;
      width: auto;
    }
    @include e(cell-textarea) {
      position: absolute;
      left: 0;
      top: 100px;
      width: auto;
    }
  }
}
</style>
