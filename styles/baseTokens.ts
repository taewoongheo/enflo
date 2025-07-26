import { borderRadius } from './borderRadius';
import { iconSize } from './iconSize';
import { spacing } from './spacing';
import { typography } from './typography';

export const baseTokens = {
  borderRadius,
  spacing,
  typography,
  iconSize,
};

export type BaseTokens = typeof baseTokens;
