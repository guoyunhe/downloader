import { createWriteStream } from 'fs';
import { mkdir, mkdtemp } from 'fs/promises';
import http from 'http';
import https from 'https';
import StreamZip from 'node-stream-zip';
import { tmpdir } from 'os';
import { dirname, join } from 'path';
import { Writable } from 'stream';
import tar from 'tar';
import { stripDirectory } from './stripDirectory';

export interface DownloadOptions {
  /**
   * Maximum redirect times.
   *
   * @default 5
   */
  maxRedirects?: number;
  /**
   * Extract *.tar.gz archives
   *
   * @default false
   */
  extract?: boolean;
  /**
   * Strip given number of leading components from file names before extraction.
   *
   * For example, if archive `archive.tar' contained `some/file/name', then `strip: 2` would extract
   * this file to file `name`.
   *
   * @default 0
   */
  strip?: number;
}

export function download(
  /** File download URL. Must be public and support GET method. */
  url: string,
  /** Output file (not extract) or folder (extract) path. */
  dist: string,
  /** Extra download options. */
  options: DownloadOptions = {}
) {
  const { maxRedirects = 5, extract = false, strip = 0 } = options;
  return new Promise<void>((resolve, reject) => {
    const get = url.startsWith('https://') ? https.get : http.get;
    get(url, async (res) => {
      if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
        let output: Writable;
        let zipFile: string;
        if (
          extract &&
          [
            'application/tar',
            'application/tar+gzip',
            'application/x-tar',
            'application/x-gzip',
          ].includes(res.headers['content-type'] || '')
        ) {
          await mkdir(dist, { recursive: true });
          output = tar.x({
            strip,
            cwd: dist,
          });
        } else if (extract && res.headers['content-type'] === 'application/zip') {
          const tmpPrefix = join(tmpdir(), 'guoyunhe-downloader');
          const temp = await mkdtemp(tmpPrefix);
          zipFile = join(temp, 'archive.zip');
          output = createWriteStream(zipFile);
        } else {
          await mkdir(dirname(dist), { recursive: true });
          output = createWriteStream(dist);
        }

        res.pipe(output, { end: false });
        res.on('end', async function () {
          output.end();
          if (zipFile) {
            const zip = new StreamZip.async({ file: zipFile });
            await zip.extract(null, dist);
            await stripDirectory(dist, strip);
          }
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
