<template>
  <div class="bs-2d-top">
    <div class="bs-2d-top__back" @click="back">
      <i class="el-icon-arrow-left"></i>
      <p>返回</p>
    </div>
    <p class="bs-2d-top__title">画布</p>
    <p></p>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { BsTopConfig } from './top.config';

@Component({})
export default class BsTop extends Mixins(BsTopConfig) {
  back() {
    if (this.isEdited) {
      this.$confirm('未保存内容将会丢失，确认返回?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$router.go(-1);
        })
        .catch(() => {});
    } else {
      this.$router.go(-1);
    }
  }
}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@include b(bs-2d-top) {
  width: 100%;
  height: 34px;
  background: #1e1e28;
  padding-left: 20px;
  @include layout();
  @include layout-align(center, between);

  @include e(back) {
    cursor: pointer;
    @include layout();
    @include layout-align(center, start);
    i {
      font-size: 14px;
      color: rgba(255, 255, 255, 1);
      margin-right: 3px;
    }
    p {
      font-size: 14px;
      height: 34px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 34px;
    }
  }

  @include e(title) {
    font-size: 14px;
    height: 34px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 34px;
  }
}
</style>
