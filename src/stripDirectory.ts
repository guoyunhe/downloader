import { mkdir, readdir, rename, rm } from 'fs/promises';
import { join } from 'path';

export async function stripDirectory(dir: string, strip = 1) {
  if (strip < 1) return;

  const items = await scanDirectory(dir, strip + 1);
  const tmpDir = dir + '__old__';
  await rename(dir, tmpDir);
  await mkdir(dir);
  await Promise.all(
    Object.entries(items).map(async ([from, to]) => {
      rename(join(tmpDir, from), join(dir, to));
    })
  );
  await rm(tmpDir, { recursive: true });
}

async function scanDirectory(dir: string, depth = 1, prefix = ''): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  if (depth < 1) return result;

  const items = await readdir(dir, { withFileTypes: true });
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.isDirectory() && depth > 1) {
      Object.assign(
        result,
        await scanDirectory(join(dir, item.name), depth - 1, join(prefix, item.name))
      );
    } else {
      result[join(prefix, item.name)] = item.name;
    }
  }

  return result;
}
