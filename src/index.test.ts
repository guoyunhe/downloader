import { existsSync, rmSync } from 'fs';
import { join } from 'path';
import { download } from '.';

describe('download()', () => {
  it('download file', async () => {
    const url = 'http://redump.org/datfile/ps2/serial,version,disc';
    const dist = join('tmp', 'download', 'data.zip');
    if (existsSync(dist)) {
      rmSync(dist, { force: true });
    }
    await download(url, dist);
    expect(existsSync(dist)).toBeTruthy();
  });

  it('handle redirect', async () => {
    const url = 'https://source.unsplash.com/random';
    const dist = join('tmp', 'redirect', 'random.jpg');
    if (existsSync(dist)) {
      rmSync(dist, { force: true });
    }
    await download(url, dist);
    expect(existsSync(dist)).toBeTruthy();
  });
});
