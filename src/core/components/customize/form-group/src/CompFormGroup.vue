<template>
  <div class="comp-form-group">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide, Watch } from 'vue-property-decorator';

@Component({
  name: 'compFormGroup'
})
export default class CompFormGroup extends Vue {
  isValidateStart = false;
  isValid = true;

  @Watch('isValidateStart')
  onIsValidateStart(val: boolean) {
    if (val) {
      this.validateEnd();
    }
  }

  @Provide('groupValidate')
  validate(v: boolean) {
    this.isValidateStart = true;
    if (!v) this.isValid = v;
  }

  validateEnd() {
    setTimeout(() => {
      this.$emit('validated', this.isValid);
      this.isValid = true;
      this.isValidateStart = false;
    }, 100);
  }
}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@include b(comp-form-group) {
}
</style>
