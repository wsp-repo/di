/**
 * Исключение неизменяемых свойств
 */
export function throwSetter(): void {
  throw new Error('Property not writeble');
}
