'use server';

import type { ComicStrip } from '../types/comic-strip';

export async function generateCsv(
  items: ComicStrip[],
  baseUrl: string
): Promise<string> {
  const headers = [
    'uid',
    'title',
    'published year from',
    'published month from',
    'published day from',
    'published year to',
    'published month to',
    'published day to',
    'number of pages',
    'year from',
    'year to',
    'details url',
  ];

  const rows = items.map((item: ComicStrip) => {
    return [
      `"${item.uid}"`,
      `"${item.title?.replaceAll('"', '""')}"`,
      item.publishedYearFrom ?? '...',
      item.publishedMonthFrom ?? '...',
      item.publishedDayFrom ?? '...',
      item.publishedYearTo ?? '...',
      item.publishedMonthTo ?? '...',
      item.publishedDayTo ?? '...',
      item.numberOfPages ?? '...',
      item.yearFrom ?? '...',
      item.yearTo ?? '...',
      `${baseUrl}/?details=${item.uid}`,
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  return csvContent;
}
