<template>
  <div class="comp-search">
    <div class="comp-search__container">
      <div class="comp-search__forms">
        <base-form
          class="comp-search__form"
          :config="Config.form"
          :inner="true"
          :formModel="Config.formModel"
          @output-change="copyOutputsToTarget('formOutputs', $event)"
        >
          <template v-for="(_, slot) in $scopedSlots" #[slot]="{scope}">
            <slot :name="slot" :scope="scope"></slot>
          </template>
          <template #append>
            <div class="comp-search__buttons">
              <slot name="beforeSearch"></slot>
              <el-button
                v-if="Config.showAdvancedSearch"
                class="comp-search__drop-down-button"
                plain
                @click="handleToggleDropDown"
                >{{ dropDownButtonText }}</el-button
              >
              <el-button
                type="primary"
                @click="handleSearch"
                icon="el-icon-search"
                >查 询</el-button
              >
              <el-button @click="handleReset">重 置</el-button>
              <el-button
                v-if="Config.form.formItems.length > 5"
                @click="showAll"
                >{{ showAllButtonText }}</el-button
              >
              <slot name="afterSearch"></slot>
            </div>
          </template>
        </base-form>
        <collapse-transition>
          <base-form
            v-show="
              showDropDownForm && Config.advancedSearchType === 'dropDown'
            "
            class="comp-search__drop-down-form"
            :config="Config.advancedSearchForm"
            :formModel="Config.formModel"
          ></base-form>
        </collapse-transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import BaseForm from '../../../base/form/form/src/BaseForm.vue';
import { CompSearchAdapter, CompSearchOutput } from './CompSearch.adapter';
import { COMP_SEARCH_DEFAULT_CONFIG } from './CompSearch.default';
import {
  COMPONENT_TYPE,
  CustomizeComponentBase
} from '@/core/dtos/factories.dto';
import CustomizeComponentFactory from '@/core/factory/component-customize.factory';
import defaultsDeep from 'lodash/defaultsDeep';
import cloneDeep from 'lodash/cloneDeep';
import collapseTransition from '../../../../utils/vue/collapse-transition';
import { COMPONENT_CONFIG } from '../../../../../config/component.config';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';

@Component({
  name: 'CompSearch',
  components: {
    BaseForm,
    collapseTransition
  }
})
export default class CompSearch extends Mixins(CustomizeComponentFactory)
  implements CustomizeComponentBase {
  @Prop({ type: Object }) searchConfig!: CompSearchAdapter;
  get Config(): CompSearchAdapter {
    this.$set(this.searchConfig.form, 'max', this.max);
    return defaultsDeep(
      this.searchConfig,
      COMPONENT_CONFIG.search,
      COMP_SEARCH_DEFAULT_CONFIG
    );
  }
  get output(): CompSearchOutput {
    return {
      params: this.searchParam,
      reset: this.formOutputs.reset,
      search: this.handleSearch.bind(this)
    };
  }
  get dropDownButtonText() {
    return this.showDropDownForm ? '普通搜索' : '高级搜索';
  }
  get showAllButtonText() {
    return this.max ? '高级搜索' : '普通搜索';
  }

  type = COMPONENT_TYPE.search;
  formOutputs: { [k: string]: any } = {};
  searchParam: { [name: string]: any } = {};
  showDropDownForm = false;
  max? = 5;

  handleSearch() {
    this.searchParam = this.getSearchParam();
    this.emitEventAndExecuteListener(
      'search',
      this.Config.on,
      this.searchParam,
      this.id
    );
  }
  handleReset() {
    this.formOutputs.reset();
  }
  handleToggleDropDown() {
    this.showDropDownForm = !this.showDropDownForm;
  }
  showAll() {
    this.max = this.max ? 0 : 5;
  }
  private getSearchParam() {
    const cloneFormModel = cloneDeep(this.Config.formModel);
    const formModel = this.Config.filterNulls
      ? this.filterNulls(cloneFormModel)
      : cloneFormModel;
    return this.Config.handleSearchParam
      ? this.Config.handleSearchParam(formModel)
      : formModel;
  }

  private filterNulls(params: { [k: string]: any }) {
    const target: { [k: string]: any } = {};
    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (value === '' || isUndefined(value) || isNull(value)) return;
      target[key] = value;
    });
    return target;
  }
}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@include b(comp-search) {
  width: 100%;
  background: #fff;
  padding-top: 22px;
  padding-right: 22px;
  // border-radius: 4px;
  // box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.13);
  @include layout(column);

  @include e(container) {
    width: 100%;
    @include layout();

    @include e(forms) {
      width: auto;
      flex: 1;

      @include e(form) {
        width: 100%;
      }
    }

    @include e(buttons) {
      padding-top: 3px;
      padding-left: 20px;
      @include layout();

      @include e(drop-down-button) {
        color: #4876e7;
        border-color: #4876e7;
        &:hover {
          color: #4876e7;
        }
      }

      .el-button {
        min-width: 70px;
        height: 32px;
        border-radius: 4px;
        font-size: 14px;
        padding: 7px;
      }
    }
  }

  @include e(drop-down) {
    opacity: 0.3;
    height: 30px;
    border-top: 1px solid #eaeefb;
    &:hover {
      i {
        transform: translateX(-40px);
      }
      span {
        display: inline-block;
      }
    }

    i {
      font-size: 16px;
      line-height: 30px;
      transition: 0.3s;
    }

    span {
      position: absolute;
      transform: translateX(-30px);
      font-size: 14px;
      line-height: 44px;
      transition: 0.3s;
      display: none;
    }
  }
}
</style>
