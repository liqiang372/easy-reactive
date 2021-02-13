import { COLORS } from '../constants';

export const getActiveStreamProps = (isActiveStream) => {
  if (isActiveStream) {
    return {
      fill: COLORS.PURPLE_1,
      x: 0
    }
  }
  return {
    x: -10
  }
}

export const transformText = (tick, prefix) => {
  return prefix + tick.substring(1);
}