/**
 * 手机号码
 */
export const MOBILE_REGEXP = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[189])\d{8}$/;
/**
 * 固定电话
 */
export const TELEPHONE_REGEXP = /^(([0+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
/**
 * 正整数
 */
export const POS_INT_REGEXP = /^[1-9]\d*$/;
/**
 * 正实数
 */
export const POS_FLOAT_REGEXP = /^[1-9]\d*(\.\d+)?|0\.\d+$/;
/**
 * 汉字
 */
export const CHINESE_REGEXP = /^[\u4e00-\u9fa5]{0,}$/;
/**
 * 身份证
 */
export const ID_CARD_REGEXP = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/;
/**
 * 护照
 */
export const PASSPORT_REGEXP = /^1[45][0-9]{7}$|(^[P|p|S|s]\d{7}$)|(^[S|s|G|g|E|e]\d{8}$)|(^[Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8}$)|(^[H|h|M|m]\d{8,10}$)/;
/**
 * IP
 */
export const IP_REGEXP = /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/;
