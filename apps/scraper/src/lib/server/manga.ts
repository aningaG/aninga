import type { Manga } from '@prisma/client';
import { load } from 'cheerio';
import type { ListAllMangaI, MangaPageI, PagesInfo } from './types';
import { db, getLinksText, getStatus, proxyRequest } from './utils';

const createMany = inserts => {
  db.manga.createMany({ data: inserts });
};

const updateMany = updates => {
  updates.forEach(({ link, ...manga }) => db.manga.update({ where: { link }, data: { ...manga, link } }));
};

const getPagesInfo = async (): Promise<PagesInfo> => {
  const url = 'https://www.mangaworld.in/archive?type=manga&status=ongoing&status=completed&status=paused&sort=a-z';
  const $ = load(await proxyRequest(url));
  const pages = Math.ceil(+$('.search-quantity').text().split(' ')[0] / 16);
  return { pages, url };
};

const getPageManga = async (url: string): Promise<MangaPageI> => {
  const $ = load(await proxyRequest(url));

  const updates = [];
  const inserts = [];

  $('.entry').each((_, el) => {
    const manga: Omit<Manga, 'id'> = {
      name: $(el).find('.name a').text(),
      link: $(el).find('.name a').attr('href') as string,
      authors: getLinksText({ $, el: $(el).find('.author')[0] }),
      artists: getLinksText({ $, el: $(el).find('.artist')[0] }),
      status: getStatus($(el).find('.status a').text().trim()),
      genres: getLinksText({ $, el: $(el).find('.genres')[0] }),
      year: 0,
      trama: null,
      titles: null,
    };

    db.manga.findUnique({ where: { link: manga.link } }) ? updates.push(manga) : inserts.push(manga);
  });

  return { updates, inserts };
};

export async function listAllManga({ interval, page }: ListAllMangaI) {
  let current = page || 1;
  const { pages, url } = await getPagesInfo();

  console.log('Listing manga start...');

  const timer = setInterval(async () => {
    if (current > pages) {
      clearInterval(timer);
      console.log('Listing manga done.');
      return;
    }

    const { updates, inserts } = await getPageManga(`${url}&page=${current}`);

    inserts.length && createMany(inserts);
    updates.length && updateMany(updates);
    console.log('Pagina:', current);
    current++;
  }, interval);
}
