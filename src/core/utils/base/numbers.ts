/**
 * @function 补零，根据length长度补全数字前的0
 * 例如(7, 2) => '07'
 */
export function zeroize(value: number, length = 2): string {
  const lengthDiff = length - String(value).length;
  const zeroNumber = lengthDiff > 0 ? lengthDiff : 0;
  return new Array(zeroNumber).fill(0).join('') + value;
}
