import { ButtonAdapter } from './BaseButton.adapter';
import { hasPermission } from '@/core/acl/src/acl.util';

export const BUTTON_DEFAULT: ButtonAdapter = {
  visable: true,
  hasPermission: hasPermission
};
