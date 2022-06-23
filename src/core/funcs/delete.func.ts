import { eventBus } from '@/core/utils/vue/event-bus';

export interface DeleteFuncOption {
  api: Function;
  apiParam: { [name: string]: any };
  isNeedComfirm?: boolean;
  comfirmText?: string;
}

/**
 * 删除功能
 */
export class DeleteFunc {
  api!: Function;
  apiParam: object = {};
  isNeedComfirm = true;
  comfirmText = '此操作不可逆, 是否继续?';

  constructor({ api, apiParam, isNeedComfirm, comfirmText }: DeleteFuncOption) {
    this.api = api;
    this.apiParam = apiParam;
    this.isNeedComfirm =
      typeof isNeedComfirm === 'boolean' ? isNeedComfirm : this.isNeedComfirm;
    this.comfirmText = comfirmText || this.comfirmText;
  }

  /**
   * 如果删除成功，返回true,否则返回undefinde
   * ```javascript
   * const res = await new DeleteFunc(options).delete()
   * if (res) // 删除成功
   * if (!res) // 删除失败
   * ```
   */
  async delete() {
    if (this.isNeedComfirm) {
      try {
        await eventBus.$confirm(this.comfirmText, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        const res = await this.sendDeleteApi();
        return res;
      } catch (e) {
        // 用户关闭了提示
      }
    } else {
      const res = await this.sendDeleteApi();
      return res;
    }
  }

  /**
   * 发送删除请求
   */
  private async sendDeleteApi() {
    const res = await this.api(this.apiParam);
    if (!res) return;
    eventBus.$message.success('删除成功');
    return true;
  }
}
