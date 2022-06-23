import { addClass, removeClass } from '../../utils/dom/class';

import DEFAULT_THEME from '@/app/themes/default';
import { ThemesList } from './types';

export default (function() {
  const themes: ThemesList[] = [DEFAULT_THEME];

  let currentTheme: ThemesList;
  let previousTheme: string;

  const changeTheme = (name: string) => {
    const selectedTheme = themes.find((theme) => {
      return theme.name === name;
    });
    if (!selectedTheme) {
      console.error(`${name}主题不存在，请重新传入正确的值`);
      return;
    }

    const body: HTMLElement = document.getElementsByTagName('body')[0];
    if (previousTheme) {
      removeClass(body, `nb-theme-${previousTheme}`);
    }
    addClass(body, `nb-theme-${name}`);

    currentTheme = selectedTheme;
    previousTheme = name;
  };

  const getTheme = () => {
    return currentTheme;
  };

  return {
    changeTheme,
    getTheme
  };
})();
