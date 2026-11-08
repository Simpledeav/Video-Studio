/** Stable pseudo-random values for decorative geometry. Never changes frame to frame. */
export const seeded = (index: number, salt = 0): number => {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

export const seededRange = (index: number, min: number, max: number, salt = 0) =>
  min + seeded(index, salt) * (max - min);
