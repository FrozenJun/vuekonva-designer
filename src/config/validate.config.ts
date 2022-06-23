import { extend } from 'vee-validate';

// 标识 - 小写字母、数字、下划线
extend('var', {
  message: () => '只能由小写字母、数字、下划线组成，不能纯数字',
  validate: (value) => {
    return /^(?!\d+$)([a-z0-9_]{1,})$/.test(value);
  }
});

// url - 字母、数字，斜杠、短横线
extend('url', {
  message: () => '只能由字母、数字、斜杠、冒号、短横线组成',
  validate: (value) => {
    return /^([a-zA-Z0-9/:-]{1,})$/.test(value);
  }
});

// java包名 - 小写字母、点
extend('package', {
  message: () => '只能由字母、点组成',
  validate: (value) => {
    return /^([a-zA-Z.]{1,})$/.test(value);
  }
});

// 名称 - 中文、大小写字母、数字、短划线、下划线和小数点
extend('name', {
  message: () => '只能由中文、大小写字母、数字、短划线、下划线和小数点组成',
  validate: (value) => {
    return /^([\u4e00-\u9fa5a-zA-Z0-9-_.]{1,})$/.test(value);
  }
});

// 小写字母 数字 下划线组合
extend('alpha_line', {
  message: () => '只能是小写字母、数字',
  validate: (value) => {
    return /^[a-z0-9]+$/.test(value);
  }
});
