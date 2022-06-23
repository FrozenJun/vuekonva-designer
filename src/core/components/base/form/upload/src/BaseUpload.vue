<template>
  <div
    class="base-upload"
    :class="{
      'is-file': Config.type === 'file'
    }"
  >
    <!-- 图片列表 -->
    <ul
      v-if="!Config.type || Config.type === 'image'"
      class="base-upload__images"
    >
      <li
        v-for="(item, index) in uploads"
        :key="index"
        class="base-upload__image"
        :style="{
          width: Config.width,
          height: Config.height
        }"
      >
        <el-image
          :src="item.url"
          :preview-src-list="getBigImageList(index)"
          :ref="index"
        ></el-image>
        <span class="base-upload__image-actions">
          <i
            class="el-icon-zoom-in base-upload__action-item"
            @click.stop="showBig(index)"
          ></i>
          <i
            v-if="Config.deleteable || !Config.disabled"
            class="el-icon-delete base-upload__action-item"
            @click.stop="onClose(item.id)"
          ></i>
        </span>
      </li>
    </ul>

    <!-- 上传组件 -->
    <el-upload
      class="base-upload__upload"
      :class="{
        'is-disabled': Config.disabled
      }"
      ref="BaseUploadImg"
      v-bind="Config"
      v-on="mergeEventsAndDasherizeKeys([Config.on, $listeners])"
      :on-success="onSuccess"
      :on-error="onError"
      :on-change="onChange"
    >
      <span
        v-if="
          (!Config.type || Config.type === 'image') &&
            (!Config.limit || uploads.length < Config.limit)
        "
        class="base-upload__add-image"
        @click="onUploadAreaClick"
        :style="{
          width: Config.width,
          height: Config.height
        }"
      >
        <img v-if="Config.defaultImg" :src="Config.defaultImg" />
        <i
          v-else
          class="el-icon-plus base-upload__icon"
          :style="{
            width: Config.width,
            height: Config.height,
            lineHeight: Config.height
          }"
        ></i>
      </span>
      <el-button
        v-if="Config.type === 'file'"
        :slot="uploads.length >= Config.limit ? 'tip' : 'trigger'"
        @click="onUploadAreaClick"
        :disabled="uploads.length >= Config.limit"
        size="small"
        type="primary"
        >上传文件</el-button
      >

      <!-- SLOTS -->
      <template v-for="(name, slot) in Config.slots || {}" #[slot]>
        <slot :name="name"></slot>
      </template>
      <template v-for="(_, slot) in $scopedSlots" #[slot]>
        <slot :name="slot"></slot>
      </template>
    </el-upload>

    <!-- 文件列表 -->
    <ul v-if="Config.type === 'file'" class="base-upload__files">
      <li
        v-for="(item, index) in uploads"
        :key="index"
        class="base-upload__file"
      >
        <i class="el-icon-document icon-prefix"></i>
        <p class="gl-ellipsis">{{ item.name }}</p>
        <i class="el-icon-circle-check icon-success"></i>
        <i
          v-if="Config.deleteable || !Config.disabled"
          class="el-icon-close icon-close"
          @click.stop="onClose(item.id)"
        ></i>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { BaseUploadAdapter, UploadItem } from './BaseUpload.adapter';
import { BASE_UPLOAD_DEFAULT_CONFIG } from './BaseUpload.default';
import FromComponentFactory from '@/core/factory/component-form.factory';
import defaultsDeep from 'lodash/defaultsDeep';
import { COMPONENT_CONFIG } from '@/config/component.config';

@Component({})
export default class BaseUpload extends Mixins(FromComponentFactory) {
  @Prop({ type: Object }) config!: BaseUploadAdapter;
  get Config(): BaseUploadAdapter {
    return defaultsDeep(
      this.config,
      COMPONENT_CONFIG.upload,
      BASE_UPLOAD_DEFAULT_CONFIG,
      {
        showFileList: this.config && this.config.type === 'file'
      }
    );
  }

  uploads: UploadItem[] = [];

  async onChange(file: any, fileList: any) {
    if (this.Config.autoUpload === false) {
      // TODO - 业务代码，赶时间
      const reader = new FileReader();
      const vm = this;
      vm.model.push(file.raw);
      reader.readAsDataURL(file.raw);
      reader.onload = function(e) {
        // 图片base64化
        vm.uploads.push({
          id: file.uid,
          name: file.name,
          url: this.result as string,
          file: file.raw
        });
      };
    }
  }
  async onSuccess(response: any, file: any, fileList: any[]) {
    fileList.pop();
    const getModelByRes = this.Config.getModelByRes || ((res) => res);
    const res = await getModelByRes(response, this.Config, this.model);
    if (res) this.model = res;
  }
  onError(err: Error) {
    this.$message.error(err.message || '上传失败');
  }
  async onModelChange(val: any) {
    if ((_.isArray(val) && val.length) || (!_.isArray(val) && val)) {
      const getUploadsByModel =
        this.Config.getUploadsByModel || ((model) => model);
      const res = await getUploadsByModel(val, this.Config);
      if (!res) return;
      this.uploads = res;
    } else {
      this.uploads = [];
    }
  }

  onClose(id: string) {
    if (!this.Config.limit || this.Config.limit > 1) {
      this.model = this.uploads
        .filter((i) => i.id !== id)
        .map((i) => i[this.Config.modelKey!]);
      if (this.Config.autoUpload === false) {
        // TODO - 业务代码，赶时间
        this.uploads = this.uploads.filter((i) => i.id !== id);
      }
    } else {
      this.model = '';
    }
  }
  showBig(refIndex: string) {
    const ref: any = this.$refs[refIndex];
    if (ref && ref.length) {
      ref[0].clickHandler();
    }
  }
  getBigImageList(index: number) {
    const imageUploads = this.uploads.map((i) => i.url);
    if (index !== 0) {
      return [...imageUploads.slice(index), ...imageUploads.slice(0, index)];
    } else {
      return imageUploads;
    }
  }
  onUploadAreaClick() {
    this.emitEventAndExecuteListener('uploadAreaClick', this.Config.on);
  }
}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@include b(base-upload) {
  width: 100%;
  @include layout();
  @include when(file) {
    max-width: 420px;
    @include layout(column);
  }

  @include e(images) {
    @include layout();
    @include e(image) {
      position: relative;
      width: 178px;
      height: 178px;
      display: block;
      border: 1px solid #c0ccda;
      border-radius: 6px;
      margin-right: 8px;
      margin-bottom: 8px;

      .el-image {
        width: 100%;
        height: 100%;
      }
      .el-image__inner {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      @include e(image-actions) {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        cursor: default;
        text-align: center;
        color: #fff;
        opacity: 0;
        font-size: 20px;
        background-color: rgba(0, 0, 0, 0.5);
        transition: opacity 0.3s;
        @include layout();
        @include layout-align(center, center);
        &:hover {
          opacity: 1;
        }

        @include e(action-item) {
          cursor: pointer;
          margin-right: 5px;
          &:last-child {
            margin-right: 0;
          }
        }
      }

      &:hover {
        @include e(close) {
          display: inline-block;
        }
      }
    }
  }

  @include e(upload) {
    position: relative;
    text-align: left;
    margin-bottom: 8px;

    @include when(disabled) {
      .el-upload {
        border-color: transparent;
        &:hover {
          border-color: transparent;
          cursor: not-allowed;
        }
      }
    }

    .el-upload {
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    @include e(add-image) {
      position: relative;
      width: 178px;
      height: 178px;
      display: block;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 6px;
        border: 1px solid #c0ccda;
      }
    }

    @include e(icon) {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      box-sizing: border-box;
      line-height: 178px;
      text-align: center;
      border: 1px dashed #999;
    }
  }

  @include e(files) {
    margin-top: 10px;
    @include e(file) {
      margin-top: 5px;
      cursor: pointer;
      @include layout();
      @include layout-align(center, start);
      &:hover {
        background: #f5f7fa;
        p {
          color: #409eff;
        }
        .icon-success {
          display: none;
        }
        .icon-close {
          display: inline-block;
        }
      }

      p {
        flex: 1;
        color: #606266;
        margin-right: 40px;
        padding-left: 4px;
        line-height: 25px;
        transition: color 0.3s;
      }
      i {
        font-size: 16px;
      }
      .icon-prefix {
        margin-right: 8px;
      }
      .icon-success {
        color: #67c23a;
        margin-right: 5px;
      }
      .icon-close {
        display: none;
        margin-right: 5px;
      }
    }
  }
}
</style>
