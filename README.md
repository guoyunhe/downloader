# @guoyunhe/download

Download large files with minimum RAM usage.

## Install

```bash
npm i @guoyunhe/download
```

## Usage

Simply download a file:

```ts
import { download } from '@guoyunhe/download';
import { createWriteStream } from 'fs';

// Specify download file path
await download('https://example.com/data.zip', 'dist/path/to/data.zip');

// Or pass a WriteStream
const dist = createWriteStream('dist/path/to/data.zip');
await download('https://example.com/data.zip', dist);
```

Download and extract zip archives with [node-stream-zip](https://www.npmjs.com/package/node-stream-zip):

```ts
import { download } from '@guoyunhe/download';
import StreamZip from 'node-stream-zip';

await download('https://example.com/data.zip', 'data.zip');

const zip = new StreamZip.async({ file: 'data.zip' });
await zip.extract(null, 'extracted-data');
```
