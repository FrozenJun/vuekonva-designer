import { MOBILE_REGEXP } from './../utils/base/reg-exp';
export interface SendSmsFuncOption {
  api: Function;
  smsKey: string;
  intervalTime?: number;
  initText?: string;
  secondText?: string;
  countdownText?: string;
}

export class SendSmsFunc {
  api!: Function;
  smsKey!: string;
  intervalTime = 60;
  disable = false;
  initText = '发送验证码';
  secondText = '再次发送';
  countdownText = '{s}秒后再次发送';

  showText = this.initText;

  constructor({
    api,
    smsKey,
    intervalTime,
    initText,
    secondText,
    countdownText
  }: SendSmsFuncOption) {
    this.api = api;
    this.smsKey = smsKey;
    this.intervalTime = intervalTime || this.intervalTime;
    this.initText = initText || this.initText;
    this.secondText = secondText || this.secondText;
    this.countdownText = countdownText || this.countdownText;
  }

  async send(mobile: string) {
    if (!MOBILE_REGEXP.test(mobile)) return;
    this.disable = true;
    const res = await this.api({ [this.smsKey]: mobile });
    if (!res) {
      this.disable = false;
      return;
    }
    let time = this.intervalTime;
    const interval = setInterval(() => {
      if (time < 0) {
        clearInterval(interval);
        this.disable = false;
        this.showText = this.secondText;
      } else {
        this.showText = this.countdownText.replace(/\{s\}/, String(time));
        time--;
      }
    }, 1000);
  }
}
