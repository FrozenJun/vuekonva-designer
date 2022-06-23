import Vue from 'vue';
import { ACLService } from './acl.service';

Vue.directive('acl', {
  bind: function(el, binding, vnode) {
    console.log(binding);
    const service = ACLService;
    service.addRoles([]);
  }
});

Vue.directive('acl-if', {
  bind: function(el, binding, vnode) {
    console.log(binding);
    const service = ACLService;
    service.addRoles([]);
  }
});
