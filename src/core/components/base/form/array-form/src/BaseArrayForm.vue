<template>
  <div class="base-array-form">
    <!-- 标题 -->
    <p
      v-if="Config.title"
      class="base-array-form__title"
      :class="[Config.titleClassName]"
    >
      {{ Config.title }}
    </p>
    <div class="base-array-form__container">
      <!-- FORMS -->
      <ul class="base-array-form__forms">
        <li
          class="base-array-form__form"
          :class="{ 'is-sort': Config.sort }"
          v-for="(item, index) in formList"
          :key="index"
        >
          <base-form :config="item.form" :formModel="item.formModel" inner>
            <template v-for="(_, slot) in $scopedSlots" #[slot]="{scope}">
              <slot :name="slot" :scope="scope"></slot>
            </template>
          </base-form>
          <i
            class="base-array-form__icon down el-icon-sort-down"
            @click="down(index)"
            v-show="Config.sort && index !== formList.length - 1"
          ></i>
          <i
            class="base-array-form__icon up el-icon-sort-up"
            @click="up(index)"
            v-show="Config.sort && index !== 0"
          ></i>
          <i
            v-show="index + 1 > Config.min"
            class="base-array-form__icon el-icon-delete"
            @click="deleteItem(index)"
          ></i>
        </li>
      </ul>
      <!-- 新增按钮 -->
      <div
        class="base-array-form__add"
        v-show="!hasMax || formList.length < max"
      >
        <p class="content" @click="addItem">
          <i class="el-icon-circle-plus"></i>
          添加更多信息
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import { BaseArrayFormAdapter } from './BaseArrayForm.adapter';
import { BASE_ARRAY_FORM_DEFAULT_CONFIG } from './BaseArrayForm.default';
import FromComponentFactory from '@/core/factory/component-form.factory';
import defaultsDeep from 'lodash/defaultsDeep';
import { FormAdapter } from '../../form/src/BaseForm.adapter';
import cloneDeep from 'lodash/cloneDeep';

interface FormModel {
  [k: string]: any;
}
interface FormListItem {
  form: FormAdapter;
  formModel: FormModel;
}

@Component({
  components: {
    BaseForm: () => import('../../form') // 循环引用
  }
})
export default class BaseArrayForm extends Mixins(FromComponentFactory) {
  @Prop({ type: Object }) config!: BaseArrayFormAdapter;
  get Config(): BaseArrayFormAdapter {
    return defaultsDeep(this.config, BASE_ARRAY_FORM_DEFAULT_CONFIG);
  }
  get modelLen() {
    return (this.model && this.model.length) || 0;
  }
  get min() {
    return Math.floor(Math.max(this.Config.min || 0, this.modelLen));
  }
  get max() {
    return Math.floor(this.Config.max || Infinity);
  }
  get hasMax() {
    return this.max >= Math.floor(this.Config.min || 0);
  }

  @Watch('innerModel', { deep: true, immediate: true })
  onInnerModelChange(v: FormModel[]) {
    if (!this.oldFormModel) this.oldFormModel = v;
    this.model = v;
    this.emitEventAndExecuteListener(
      'modelChange',
      this.Config.on,
      v,
      this.oldFormModel,
      this.formList
    );
    this.oldFormModel = cloneDeep(v);
  }

  innerModel: FormModel[] = []; // 内部存放model的地方，与model比较可以得知当前组件的状态
  oldFormModel: FormModel[] | null = null;
  formList: FormListItem[] = [];
  formModelMeta: FormModel = {};
  overrideModelChange = true; // 重写modelChange方法

  deleteItem(index: number) {
    this.formList = this.formList.filter((i, n) => n !== index);
    this.innerModel = this.innerModel.filter((i, n) => n !== index);
  }
  addItem() {
    this.innerModel.push(cloneDeep(this.formModelMeta));
    this.formList.push({
      form: cloneDeep(this.Config.form),
      formModel: this.innerModel[this.innerModel.length - 1]
    });
  }
  up(index: number) {
    const current = this.formList[index];
    this.$set(this.formList, index, this.formList[index - 1]);
    this.$set(this.formList, index - 1, current);
  }
  down(index: number) {
    const current = this.formList[index];
    this.$set(this.formList, index, this.formList[index + 1]);
    this.$set(this.formList, index + 1, current);
  }

  /**
   * 初始化系列操作
   * value即model改变时触发的回调
   */
  onModelChange(model: any[]) {
    // innerModel !== model时，组件状态受到了外部的影响,对应初始化组件状态
    if (this.innerModel !== model) {
      this.formModelMetaInit();
      if (!model || !model.length) {
        // 组件初始化状态
        this.resetFormList();
      } else {
        // 编辑初始化状态
        this.initFormList();
      }
    }
  }
  resetFormList() {
    this.formList = [];
    this.innerModel = [];
    for (let i = 0; i < this.min; i++) {
      this.innerModel.push(cloneDeep(this.formModelMeta));
      this.formList.push({
        form: cloneDeep(this.Config.form),
        formModel: this.innerModel[i]
      });
    }
  }
  initFormList() {
    this.formList = [];
    this.innerModel = this.model;
    for (let i = 0; i < this.min; i++) {
      this.modelLen <= i && this.innerModel.push(cloneDeep(this.formModelMeta));
      this.formList.push({
        form: cloneDeep(this.Config.form),
        formModel: this.innerModel[i]
      });
    }
  }
  formModelMetaInit() {
    if (Object.keys(this.formModelMeta).length) return;
    const formItems = this.Config.form.formItems;
    const formModel = this.Config.formModel || {};
    formItems.forEach((item) => {
      if (item.modelName) {
        this.$set(
          this.formModelMeta,
          item.modelName,
          formModel[item.modelName] || null
        );
      }
    });
  }
}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@include b(base-array-form) {
  width: 100%;

  @include e(title) {
    height: 20px;
    line-height: 20px;
    color: #000;
    margin-bottom: 10px;
  }

  @include e(container) {
    width: 100%;
    background: #dceafa;
    @include e(forms) {
      width: 100%;
      padding-right: 10px;
      padding-top: 10px;

      @include e(form) {
        position: relative;
        width: 100%;
        padding-right: 18px;
        @include layout();
        @include layout-wrap(nowrap);
        @include when(sort) {
          padding-right: 50px;
        }

        // &:first-child {
        //   padding-top: 10px;
        // }
        &:last-child {
          padding-bottom: 5px;
          border-bottom: 1px solid rgba(60, 143, 245, 0.13);
        }

        .el-form-item {
          margin-bottom: 22px;
        }

        @include e(icon) {
          position: absolute;
          right: 0;
          top: 25%;
          transform: translateY(-50%);
          transition: color 0.3s;
          font-size: 18px;
          cursor: pointer;
          &:hover {
            opacity: 0.5;
          }
          &.down {
            right: 36px;
          }
          &.up {
            right: 18px;
          }
        }
        .el-icon-delete {
          color: red;
        }
        .el-icon-sort-up {
          color: #3c8ff5;
        }
        .el-icon-sort-down {
          color: #3c8ff5;
        }
      }
    }
  }

  @include e(add) {
    width: 100%;
    height: 40px;
    color: #3c8ff5;
    @include layout();
    @include layout-align(center, center);

    .content {
      cursor: pointer;
      i {
        margin-right: 3px;
      }
    }
  }
}
</style>
