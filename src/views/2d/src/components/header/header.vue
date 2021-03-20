<template>
  <div class="bs-2d-header">
    <!-- 左侧按钮功能 -->
    <ul class="bs-2d-header__l-operations">
      <!-- 撤销与恢复按钮 -->
      <li
        class="bs-2d-header__record bs-2d-header__l-operation"
        :class="[recordService.isRevokeDisabled && 'is-disabled']"
        @click="revoke"
      >
        <i class="iconfont iconback1"></i>
        <p>撤销</p>
      </li>
      <li
        class="bs-2d-header__record bs-2d-header__l-operation"
        :class="[recordService.isRestoreDisabled && 'is-disabled']"
        @click="restore"
      >
        <i class="iconfont iconback1 restore"></i>
        <p>恢复</p>
      </li>

      <!-- 缩放按钮 -->
      <li class="bs-2d-header__zoom">
        <i
          class="el-icon-minus zoom-ctrl"
          :class="[zoomService.isReduceDisable && 'is-disable']"
          @click="reduce"
        ></i>
        <div class="bs-2d-header__l-operation bs-2d-header__zoom-main">
          <i class="el-icon-search zoom-icon"></i>
          <p>{{ zoomService.zoomValue }}%</p>
        </div>
        <i
          class="el-icon-plus zoom-ctrl"
          :class="[zoomService.isAddDisable && 'is-disable']"
          @click="add"
        ></i>
      </li>

      <!-- 旋转 -->
      <li
        class="bs-2d-header__l-operation divider"
        :class="[!currentCells.length && 'is-disabled']"
        @click="rotate"
      >
        <i class="el-icon-refresh-left"></i>
        <p>旋转</p>
      </li>

      <!-- 格式刷 -->
      <li
        class="bs-2d-header__l-operation"
        :class="[
          formatBrushService.disabled && 'is-disabled',
          formatBrushService.selectCell && 'is-active'
        ]"
        @click="formatSet"
      >
        <i class="el-icon-s-open"></i>
        <p>格式刷</p>
      </li>

      <!-- 分布 -->
      <!-- 写两个的原因是el-dropdown没有disabled功能 -->
      <!-- 对el-dropdown-menu使用v-if会导致element - ui报错 -->
      <!-- https://segmentfault.com/q/1010000015250767 -->
      <li
        v-if="currentCells.length < 2"
        class="bs-2d-header__l-operation bs-2d-header__dropdown divider is-disabled"
      >
        <i class="iconfont iconfenbu"></i>
        <p>分布</p>
        <i class="dropdown-icon el-icon-caret-bottom"></i>
      </li>
      <el-dropdown @command="layout" v-else>
        <li class="bs-2d-header__l-operation bs-2d-header__dropdown divider">
          <i class="iconfont iconfenbu"></i>
          <p>分布</p>
          <i class="dropdown-icon el-icon-caret-bottom"></i>
        </li>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            class="bs-2d-header__dropdown-menu"
            v-for="(item, index) in LAYOUT_MENU"
            :key="index"
            :command="item.type"
          >
            <i :class="item.icon"></i>
            <p>{{ item.label }}</p>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <!-- 对齐 -->
      <li
        v-if="currentCells.length < 2"
        class="bs-2d-header__l-operation bs-2d-header__dropdown is-disabled"
      >
        <i class="iconfont iconduiqi"></i>
        <p>对齐</p>
        <i class="dropdown-icon el-icon-caret-bottom"></i>
      </li>
      <el-dropdown @command="align" v-else>
        <li class="bs-2d-header__l-operation bs-2d-header__dropdown">
          <i class="iconfont iconduiqi"></i>
          <p>对齐</p>
          <i class="dropdown-icon el-icon-caret-bottom"></i>
        </li>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            class="bs-2d-header__dropdown-menu"
            v-for="(item, index) in ALIGN_MENU"
            :key="index"
            :command="item.type"
          >
            <i :class="item.icon"></i>
            <p>{{ item.label }}</p>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <!-- 顺序 -->
      <li
        v-if="currentCells.length !== 1"
        class="bs-2d-header__l-operation bs-2d-header__dropdown is-disabled"
      >
        <i class="iconfont iconpailie"></i>
        <p>顺序</p>
        <i class="dropdown-icon el-icon-caret-bottom"></i>
      </li>
      <el-dropdown @command="sort" v-else>
        <li class="bs-2d-header__l-operation bs-2d-header__dropdown">
          <i class="iconfont iconpailie"></i>
          <p>顺序</p>
          <i class="dropdown-icon el-icon-caret-bottom"></i>
        </li>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            class="bs-2d-header__dropdown-menu"
            v-for="(item, index) in SORT_MENU"
            :key="index"
            :command="item.type"
            :disabled="getSortDisabled(item.type)"
          >
            <i :class="item.icon"></i>
            <p>{{ item.label }}</p>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </ul>

    <!-- 当前画布名 -->
    <p class="bs-2d-header__name">{{ StageData.name }}</p>

    <!-- 搜索、预览、保存与发布 -->
    <ul class="bs-2d-header__r-operations">
      <li
        class="bs-2d-header__r-operation"
        @click="emit(COMPONENT_METHOD.formDialogOpen, null, 'search')"
      >
        <i class="el-icon-search"></i>
        <p>搜索元件</p>
      </li>
      <li class="bs-2d-header__r-operation divider" @click="preview">
        <i class="iconfont iconpreview"></i>
        <p>预览</p>
      </li>
      <li
        class="bs-2d-header__r-operation"
        :class="[!isEdited && 'is-disabled']"
        @click="save"
        v-loading="saveLoading"
      >
        <i class="iconfont iconsave"></i>
        <p>保存</p>
      </li>
      <li
        class="bs-2d-header__r-operation"
        :class="[isPublished && 'is-disabled']"
        @click="publish"
      >
        <i class="iconfont iconRelease"></i>
        <p>{{ isPublished ? '已发布' : '发布' }}</p>
      </li>
    </ul>

    <!-- 预览弹窗 -->
    <comp-dialog :dialogConfig="previewDialog">
      <div class="bs-2d-header__preview-container">
        <img :src="previewUrl" />
      </div>
    </comp-dialog>

    <!-- 元件查找 -->
    <div @keydown="onKeydown">
      <comp-form-dialog
        :formDialogConfig="searchDialog"
        class="bs-2d-header__search-dialog"
      ></comp-form-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { BsHeaderConfig } from './header.config';

@Component({})
export default class BsHeader extends Mixins(BsHeaderConfig) {}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@mixin bs-2d-header__operation {
  position: relative;
  padding: 0 15px;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.65);
  transition: color 0.3s;
  @include layout(column);
  @include layout-align(center, center);
  &.divider::before {
    position: absolute;
    content: '';
    width: 1px;
    height: 20px;
    background: rgba(212, 216, 219, 1);
    top: 10%;
    left: 0;
  }
  &:hover {
    color: #0088ff;
  }
  @include when(active) {
    color: #0088ff;
  }
  @include when(disabled) {
    cursor: not-allowed;
    color: #ccc;
  }

  i {
    font-size: 18px;
    margin-bottom: 4px;
  }
  p {
    height: 17px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    line-height: 17px;
  }
}

@include b(bs-2d-header) {
  position: relative;
  width: 100%;
  height: 52px;
  min-height: 52px;
  background: rgba(246, 247, 251, 1);
  box-shadow: 0px 1px 0px 0px rgba(203, 211, 223, 1);
  padding: 0 20px;
  @include layout();

  @include e(l-operations) {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    @include layout();
    @include layout-align(center, start);

    @include e(l-operation) {
      @include bs-2d-header__operation;
    }

    @include e(record) {
      &:first-child {
        padding-right: 0;
      }
      i {
        &.restore {
          transform: rotateY(180deg);
        }
      }
    }

    @include e(zoom) {
      @include layout();
      @include layout-align(center, start);

      @include e(zoom-main) {
        padding: 5px;
        cursor: default;
        &:hover {
          color: rgba(0, 0, 0, 0.65);
        }
      }
      .zoom-ctrl {
        font-size: 12px;
        cursor: pointer;
        &:last-child {
          padding-right: 20px;
        }
        &:hover {
          color: #0088ff;
        }
        &.is-disable {
          cursor: not-allowed;
          color: #ccc;
        }
      }
    }

    @include e(dropdown) {
      position: relative;
      .dropdown-icon {
        position: absolute;
        right: 3px;
        top: 3px;
        font-size: 16px;
      }

      @include e(dropdown-menu) {
        @include layout();
      }
    }
  }

  @include e(name) {
    width: 100%;
    height: 100%;
    text-align: center;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 52px;
  }

  @include e(r-operations) {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    @include layout();

    @include e(r-operation) {
      @include bs-2d-header__operation;
    }
  }

  @include e(preview-container) {
    width: 100%;
    height: 100%;
    overflow: auto;
    @include layout();
    @include layout-align(center, center);
    img {
      width: 80%;
      object-fit: cover;
    }
  }

  @include e(search-dialog) {
    .base-select {
      width: 100%;
    }
  }
}
</style>
