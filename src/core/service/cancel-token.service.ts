import { Canceler } from 'axios';

/**
 * 用于存储当前接口的Canceler
 */
class CancelTokenClass {
  Canceler?: Canceler;

  get() {
    return this.Canceler;
  }
  set(c: Canceler) {
    this.Canceler = c;
  }
}

export const CancelTokenService = new CancelTokenClass();
