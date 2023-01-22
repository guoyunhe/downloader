import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import http from 'http';
import https from 'https';
import { dirname } from 'path';

export interface DownloadOptions {
  /**
   * Extract zip files
   */
  unzip?: boolean;
}

export function download(url: string, dist: string, options?: DownloadOptions) {
  return new Promise<null>((resolve, reject) => {
    const get = url.startsWith('https://') ? https.get : http.get;
    get(url, async (res) => {
      if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
        const file = createWriteStream(dist);
        await mkdir(dirname(dist), { recursive: true });
        res.pipe(file, { end: false });
        res.on('end', function () {
          file.end();
          resolve(null);
        });
      } else if (
        res.statusCode &&
        res.statusCode >= 300 &&
        res.statusCode < 400 &&
        res.headers.location
      ) {
        const newUrl = res.headers.location;
        download(newUrl, dist, options).then(resolve).catch(reject);
      } else {
        reject(new Error('Failed to download ' + url));
      }
    });
  });
}
