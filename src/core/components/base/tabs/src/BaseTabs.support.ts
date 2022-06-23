export class BaseTabsActiveBarFunc {
  el?: Element;

  setScale(scale: number | undefined, tabsEl: Element) {
    if (!scale) return;
    this.el =
      this.el || tabsEl.getElementsByClassName('el-tabs__active-bar')[0];
    if (!this.el) return;
    const oldStyle = this.el.getAttribute('style') || '';
    const newStyle = oldStyle
      .split(';')
      .map((i) => {
        if (i.includes('transform')) {
          if (i.includes('scaleX')) {
            return i.replace(/scaleX(.*)/, `scaleX(${scale})`);
          } else {
            return `${i} scaleX(${scale})`;
          }
        }
        return i;
      })
      .join(';');
    this.el.setAttribute('style', newStyle);
  }
}
