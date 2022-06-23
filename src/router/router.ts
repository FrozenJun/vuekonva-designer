import Vue from 'vue';
import Router, { RawLocation } from 'vue-router';
import CommonRoutes from '../views/common/index.route';

/**
 * 修复vue router 3.1.1以下，push相同路由会报错的问题
 */
const originalPush = Router.prototype.push;
Router.prototype.push = function(loation: RawLocation) {
  const push = originalPush.bind(this);
  return push(loation).catch((e: Error) => e) as any;
};

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/2d/1'
    },
    ...CommonRoutes,
    {
      path: '*',
      redirect: '/2d/1'
    }
  ]
});
