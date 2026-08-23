/**
 * Artificial delay on every mock API call.
 *
 * A demo that resolves in 0ms feels fake and hides the loading states we
 * actually designed. 300-600ms is what real software feels like.
 */
export function sleep(min = 300, max = 600): Promise<void> {
  const ms = min + Math.random() * (max - min);
  return new Promise((resolve) => setTimeout(resolve, ms));
}
