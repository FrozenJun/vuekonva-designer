declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module 'vue-quill-editor' {
  const quillEditor: any;
  export { quillEditor };
}
