import { PrismaClient, Status } from '@prisma/client';
import axios from 'axios';
import UserAgent from 'user-agents';
import type { LinksTextI } from './types';

export const getLinksText = ({ $, el }: LinksTextI): string | null => {
  if (el) {
    const texts: string[] = [];

    $(el)
      .find('a')
      .each((_, a) => {
        texts.push($(a).text());
      });

    return texts.length > 1 ? texts.join(',') : texts[0];
  }

  return null;
};

export const getStatus = (text: string): Status => {
  const status = new Map<string, Status>([
    ['In corso', Status.ONGOING],
    ['Finito', Status.FINISHED],
    ['In pausa', Status.PAUSED],
  ]);

  return status.get(text) || Status.UNKNOWN;
};

export async function proxyRequest(url: string) {
  const proxies = ['usproxy', 'ukproxy', 'frproxy', 'webproxy'];
  const pxName = proxies[Math.floor(Math.random() * proxies.length)];

  const form = new FormData();
  form.append('u', url);
  form.append('webproxylocation', 'random');

  return await axios
    .post(`https://${pxName}.vpnbook.com/includes/process.php?action=update`, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'User-Agent': new UserAgent().toString(),
      },
    })
    .then(res => res.data);
}

export const db = new PrismaClient();
