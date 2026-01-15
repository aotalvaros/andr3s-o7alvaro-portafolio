
/**
 * Genera un número aleatorio seguro entre min (inclusivo) y max (exclusivo).
 * Reemplaza a Math.random() * (max - min) + min
 */
export const getSecureRandomInRange = (min: number, max: number): number => {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  
  const randomDecimal = array[0] / (0xffffffff + 1);

  return randomDecimal * (max - min) + min;
};