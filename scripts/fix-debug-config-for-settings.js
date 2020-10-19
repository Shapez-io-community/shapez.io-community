const fs = require('fs')
const path = require('path')


let loc = '../src/js/core/config.local.js'

let f = fs.readFileSync(loc) + ''

f = f.replace(/(.*?-{10,}\r?\n)(.*?)\/\/ (.*)(\r?\n.*?)\/\/ (.*?): true,/g, '$1$2_$5: "$3",$4$5: false,')

f = f.replace(/.*\/\* dev:.*\r?\n/g, '')

f = f.replace(/disableSlowAsserts/, 'enableSlowAsserts')
f = f.replace(/Disables slow asserts/, 'Enables slow asserts')

console.log(f)

fs.writeFileSync(loc, f)





let jsloc = '../src/js/'

for (let {path} of klawSync(jsloc)) {
	if (!path.endsWith('.js')) continue
	console.log(path)
	let f = fs.readFileSync(path) + ''
	if (f.includes('IS_DEV')) {
		f = f.replace(/G_IS_DEV && (?=.*globalConfig.debug)/g, '')
		f = f.replace(/!globalConfig.debug.disableSlowAsserts/g, 'globalConfig.debug.enableSlowAsserts')
		fs.writeFileSync(path, f)
	}
}


function klawSync (dir, opts, ls) {
  if (!ls) {
    ls = []
    dir = path.resolve(dir)
    opts = opts || {}
    opts.fs = opts.fs || fs
    if (opts.depthLimit > -1) opts.rootDepth = dir.split(path.sep).length + 1
  }
  const paths = opts.fs.readdirSync(dir).map(p => dir + path.sep + p)
  for (var i = 0; i < paths.length; i += 1) {
    const pi = paths[i]
    const st = opts.fs.statSync(pi)
    const item = {path: pi, stats: st}
    const isUnderDepthLimit = (!opts.rootDepth || pi.split(path.sep).length - opts.rootDepth < opts.depthLimit)
    const filterResult = opts.filter ? opts.filter(item) : true
    const isDir = st.isDirectory()
    const shouldAdd = filterResult && (isDir ? !opts.nodir : !opts.nofile)
    const shouldTraverse = isDir && isUnderDepthLimit && (opts.traverseAll || filterResult)
    if (shouldAdd) ls.push(item)
    if (shouldTraverse) ls = klawSync(pi, opts, ls)
  }
  return ls
}