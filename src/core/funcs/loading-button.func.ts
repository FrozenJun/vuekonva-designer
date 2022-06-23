export class LoadingButtonFunc {
  loading = false;
  normalText = '';
  loadingText = '';

  text = '';

  constructor(normalText: string, loadingText: string) {
    this.normalText = normalText;
    this.text = normalText;
    this.loadingText = loadingText;
  }

  start() {
    this.loading = true;
    this.text = this.loadingText;
  }
  end() {
    this.loading = false;
    this.text = this.normalText;
  }
}
