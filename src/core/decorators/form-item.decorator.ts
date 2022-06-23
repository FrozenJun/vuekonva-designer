/**
 * 获取formItem
 *
 * ```javascript
 * @FormItem('config.form') name?: BaseFromItemAdapter; // {modelName: 'name', label: '名称'}
 *
 * config = {
 *  form: { formItems: [{ modelName: 'name', label: '名称' }] }
 * }
 * ```
 *
 * @param formPath 找到form的字符串路径
 * @param modelName formItem的modelName，没有则取propertyKey
 */
export function FormItem(formPath: string, modelName?: string) {
  const path = `${formPath}.formItems`;
  return function(target: any, propertyKey: string) {
    if (delete target[propertyKey]) {
      Object.defineProperty(target, propertyKey, {
        get(this: any) {
          const items = _.get(this, path, []);
          return _.find(items, { modelName: modelName || propertyKey });
        },
        enumerable: true,
        configurable: true
      });
    }
  };
}
