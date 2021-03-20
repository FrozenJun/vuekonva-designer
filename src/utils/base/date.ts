/**
  毫秒数转时间

  ```javascript
  DateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss') // 2019-1-1 00:00:00
  DateFormat(new Date(), 'yyyy-MM-dd') // 2019-1-1
  DateFormat(new Date(), 'hh:mm:ss') // 00:00:00
  ```

  @date Date 标准时间
  @format string 格式 举例'yyyy-MM-dd hh:mm:ss'
 */
export const DateFormat = function(date: Date, format: string) {
  if (!date || !format) return '';
  const o = {
    'M+': date.getMonth() + 1, // month
    'd+': date.getDate(), // day
    'h+': date.getHours(), // hour
    'm+': date.getMinutes(), // minute
    's+': date.getSeconds(), // second
    'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
    S: date.getMilliseconds() // millisecond
  };
  if (/(y+)/.test(format))
    format = format.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1
          ? (o as any)[k]
          : ('00' + (o as any)[k]).substr(('' + (o as any)[k]).length)
      );
    }
  }
  return format;
};
