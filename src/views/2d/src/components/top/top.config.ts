import { Component } from 'vue-property-decorator';
import UIComponentFactory from '@/core/factory/component-ui.factory';
import { COMPONENT_METHOD, COMPONENT_DATA } from '@/core/dtos/factories.dto.ts';
import { State } from 'vuex-class';
import { StageDataContent, StageData } from '../../utils/2d.dto';

@Component({})
export class BsTopConfig extends UIComponentFactory {
  COMPONENT_METHOD = COMPONENT_METHOD;
  COMPONENT_DATA = COMPONENT_DATA;

  @State('content') Content!: StageDataContent;
  @State('stageData') StageData?: StageData;

  get isEdited() {
    const stageContent = this.StageData && this.StageData.content;
    const content = JSON.stringify(this.Content);
    return stageContent !== content;
  }
}
