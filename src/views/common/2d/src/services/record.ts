import store from '@/store';
import { RECORDS_MAX_LENGTH } from '../constants/variable.constant';

/**
 * 记录服务，撤销和恢复功能
 */
export class RecordService {
  index = 0; // 当前展示记录的位置
  records: any[] = []; // 记录数据的数组

  get content() {
    return store.state.content;
  }
  get isRevokeDisabled() {
    return this.index < 2;
  }
  get isRestoreDisabled() {
    return this.index === this.records.length;
  }

  add() {
    this.index++;
    this.records = this.records.filter((i, n) => n < this.index - 1);
    this.records.push(_.cloneDeep(this.content));
    if (this.records.length > RECORDS_MAX_LENGTH) {
      this.records.shift();
      this.index = RECORDS_MAX_LENGTH;
    }
  }
  /** 撤销 */
  revoke() {
    if (this.index < 2) return;
    this.index--;
    this.setContentByRecordContent();
  }
  /** 恢复 */
  restore() {
    if (this.index > this.records.length - 1) return;
    this.index++;
    this.setContentByRecordContent();
  }

  setContentByRecordContent() {
    const { shapeList, canvas } = this.records[this.index - 1];
    // 不能直接赋值，会导致当前shapeList和全局的不是用一个数组。使用先清空后push的方法
    // cloneDeep防止改变shapeList也改变了records
    this.content.shapeList.splice(0, this.content.shapeList.length);
    _.cloneDeep(shapeList).forEach((item: any) => {
      this.content.shapeList.push(item);
    });
    _.assign(this.content.canvas, canvas);
    // 无论恢复撤销，操作之后要清空当前已选择的cells
    store.commit('setCurrentCells', []);
  }
}
