<template>
  <div class="bs-2d-elements">
    <!-- 搜索功能 -->
    <div class="bs-2d-elements__search" @keydown="onKeydown">
      <co-input :config="searchInput" v-model="search"></co-input>
    </div>

    <!-- 图标区 -->
    <div class="bs-2d-elements__cells">
      <ul class="bs-2d-elements__cell-classify">
        <li
          v-for="(tab, index) in CELL_TABS"
          :key="index"
          :class="{ 'is-active': index === activeNo }"
          @click="setActiveNo(index)"
        >
          <el-tooltip
            class="item"
            effect="light"
            :content="tab.text"
            placement="right"
          >
            <i :class="tab.icon"></i>
          </el-tooltip>
        </li>
      </ul>
      <div class="bs-2d-elements__cell-groups">
        <div class="bs-2d-elements__cell-group">
          <div class="bs-2d-elements__cell-items">
            <div
              class="bs-2d-elements__cell-item upload"
              v-if="activeNo === 2"
              @click="emit(COMPONENT_METHOD.formDialogOpen)"
            >
              <div class="bs-2d-elements__cell-item-inner">
                <img :src="UPLOAD_IMG" />
                <p class="gl-ellipsis">上传图标</p>
              </div>
            </div>
            <draggable
              class="bs-2d-elements__cell-drag"
              :list="cellList"
              :sort="false"
              :group="{ name: 'draw', pull: 'clone', put: false }"
              @end="dragEnd"
            >
              <div
                class="bs-2d-elements__cell-item"
                :class="[!item.draggable && 'is-disabled']"
                v-for="(item, index) in cellList"
                :key="index"
                @dragstart="dragStart($event, item)"
              >
                <div
                  class="bs-2d-elements__cell-item-inner"
                  :ref="item.type === 'image' && `image${item.imgId}`"
                >
                  <!-- 下面会通过img标签找到图片 -->
                  <el-image :src="item.img" lazy>
                    <img slot="error" :src="IMG_LOAD_FAIL" />
                  </el-image>
                  <p class="gl-ellipsis">{{ item.name }}</p>
                </div>
              </div>
            </draggable>
          </div>
        </div>
      </div>
    </div>

    <!-- 自定义图标上传 -->
    <comp-form-dialog :formDialogConfig="upload"></comp-form-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { BsElementsConfig } from './elements.config';
import draggable from 'vuedraggable';

@Component({
  components: { draggable }
})
export default class BsElements extends Mixins(BsElementsConfig) {}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@include b(bs-2d-elements) {
  width: 250px;
  flex-shrink: 0;
  height: 100%;
  @include layout(column);
  @include layout-wrap(nowrap);

  @include e(search) {
    width: 100%;
    height: 50px;
    background: rgba(246, 247, 251, 1);
    box-shadow: 0px 1px 0px 0px rgba(226, 229, 236, 1);
    padding: 9px 10px;
  }

  @include e(cells) {
    width: 100%;
    height: 100%;
    overflow: hidden;
    flex: 1;
    @include layout();
    @include layout-wrap(nowrap);

    @include e(cell-classify) {
      width: 50px;
      height: 100%;
      background: rgba(226, 229, 236, 1);

      li {
        width: 100%;
        height: 40px;
        text-align: center;
        cursor: pointer;
        @include when(active) {
          background: #fff;
          border-left: 2px solid #0088ff;
          i {
            color: #0088ff;
          }
        }

        i {
          font-size: 18px;
          line-height: 40px;
        }
      }
    }

    @include e(cell-groups) {
      flex: 1;
      height: 100%;
      overflow: auto;
      background: #f6f7fb;

      @include e(cell-items) {
        width: 100%;
        padding-left: 10px;
        padding-right: 10px;
        @include e(cell-drag) {
          width: 100%;
          @include layout();
          @include layout-align(start, between);
          @include e(cell-item) {
            position: relative;
            width: 47.2%;
            padding-top: 47.2%;
            background: #fff;
            margin-bottom: 10px;
            cursor: move;
            @include when(disabled) {
              cursor: not-allowed;
            }
            @include e(cell-item-inner) {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              @include layout(column);
              @include layout-align(center, center);
            }

            &.upload {
              cursor: pointer;
            }

            .el-image {
              width: 45px;
              height: 45px;
            }

            img {
              width: 45px;
              height: 45px;
              object-fit: cover;
            }

            p {
              width: 100%;
              margin-top: 5px;
              height: 17px;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(0, 0, 0, 0.45);
              line-height: 17px;
              text-align: center;
            }
          }
        }
      }
    }
  }
}
</style>
