/** pgvector accepts this bracketed, comma-separated text format cast to `::vector`. */
export function toPgVectorLiteral(vector: number[]): string {
  return `[${vector.join(',')}]`;
}
