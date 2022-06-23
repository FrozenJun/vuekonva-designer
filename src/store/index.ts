import Vue from 'vue';
import Vuex from 'vuex';

import modules from './module';

Vue.use(Vuex);

export default new Vuex.Store<any>({
  ...modules
});
