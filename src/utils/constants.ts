export const TIME = 30;

export const PENALTY_DURATION = 5000; //time in ms.
export const SHAKE_DURATION = 500; //time in ms.

export type LEVEL_PROPERTY = {
  cssProperty: string;
  min: number;
  max: number;
};

export const LEVEL_PROPERTIES: Record<number, LEVEL_PROPERTY> = {
  1: {
    cssProperty: '-webkit-text-stroke-width',
    min: 1,
    max: 10,
  },
  2: {
    cssProperty: 'font-variation-settings',
    min: 25,
    max: 152,
  },
  3: {
    cssProperty: 'font-variation-settings',
    min: 100,
    max: 900,
  },
  4: {
    cssProperty: 'border-radius',
    min: 0,
    max: 32,
  },
  5: {
    cssProperty: 'opacity',
    min: 0,
    max: 100,
  },
  6: {
    cssProperty: 'box-shadow',
    min: 0,
    max: 30,
  },
  7: {
    cssProperty: 'box-shadow',
    min: 0,
    max: 360,
  },
};

// export const LEVEL_PROPERTIES: Record<number, string> = {
//   1: '-webkit-text-stroke-width',
//   2: 'font-variation-settings',
//   3: 'font-variation-settings',
//   4: 'border-radius',
//   5: 'opacity',
//   6: 'box-shadow',
//   7: 'box-shadow',
// };

export const PERFECT_PERCENT = 10;
export const GOOD_PERCENT = 20;

export const POINTS_FOR_PERFECT = 2;
export const POINTS_FOR_GOOD = 1;

export const COLORS = {
  SUCCESS: '#37D200',
  ERROR: '#E50404',
  BRAND_PURPLE: '#6c39ff',
};

export const CLASSNAMES = {
  SUCCESS: 'is-success',
  ERROR: 'is-error',
  ACTIVE: 'is-active',
  SHAKE: 'shake-element',
};
