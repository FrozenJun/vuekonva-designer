export const isIOS = !!(
  (window.navigator && window.navigator.userAgent) ||
  ''
).match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

export const isAndroid =
  ((window.navigator && window.navigator.userAgent) || '').indexOf('Android') >
    -1 ||
  ((window.navigator && window.navigator.userAgent) || '').indexOf('Adr') > -1;

export const isColor = function(value: any) {
  const colorReg = /^#([a-fA-F0-9]){3}(([a-fA-F0-9]){3})?$/;
  const rgbaReg = /^[rR][gG][bB][aA]\(\s*((25[0-5]|2[0-4]\d|1?\d{1,2})\s*,\s*){3}\s*(\.|\d+\.)?\d+\s*\)$/;
  const rgbReg = /^[rR][gG][bB]\(\s*((25[0-5]|2[0-4]\d|1?\d{1,2})\s*,\s*){2}(25[0-5]|2[0-4]\d|1?\d{1,2})\s*\)$/;

  return colorReg.test(value) || rgbaReg.test(value) || rgbReg.test(value);
};
