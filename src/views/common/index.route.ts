export default [
  {
    name: '2d',
    path: '/2d/:id',
    component: () => import(/* webpackChunkName: "2d" */ './2d')
  }
];
