# @guoyunhe/downloader

Download large files with minimum RAM usage. Support tar.gz and zip extraction.

## Install

```bash
npm i @guoyunhe/downloader
```

## Usage

Download a simple file

```ts
import { download } from '@guoyunhe/downloader';

await download('https://example.com/logo.png', 'dist/path/logo.png');
```

Download and extract tar.gz or zip archive

```ts
import { download } from '@guoyunhe/downloader';

await download('https://example.com/data.tar.gz', 'dist/path/', { extract: true });
// Output:
// └── export-2023-01-01
//     └── data
//         ├── spec.xml
//         ├── report.pdf
//         └── raw.dat
```

Reduce extraction file path by two folder

```ts
import { download } from '@guoyunhe/downloader';

await download('https://example.com/data.tar.gz', 'dist/path/', { extract: true, strip: 2 });
// Output:
// ├── spec.xml
// ├── report.pdf
// └── raw.dat
```
