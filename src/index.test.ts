import { rm, stat } from 'fs/promises';
import { join } from 'path';
import { download } from '.';

describe('download()', () => {
  it('download file', async () => {
    const url = 'http://redump.org/datfile/ps2/serial,version';
    const dist = join('tmp', 'download', 'data.zip');
    await rm(dist, { force: true });
    await download(url, dist);
    const { size } = await stat(dist);
    expect(size).toBeGreaterThan(0);
  });

  it('handle redirect', async () => {
    const url = 'https://source.unsplash.com/random';
    const dist = join('tmp', 'redirect', 'random.jpg');
    await rm(dist, { force: true });
    await download(url, dist);
    const { size } = await stat(dist);
    expect(size).toBeGreaterThan(0);
  });

  it('extract tar.gz', async () => {
    const url = 'https://github.com/PCSX2/pcsx2/archive/refs/tags/v1.7.3977.tar.gz';
    const dist = join('tmp', 'extract-tgz');
    await rm(dist, { force: true, recursive: true });
    await download(url, dist, { extract: true, strip: 1 });
    const { size } = await stat(join(dist, 'README.md'));
    expect(size).toBeGreaterThan(0);
  });
});
