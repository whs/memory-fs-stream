const File = require('vinyl');
const {Readable} = require('readable-stream');

const noop = function(){};

class MemoryFsStream extends Readable {
	constructor(fs, opts={}){
		super({objectMode: true});
		this.fs = fs;
		this.opts = opts;

		if(this.opts.root){
			// remove starting and trailing slash
			// and replace \ by / for windows
			this.opts.root = this.opts.root.replace(/^\//, '')
				.replace(/\/$/, '')
				.replace(/\\/g, '/');
		}
	}

	_read(){
		// traverse to root first
		let cwd = this.fs.data;

		if(this.opts.root){
			let rootSegments = this.opts.root.split('/');
			for(let segment of rootSegments){
				if(segment === ''){
					continue;
				}
				cwd = cwd[segment];
			}
		}

		this._pumpDir(cwd, '');

		if(this.opts.close !== false){
			this.push(null);
		}else{
			this._read = noop;
		}
	}

	_pumpDir(dir, path){
		for(let basename in dir){
			if(!Object.prototype.hasOwnProperty.call(dir, basename)){
				continue;
			}

			let contents = dir[basename];
			if(contents instanceof Buffer){
				let fullPath = path + basename;

				if(!this.isFiltered(fullPath)){
					continue;
				}

				let vinyl = new File({
					path: fullPath,
					contents,
				});
				this.push(vinyl);
			}else{
				this._pumpDir(contents, `${path}${basename}/`);
			}
		}
	}

	isFiltered(path){
		if(this.opts.filter === undefined){
			return true;
		}else if(typeof this.opts.filter === 'function'){
			return this.opts.filter(path);
		}else if(Array.isArray(this.opts.filter)){
			return this.opts.filter.indexOf(path) !== -1;
		}

		throw new Error('filter option is of unsupported type');
	}
}

module.exports = MemoryFsStream;
