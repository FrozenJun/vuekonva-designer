export class CompGridSinkFunc {
  top = 0;

  getMinHeight({
    sink,
    sinkAdapter
  }: {
    sink: boolean | undefined;
    sinkAdapter: number | undefined;
  }) {
    if (sink) {
      const adapterValue = sinkAdapter || 0;
      return `calc(100vh - ${this.top + adapterValue}px)`;
    } else {
      return null;
    }
  }

  setTop(el: Element) {
    this.top = el.getBoundingClientRect().top;
  }
}

export class CompGridParamsFunc {
  params = {};

  setParams = (params: { [name: string]: any }) => {
    this.params = params;
  };
}
