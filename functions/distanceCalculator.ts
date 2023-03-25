const calculateHeightFromDistanceHorizontal = (
  distanceFromWall: number,
): number => {
  const tan = Math.tan((34.695 * Math.PI) / 180);
  const distanceInches = distanceFromWall * 12 - 25;
  const distance = distanceInches / 12;
  return distance * tan * 2;
};

const calculateDistanceFromHeightHorizontal = (wallHeight: number): number => {
  const tan = Math.tan((34.695 * Math.PI) / 180);
  return wallHeight / 2 / tan + 2.08;
};

export {
  calculateHeightFromDistanceHorizontal,
  calculateDistanceFromHeightHorizontal,
};
