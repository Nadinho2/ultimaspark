/** Stable key for pre-recorded library (one embed per topic). */
export function topicNoteKey(topicId: string): string {
  return topicId;
}

/** Key for cohort: multiple videos per topic — include YouTube id. */
export function topicVideoNoteKey(topicId: string, videoId: string): string {
  return `${topicId}::${videoId}`;
}
