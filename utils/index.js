import { COLORS } from '../constants';

export const getActiveStreamProps = (which, activeStream) => {
  if (which === activeStream) {
    return {
      fill: COLORS.PURPLE_1,
      x: 0
    }
  }
  return {
    x: -10
  }
}