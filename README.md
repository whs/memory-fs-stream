# memory-fs-stream

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Travis Status](https://travis-ci.org/whs/memory-fs-stream.svg)](https://travis-ci.org/whs/memory-fs-stream)
[![npm](https://img.shields.io/npm/v/memory-fs-stream.svg)](https://www.npmjs.com/package/memory-fs-stream)

Convert [memory-fs](https://github.com/webpack/memory-fs) to [Vinyl](https://github.com/gulpjs/vinyl) stream. Extracted from [piped-webpack](https://github.com/whs/piped-webpack)

## API

```js
const MemoryFileSystem = require('memory-fs');
const MemoryFSStream = require('memory-fs-stream');

let fs = new MemoryFileSystem();

fs.writeFileSync("/a/test/dir/file.txt", "Hello World");

let stream = new MemoryFSStream(fs);
// now stream will be vinyl stream of files in fs
```

## Options

MemoryFSStream accept a second argument, an option object. Available options are:

- root: Use file only from this subfolder. Default to use all files
- close: Set to false to keep the stream open even after all files have been outputted. Useful when combined with modules that let you swap stream like [duplexify](https://github.com/mafintosh/duplexify)

## License
memory-fs-stream is licensed under the [MIT License](LICENSE)
