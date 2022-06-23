<template>
  <!-- ValidationProvider name重复会导致ValidationObserver验证只验证同name的最后一个 -->
  <!-- v-show会导致验证，动态显示的表单出现问题 -->
  <ValidationProvider
    v-if="Config.visible"
    class="base-form-item"
    :rules="Config.rule"
    :name="Config.validateName || Config.label"
    v-slot="{ errors }"
    :events="Config.validateOn"
    :style="{ width: Config.width || formConfig.itemWidth }"
  >
    <el-form-item
      :class="{
        'base-form-item__item': true,
        'is-required': Config.rule.includes('required'),
        'is-error': errors[0],
        [`content-${Config.contentAlign || formConfig.itemContentAlign}`]: true
      }"
      v-bind="bindConfig"
      inner
    >
      <slot
        v-if="Config.slots && Config.slots.prefix"
        :name="Config.slots.prefix"
        :scope="Config"
      ></slot>

      <template v-if="Config.labelIcon" #label>
        <i :class="[Config.labelIcon]"></i>
      </template>

      <base-input
        v-if="!Config.type || Config.type === 'input'"
        :class="[Config.modelClassName]"
        :config="Config.inputConfig"
        v-model="formModel[Config.modelName]"
        inner
        :name="Config.modelName"
      >
        <template v-for="(_, slot) in $scopedSlots" #[slot]="{scope}">
          <slot :name="slot" :scope="scope"></slot>
        </template>
      </base-input>

      <base-select
        v-else-if="Config.type === 'select'"
        :class="[Config.modelClassName]"
        :config="Config.selectConfig"
        v-model="formModel[Config.modelName]"
        inner
        :name="Config.modelName"
      >
        <template
          v-for="(name, slot) in (Config.selectConfig &&
            Config.selectConfig.slots) ||
            {}"
          #[slot]
        >
          <slot :name="name"></slot>
        </template>
      </base-select>

      <base-datetime
        v-else-if="Config.type === 'datetime'"
        :class="[Config.modelClassName]"
        :config="Config.datetimeConfig"
        v-model="formModel[Config.modelName]"
        inner
        :name="Config.modelName"
      >
        <template
          v-for="(name, slot) in (Config.datetimeConfig &&
            Config.datetimeConfig.slots) ||
            {}"
          #[slot]
        >
          <slot :name="name"></slot>
        </template>
      </base-datetime>

      <base-tree-select
        v-else-if="Config.type === 'treeSelect'"
        :class="[Config.modelClassName]"
        :config="Config.treeSelectConfig"
        v-model="formModel[Config.modelName]"
        inner
        :name="Config.modelName"
        ref="treeSelect"
      >
        <template
          v-for="(name, slot) in (Config.treeSelectConfig &&
            Config.treeSelectConfig.slots) ||
            {}"
          #[slot]
        >
          <slot :name="name"></slot>
        </template>
      </base-tree-select>

      <base-upload
        v-else-if="Config.type === 'upload'"
        :class="[Config.modelClassName]"
        :config="Config.uploadConfig"
        v-model="formModel[Config.modelName]"
        inner
        :name="Config.modelName"
      >
        <template
          v-for="(name, slot) in (Config.uploadConfig &&
            Config.uploadConfig.slots) ||
            {}"
          #[slot]
        >
          <slot :name="name"></slot>
        </template>
      </base-upload>

      <base-cascader
        v-else-if="Config.type === 'cascader'"
        :class="[Config.modelClassName]"
        :config="Config.cascaderConfig"
        v-model="formModel[Config.modelName]"
        inner
        :name="Config.modelName"
      >
        <template
          v-for="(name, slot) in (Config.cascaderConfig &&
            Config.cascaderConfig.slots) ||
            {}"
          #[slot]
        >
          <slot :name="name"></slot>
        </template>
      </base-cascader>

      <base-input-number
        v-else-if="Config.type === 'inputNumber'"
        :class="[Config.modelClassName]"
        :config="Config.inputNumberConfig"
        v-model="formModel[Config.modelName]"
        inner
        :name="Config.modelName"
      ></base-input-number>

      <base-checkbox
        v-else-if="Config.type === 'checkbox'"
        :class="[Config.modelClassName]"
        :config="Config.checkboxConfig"
        v-model="formModel[Config.modelName]"
        inner
        :name="Config.modelName"
      ></base-checkbox>

      <base-checkbox-group
        v-else-if="Config.type === 'checkboxGroup'"
        :class="[Config.modelClassName]"
        :config="Config.checkboxGroupConfig"
        v-model="formModel[Config.modelName]"
        inner
        :name="Config.modelName"
      ></base-checkbox-group>

      <base-switch
        v-else-if="Config.type === 'switch'"
        :class="[Config.modelClassName]"
        :config="Config.switchConfig"
        v-model="formModel[Config.modelName]"
        inner
        :name="Config.modelName"
      ></base-switch>

      <base-raido
        v-else-if="Config.type === 'raido'"
        :class="[Config.modelClassName]"
        :config="Config.raidoConfig"
        v-model="formModel[Config.modelName]"
        inner
        :name="Config.modelName"
      ></base-raido>

      <base-color-picker
        v-else-if="Config.type === 'colorPicker'"
        :class="[Config.modelClassName]"
        :config="Config.colorPickerConfig"
        v-model="formModel[Config.modelName]"
        inner
        :name="Config.modelName"
      ></base-color-picker>

      <base-array-form
        v-else-if="Config.type === 'arrayForm'"
        :class="[Config.modelClassName]"
        :config="Config.arrayFormConfig"
        v-model="formModel[Config.modelName]"
        inner
        :name="Config.modelName"
      >
        <template v-for="(_, slot) in $scopedSlots" #[slot]="{scope}">
          <slot :name="slot" :scope="scope"></slot>
        </template>
      </base-array-form>

      <base-autocomplete
        v-else-if="Config.type === 'autocomplete'"
        :class="[Config.modelClassName]"
        :config="Config.autocompleteConfig"
        v-model="formModel[Config.modelName]"
        inner
        :name="Config.modelName"
      >
        <template
          v-for="(name, slot) in (Config.autocompleteConfig &&
            Config.autocompleteConfig.slots) ||
            {}"
          #[slot]
        >
          <slot :name="name"></slot>
        </template>
      </base-autocomplete>

      <span
        v-else-if="Config.type === 'empty'"
        :class="[Config.modelClassName]"
      ></span>

      <slot
        v-else-if="Config.type === 'slot'"
        :name="Config.slotConfig.name"
        :scope="Config.slotConfig.scope"
      ></slot>

      <slot
        v-if="Config.slots && Config.slots.append"
        :name="Config.slots.append"
        :scope="Config"
      ></slot>

      <span class="base-form-item__error">{{ errors[0] }}</span>
      <span v-if="!errors[0] && Config.tip" class="base-form-item__tip">
        {{ Config.tip }}
      </span>
    </el-form-item>
  </ValidationProvider>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { BaseFormItemAdapter } from './BaseFormItem.adapter';
import { BASE_FORM_ITEM_DEFAULT_CONFIG } from './BaseFormItem.default';
import defaultsDeep from 'lodash/defaultsDeep';
import BaseDatetime from '../../datetime/src/BaseDatetime.vue';
import BaseUpload from '../../upload/src/BaseUpload.vue';
import BaseCascader from '../../cascader/src/BaseCascader.vue';
import BaseCheckbox from '../../checkbox/src/BaseCheckbox.vue';
import BaseCheckboxGroup from '../../checkbox-group/src/BaseCheckboxGroup.vue';
import BaseAutocomplete from '../../autocomplete/src/BaseAutocomplete.vue';
import BaseSwitch from '../../switch/src/BaseSwitch.vue';
import BaseRaido from '../../raido/src/BaseRaido.vue';
import BaseInputNumber from '../../input-number';
import BaseArrayForm from '../../array-form';
import BaseColorPicker from '../../color-picker';
import BaseInput from '../../input/src/BaseInput.vue';
import BaseSelect from '../../select/src/BaseSelect.vue';
import BaseTreeSelect from '../../tree-select/src/BaseTreeSelect.vue';
import { FormAdapter } from '../../form/src/BaseForm.adapter';
import BaseComponentFactory from '@/core/factory/component-base.factory';

@Component({
  components: {
    BaseInput,
    BaseSelect,
    BaseDatetime,
    BaseUpload,
    BaseTreeSelect,
    BaseCascader,
    BaseCheckbox,
    BaseCheckboxGroup,
    BaseAutocomplete,
    BaseSwitch,
    BaseRaido,
    BaseInputNumber,
    BaseArrayForm,
    BaseColorPicker
  }
})
export default class BaseFormItem extends Mixins(BaseComponentFactory) {
  @Prop({ type: Object }) config!: BaseFormItemAdapter;
  @Prop({ type: Object }) formConfig!: FormAdapter;
  @Prop({ type: Object }) formModel!: { [name: string]: any };
  @Prop({ type: String, default: '' }) compName?: string;
  @Prop({ type: Boolean }) inner?: boolean;

  get Config(): BaseFormItemAdapter {
    return defaultsDeep(this.config, BASE_FORM_ITEM_DEFAULT_CONFIG);
  }
}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@include b(base-form-item) {
  position: relative;
  @include e(item) {
    position: relative;

    &.content-left {
      .el-form-item__content {
        text-align: left;
      }
    }
    &.content-mid {
      .el-form-item__content {
        text-align: center;
      }
    }
    &.content-right {
      .el-form-item__content {
        text-align: right;
      }
    }

    @include when(error) {
      .el-input__inner {
        border-color: #eb2828;
      }
    }
  }

  @include e(error) {
    display: inline;
    position: absolute;
    bottom: -12px;
    left: 10px;
    width: 100%;
    color: red;
    font-size: 0.75rem;
    line-height: 1;
    text-align: left;
  }

  @include e(tip) {
    display: inline;
    position: absolute;
    bottom: -12px;
    left: 10px;
    width: 100%;
    color: #aaa;
    font-size: 0.75rem;
    line-height: 1;
    text-align: left;
  }
}
</style>
