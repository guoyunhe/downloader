import { createWriteStream, WriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import http from 'http';
import https from 'https';
import { dirname } from 'path';

export interface DownloadOptions {
  /**
   * Maximum redirect times.
   * @default 5
   */
  maxRedirects?: number;
}

export function download(
  /** File download URL. Must be public and support GET method. */
  url: string,
  /** Output file path or write stream. */
  dist: string | WriteStream,
  /** Extra download options. */
  options: DownloadOptions = {}
) {
  const { maxRedirects = 5 } = options;
  return new Promise<void>((resolve, reject) => {
    const get = url.startsWith('https://') ? https.get : http.get;
    get(url, async (res) => {
      if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
        const fileWriteStream = typeof dist === 'string' ? createWriteStream(dist) : dist;
        if (typeof dist === 'string') {
          await mkdir(dirname(dist), { recursive: true });
        }
        res.pipe(fileWriteStream, { end: false });
        res.on('end', function () {
          fileWriteStream.end();
          resolve();
        });
      } else if (
        res.statusCode &&
        res.statusCode >= 300 &&
        res.statusCode < 400 &&
        res.headers.location
      ) {
        if (maxRedirects > 0) {
          // Follow redirect
          const newUrl = res.headers.location;
          download(newUrl, dist, { ...options, maxRedirects: maxRedirects - 1 })
            .then(resolve)
            .catch(reject);
        } else {
          // Too many redirects
          reject(
            new Error(
              `Too many redirects when downloading ${url}. Use maxRedirects option to increase the limit.`
            )
          );
        }
      } else {
        reject(new Error('Failed to download ' + url));
      }
    });
  });
}
