export const HEART_WORDS = [
  "the", "a", "I", "to", "is",
  "you", "are", "of", "was", "said",
  "they", "have", "my", "do", "what",
  "there", "were", "one", "by", "from",
] as const;

export type HeartWord = (typeof HEART_WORDS)[number];

export const HEART_WORD_COUNT = HEART_WORDS.length;
