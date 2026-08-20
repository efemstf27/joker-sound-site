const fs = require('fs')
const path = require('path')

const src = process.argv[2] || path.resolve(__dirname, '..', '..', 'bass video')
const dest = process.argv[3] || path.resolve(__dirname, '..', 'public', 'frames')

async function ensureDir(dir){
  await fs.promises.mkdir(dir, { recursive: true })
}

async function copy(){
  try{
    const files = await fs.promises.readdir(src)
    const jpgs = files.filter(f=>/\.jpe?g$/i.test(f)).sort()
    if(jpgs.length===0) return console.log('No jpgs found in', src)
    await ensureDir(dest)
    for(const f of jpgs){
      const s = path.join(src,f)
      const d = path.join(dest,f)
      await fs.promises.copyFile(s,d)
      console.log('copied', f)
    }
    console.log('Done copying', jpgs.length, 'files to', dest)
  }catch(err){
    console.error(err)
  }
}

copy()
