import { ThemesList } from './../../core/styles/theme/types';

const DEFAULT_THEME: ThemesList = {
  name: 'default',
  base: null,
  variables: {
    // Safari fix
    card: ['#42db7d', '#42db7d', '#42db7d', '#42db7d', '#42db7d']
  }
};

export default DEFAULT_THEME;
