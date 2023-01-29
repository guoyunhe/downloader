# @guoyunhe/downloader

Download large files with minimum RAM usage. Support tar.gz extraction.

## Install

```bash
npm i @guoyunhe/downloader
```

## Usage

```ts
import { download } from '@guoyunhe/downloader';
import { createWriteStream } from 'fs';

// Download a simple file
await download('https://example.com/logo.png', 'dist/path/logo.png');

// Download and extract tar.gz archive
await download('https://example.com/data.tar.gz', 'dist/path/', { extract: true });
// Output:
// └── export-2023-01-01
//     └── data
//         ├── spec.xml
//         ├── report.pdf
//         └── raw.dat

// Reduce extraction file path by two folder
await download('https://example.com/data.tar.gz', 'dist/path/', { extract: true, strip: 2 });
// Output:
// ├── spec.xml
// ├── report.pdf
// └── raw.dat
```

Download and extract zip archives:

```ts
import { download } from '@guoyunhe/downloader';
import StreamZip from 'node-stream-zip';

await download('https://example.com/data.zip', 'data.zip');

const zip = new StreamZip.async({ file: 'data.zip' });
await zip.extract(null, 'extracted-data');
```
