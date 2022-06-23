/**
 * 图片二维码功能
 */
export class CaptchaFunc {
  url = '';

  constructor(url: string) {
    this.url = url;
  }

  /**
   * 重新获取图片验证码
   */
  getAgain() {
    const url = this.url;
    this.url = '';
    setTimeout(() => {
      this.url = url;
    }, 0);
  }
}
