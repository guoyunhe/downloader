import { download } from '.';

describe('download()', () => {
  it('download file', async () => {
    await download('http://redump.org/datfile/ps2/serial,version,disc', 'tmp/ps2.zip');
  });
});
