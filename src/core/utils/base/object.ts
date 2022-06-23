import { dasherize } from './strings';

/**
 * 从obj中根据path获取值

 ```javascript
 const obj = { a: [{ b: 1 }] };
 getPropByPath(obj, 'a.0.b') // { o: obj, k: 'b', v: 1 }
 ```

 * @param obj 获取数据对象
 * @param path 路径
 * @param strict 是否严格模式
 * @return 返回一个对象，o: 传入对象；k:获取到的值对应的key；v:获取到的值
 */
export function getPropByPath(obj: any, path: string, strict: boolean = true) {
  let tempObj = obj;
  path = path.replace(/\[(\w+)\]/g, '.$1');
  path = path.replace(/^\./, '');
  const keyArr = path.split('.');
  let i = 0;
  for (let len = keyArr.length; i < len - 1; ++i) {
    if (!tempObj && !strict) break;
    const key = keyArr[i];
    if (key in tempObj) {
      tempObj = tempObj[key];
    } else {
      if (strict) {
        throw new Error('please transfer a valid prop path to form item!');
      }
      break;
    }
  }
  return {
    o: tempObj,
    k: keyArr[i],
    v: tempObj ? tempObj[keyArr[i]] : null
  };
}

/**
 * 将对象的属性名改为短横线连接
 * ```javascript
 * { textName: '' } // { text-name: '' }
 * ```
 * @param obj 修改属性名的对象
 */
export const dasherizeKeys = function(
  obj: { [k: string]: any } | undefined
): { [k: string]: any } {
  if (!obj) return {};
  const target: { [k: string]: any } = {};
  Object.keys(obj).forEach((key) => {
    target[dasherize(key)] = obj[key];
  });
  return target;
};
