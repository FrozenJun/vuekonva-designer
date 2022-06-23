import store from '@/store';
import { StageDataContent } from '../utils/2d.dto';

/**
 * 组功能
 * 组合，打散
 * 不搞了，需求被我劝退
 */
export class GroupService {
  get content(): StageDataContent {
    return store.state.content;
  }
  get stage() {
    return store.state.stage.getStage();
  }
  get scale() {
    const zoom = store.state.zoomService;
    return zoom ? zoom.scale : 1;
  }
  get layer() {
    return store.state.layer.getNode();
  }
  get currentCells(): any[] {
    return store.state.currentCells || [];
  }

  // 组合
  get combineDisabled() {
    return false;
  }
  combine() {
    console.log(this.currentCells);
  }
  // 打散
  get breakDisabled() {
    return false;
  }
  break() {
    console.log(this.currentCells);
  }
}
