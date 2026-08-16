const { performance } = require('perf_hooks');

const ISLANDS = Array.from({ length: 1000 }, (_, i) => ({
  id: `isla_${i}`,
  name: `Isla ${i}`,
  order: i,
  requiredPebbles: i * 3,
  unlockedContentId: `story_${i}`
}));

const unlockedIslandIds = Array.from({ length: 999 }, (_, i) => `isla_${i}`);
const totalPebbles = 200;

function original() {
  const user = { unlockedIslandIds, totalPebbles };
  const unlocked = ISLANDS.filter(i => user.unlockedIslandIds.includes(i.id))
  const nextCandidate = ISLANDS.find(i => !user.unlockedIslandIds.includes(i.id))
  const nextIsland = nextCandidate ? { ...nextCandidate, progress: Math.min(100, Math.floor((user.totalPebbles / Math.max(1, nextCandidate.requiredPebbles)) * 100)) } : null
  return { unlocked, nextIsland };
}

function optimized() {
  const user = { unlockedIslandIds, totalPebbles };
  const unlockedSet = new Set(user.unlockedIslandIds);
  const unlocked = ISLANDS.filter(i => unlockedSet.has(i.id));
  const nextCandidate = ISLANDS.find(i => !unlockedSet.has(i.id));
  const nextIsland = nextCandidate ? { ...nextCandidate, progress: Math.min(100, Math.floor((user.totalPebbles / Math.max(1, nextCandidate.requiredPebbles)) * 100)) } : null;
  return { unlocked, nextIsland };
}

const ITERATIONS = 10000;

const startOriginal = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  original();
}
const endOriginal = performance.now();

const startOptimized = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  optimized();
}
const endOptimized = performance.now();

console.log(`Original: ${(endOriginal - startOriginal).toFixed(2)} ms`);
console.log(`Optimized: ${(endOptimized - startOptimized).toFixed(2)} ms`);
console.log(`Improvement: ${((endOriginal - startOriginal) / (endOptimized - startOptimized)).toFixed(2)}x faster`);
