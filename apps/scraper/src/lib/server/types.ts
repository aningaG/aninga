import type { Manga } from '@prisma/client';
import type { CheerioAPI, Element } from 'cheerio';

export type WhatStart = 'listManga' | 'listChapters' | 'updateManga' | 'updateChapters';

export interface StartI {
  interval: number;
  what: WhatStart;
  current?: number;
}

export interface ListI {
  interval: number;
}

export interface UpdateChapterI {
  pageUrl: string;
  pages: number;
  chapId: string;
}

export interface UpdateChaptersI extends ListI {
  chapter?: number;
}

export interface ListChapterI {
  mangaId: string;
  link: string;
  name: string;
  vName?: string;
  vImage?: string;
}

export interface ListAllMangaI extends ListI {
  page?: number;
}

export interface UpdateMangaI {
  $: CheerioAPI;
  id: string;
}

export interface UpdateAllMangaI extends ListI {
  manga?: number;
}

export interface PagesInfo {
  pages: number;
  url: string;
}

export interface LinksTextI {
  $: CheerioAPI;
  el: Element;
}

export interface MangaPageI {
  updates: Omit<Manga, 'id'>[];
  inserts: Omit<Manga, 'id'>[];
}
