import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// 引入外部资源样式和全局样式
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
import VueKonva from 'vue-konva';
import '@/core/utils/vue/vee-validate';
import {
  CompForm,
  CompFormGroup,
  CompSearch,
  CompDialog,
  CompTabs,
  CompAddEditDialog,
  CompFormDialog,
  CompTree,
  CompDataBus
} from '@/core/components/customize';
import './core/styles/index.scss';
import {
  BaseButton,
  BaseButtonGroup,
  BasePagination,
  BaseDialog,
  BaseInput,
  BaseCheckbox,
  BaseTabs
} from './core/components/base';
import * as _ from 'lodash';

Object.assign(window, _);

const globalComponents = [
  BaseButton,
  BaseButtonGroup,
  BasePagination,
  BaseDialog,
  BaseInput,
  BaseCheckbox,
  BaseTabs,
  CompForm,
  CompFormGroup,
  CompSearch,
  CompDialog,
  CompTabs,
  CompAddEditDialog,
  CompFormDialog,
  CompTree,
  CompDataBus,
];
globalComponents.forEach((component: any) => {
  Vue.component(component.options.name, component);
});
Vue.use(ElementUI);
Vue.use(VueKonva);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
