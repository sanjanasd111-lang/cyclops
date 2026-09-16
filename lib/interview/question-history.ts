import crypto from 'crypto';

export interface QuestionHistoryRecord {
  id: string;
  user_id: string;
  question_hash: string;
  question_text: string;
  session_id: string;
  created_at: string;
}

// Memory store fallback
const userQuestionHashesMap = new Map<string, Set<string>>();

export function computeQuestionHash(questionText: string): string {
  const normalized = questionText
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  return crypto.createHash('md5').update(normalized).digest('hex');
}

export function isQuestionDuplicate(userId: string, questionText: string, existingHashes?: Set<string>): boolean {
  const hash = computeQuestionHash(questionText);
  const userHashes = existingHashes || userQuestionHashesMap.get(userId) || new Set<string>();
  return userHashes.has(hash);
}

export function recordUserQuestionHash(userId: string, questionText: string): string {
  const hash = computeQuestionHash(questionText);
  let userHashes = userQuestionHashesMap.get(userId);
  if (!userHashes) {
    userHashes = new Set<string>();
    userQuestionHashesMap.set(userId, userHashes);
  }
  userHashes.add(hash);
  return hash;
}

export function getUserQuestionHashes(userId: string): Set<string> {
  return userQuestionHashesMap.get(userId) || new Set<string>();
}
