import type { Manga } from '@prisma/client';
import { load } from 'cheerio';
import { listChapters } from './chapter';
import type { ListAllMangaI, MangaPageI, PagesInfo, UpdateAllMangaI, UpdateMangaI } from './types';
import { db, getLinksText, getStatus, proxyRequest } from './utils';

const createMany = (inserts: Omit<Manga, 'id'>[]) => {
  db.manga.createMany({ data: inserts });
};

const updateMany = (updates: Omit<Manga, 'id'>[]) => {
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

const updateManga = ({ $, id }: UpdateMangaI) => {
  const manga: Partial<Omit<Manga, 'id'>> = {
    trama: $('#noidungm').text().trim(),
  };

  $('.info')
    .eq(0)
    .find('.meta-data .col-12')
    .each((_, el) => {
      const text = $(el).find('span').text().trim();

      switch (text) {
        case 'Titoli Alternativi:':
          manga.titles = getLinksText({ $, el });
          break;

        case 'Generi:':
          manga.genres = getLinksText({ $, el });
          break;

        case 'Autore:':
          manga.authors = getLinksText({ $, el });
          break;

        case 'Artista:':
          manga.artists = getLinksText({ $, el });
          break;

        case 'Autori:':
          manga.authors = getLinksText({ $, el });
          break;

        case 'Artisti:':
          manga.artists = getLinksText({ $, el });
          break;

        case 'Anno di uscita:': {
          const num = Number($(el).find('a').eq(0).text().trim());
          manga.year = !isNaN(num) ? num : 0;
          break;
        }

        default:
          break;
      }
    });

  db.manga.update({ where: { id }, data: manga });
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

export async function updateAllManga({ interval, manga }: UpdateAllMangaI) {
  const list = await db.manga.findMany();
  let current = manga || list.length - 1;

  const timer = setInterval(async () => {
    if (current < 0) {
      clearInterval(timer);
      console.log('Listing chapters done.');
      return;
    }
    const { id, link } = list[current];
    const $ = load(await proxyRequest(link));

    updateManga({ $, id });
    listChapters({ $, id });
    current--;
  }, interval);
}
