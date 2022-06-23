<template>
  <div class="comp-data-bus"></div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import {
  COMPONENT_TYPE,
  CustomizeComponentBase
} from '@/core/dtos/factories.dto';
import {
  CompDataBusAdapter,
  CompDataBusOutput,
  EmitBody
} from './CompDataBus.adapter';
import { COMP_DATA_BUS_DEFAULT_CONFIG } from './CompDataBus.default';
import CustomizeComponentFactory from '@/core/factory/component-customize.factory';
import defaultsDeep from 'lodash/defaultsDeep';

@Component({
  name: 'CompDataBus'
})
export default class CompDataBus extends Mixins(CustomizeComponentFactory)
  implements CustomizeComponentBase {
  @Prop({ type: Object }) dataBusConfig!: CompDataBusAdapter;
  @Prop({ type: String, default: '' }) name!: string;
  get Config(): CompDataBusAdapter {
    return defaultsDeep(
      this.dataBusConfig,
      { name: this.name },
      COMP_DATA_BUS_DEFAULT_CONFIG
    );
  }
  get output(): CompDataBusOutput {
    return {
      send: this.send.bind(this),
      emit: this.emit.bind(this)
    };
  }

  send(data: any) {
    this.$emit('on', data);
  }

  emit(emitBody: string | EmitBody) {
    if (typeof emitBody === 'string') {
      this.$emit(emitBody);
    } else {
      this.$emit(emitBody.eventName, emitBody.data);
    }
  }

  type = COMPONENT_TYPE.dataBus;
}
</script>

<style lang="scss">
@import 'src/core/styles/export.scss';

@include b(comp-data-bus) {
  display: none;
}
</style>
