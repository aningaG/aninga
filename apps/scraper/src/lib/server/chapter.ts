import type { Chapter } from '@prisma/client';
import type { Cheerio, Element } from 'cheerio';
import type { UpdateMangaI } from './types';
import { db } from './utils';

const createMany = (inserts: Omit<Chapter, 'id'>[]) => {
  db.chapter.createMany({ data: inserts });
};

const updateMany = (updates: Omit<Chapter, 'id'>[]) => {
  updates.forEach(({ link, ...chap }) => {
    db.chapter.update({ where: { link }, data: { ...chap, link } });
  });
};

const getChapterInfo = (el: Cheerio<Element>) => {
  let volumeUrlId = null;

  const pEl = el.parent().parent();
  const vName = pEl.find('.volume-name').text().trim();
  const vImage = pEl.find('i.fa-file-image').attr('data-volume-image');

  if (vImage) {
    const urlMatch = (vImage.match(/\bhttps?:\/\/\S+/gi) || [])[0];
    const volumeId = urlMatch.split('/')[4].split('.')[0];
    volumeUrlId = `${vName?.toLowerCase().replace(' ', '-')}-${volumeId}`;
  }

  const name = el.find('a.chap').find('span').text().trim();
  const link = el.find('a.chap').attr('href');
  const urlId = `${name.toLowerCase().replace(' ', '-')}-${link.split('/')[7]}`;

  return { name, link, urlId, volumeUrlId };
};

export function listChapters({ $, id }: UpdateMangaI) {
  const inserts = [];
  const updates = [];

  $('.chapter').each((_, el) => {
    const chapter: Omit<Chapter, 'id'> = {
      ...getChapterInfo($(el)),
      mangaId: id,
      pages: 0,
      mangaUrlId: null,
      baseUrl: null,
    };

    db.chapter.findUnique({ where: { link: chapter.link } }) ? updates.push(chapter) : inserts.push(chapter);
  });

  inserts.length && createMany(inserts);
  updates.length && updateMany(updates);
}
