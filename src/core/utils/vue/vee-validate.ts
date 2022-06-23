import {
  MOBILE_REGEXP,
  ID_CARD_REGEXP,
  TELEPHONE_REGEXP,
  POS_INT_REGEXP,
  POS_FLOAT_REGEXP,
  CHINESE_REGEXP,
  PASSPORT_REGEXP,
  IP_REGEXP
} from './../base/reg-exp';
import Vue from 'vue';
import {
  ValidationProvider,
  ValidationObserver,
  extend,
  localize,
  setInteractionMode
} from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
import CN from 'vee-validate/dist/locale/zh_CN.json';
import '@/config/validate.config';

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

setInteractionMode('lazy', () => {
  return {
    on: ['change', 'blur']
  };
});

localize({
  CN
});

Object.keys(rules).forEach((rule) => {
  extend(rule, {
    ...(rules as any)[rule],
    message: (CN.messages as any)[rule] // 返回函数会导致替换模板字符串失败
  });
});

// 身份证
extend('IDCard', {
  message: () => '身份证格式不正确',
  validate: (value) => {
    return ID_CARD_REGEXP.test(value);
  }
});
// 手机号验证
extend('mobile', {
  message: () => '手机号输入不正确',
  validate: (value) => {
    return MOBILE_REGEXP.test(value);
  }
});
// 固定电话验证
extend('telephone', {
  message: () => '固定电话输入不正确',
  validate: (value) => {
    return TELEPHONE_REGEXP.test(value);
  }
});
// 正整数
extend('pos_int', {
  message: () => '只能是正整数',
  validate: (value) => {
    return POS_INT_REGEXP.test(value);
  }
});
// 正实数
extend('pos_float', {
  message: () => '只能是正实数',
  validate: (value) => {
    return POS_FLOAT_REGEXP.test(value);
  }
});
// 非负浮点数
extend('no_neg_float', {
  message: () => '只能是非负实数',
  validate: (value) => {
    return /^\d+(\.\d+)?$/.test(value);
  }
});
// 汉字
extend('chinese', {
  message: () => '只能是汉字',
  validate: (value) => {
    return CHINESE_REGEXP.test(value);
  }
});
// 数字或大写字母
extend('upper_num', {
  message: () => '只能是数字或者大写字母',
  validate: (value) => {
    return /^[A-Z0-9]+$/.test(value);
  }
});
// 地址 - 汉字、数字、—。
extend('address', {
  message: () => '只能由汉字、数字、大小写字母、—组成',
  validate: (value) => {
    return /^[\u4e00-\u9fa5A-Za-z0-9-]+$/.test(value);
  }
});
// 不包含数字
extend('no_num', {
  message: () => '不能包含数字',
  validate: (value) => {
    return /^[\D]+$/.test(value);
  }
});
// 不包含特殊字符
extend('no_special', {
  message: () => '不能包含特殊字符',
  validate: (value) => {
    return /^[\u4e00-\u9fa5A-Za-z0-9]{0,}$/.test(value);
  }
});
// 护照
extend('hz', {
  message: () => '请输入正确的护照',
  validate: (value) => {
    return PASSPORT_REGEXP.test(value);
  }
});
// IP
extend('ip', {
  message: () => '请输入正确的IP地址',
  validate: (value) => {
    return IP_REGEXP.test(value);
  }
});
// 确认密码
extend('check_password', {
  message: () => '确认密码和密码不一致',
  validate: (value, { other }: any) => value === other,
  params: [{ name: 'other', isTarget: true }]
});
