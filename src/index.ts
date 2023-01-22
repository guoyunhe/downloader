import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import http from 'http';
import https from 'https';
import { dirname } from 'path';

export async function download(url: string, dist: string) {
  const file = createWriteStream(dist);
  await mkdir(dirname(dist), { recursive: true });
  const get = url.startsWith('https://') ? https.get : http.get;
  get(url, (res) => {
    res.pipe(file, { end: false });
    res.on('end', function () {
      file.end();
    });
  });
}
