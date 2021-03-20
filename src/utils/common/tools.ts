/**
   * 配合async/await,使函数一直等待，直到val存在
   * 不要传入一个非引用变量，否则永远不会存在
   ``` javascript
   await waitUnitResultTrue(() => this.$el) // 等待直到vue绑定dom完成
   ```
   @param handleFunction 处理函数，一直等待直到handleFunction返回true
   */
export async function waitUnitResultTrue(
  handleFunction: (...args: any[]) => boolean
) {
  let maxTime = (10 * 1000) / 100; // 10s
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      maxTime--;
      if (handleFunction()) {
        clearInterval(interval);
        resolve();
      }
      if (maxTime < 0) {
        clearInterval(interval);
      }
    }, 100);
  });
}
