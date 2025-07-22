import { borderRadius } from './borderRadius';
import { spacing } from './spacing';
import { typography } from './typography';

export const baseTokens = {
  ...borderRadius,
  ...spacing,
  ...typography,
} as const;

export type BaseTokens = typeof baseTokens;
