import type { VideoSuggestion } from '../types';

/** Links to real search pages, without inventing videos, thumbnails or durations. */
export function buildVideoSearches(topic: string): VideoSuggestion[] {
  const query = topic.trim();
  if (!query) return [];
  return [
    { id: 'lesson', label: 'Videoaulas', prefix: 'videoaula' },
    { id: 'review', label: 'Resumos', prefix: 'resumo' },
    { id: 'practice', label: 'Exercícios resolvidos', prefix: 'exercícios resolvidos' },
  ].map(({ id, label, prefix }) => ({
    id,
    title: `${label}: ${query}`,
    thumbnailUrl: '',
    duration: '',
    youtubeUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${prefix} ${query}`)}`,
  }));
}
