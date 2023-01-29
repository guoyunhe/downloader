import { rm, stat } from 'fs/promises';
import { join } from 'path';
import { download } from '.';

describe('download()', () => {
  it('download file', async () => {
    const url = 'https://github.com/PCSX2/pcsx2/raw/master/README.md';
    const dist = join('tmp', 'README.md');
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
