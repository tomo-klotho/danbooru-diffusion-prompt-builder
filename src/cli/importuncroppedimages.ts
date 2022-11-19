/*******************************************************************************
 * Danbooru Diffusion Prompt Builder
 * Copyright (C) 2022  Jabasukuriputo Wang
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 ******************************************************************************/

import path from 'path'
import sharp from 'sharp'
import fs from 'fs'
import { createHash } from 'crypto'
import { fileURLToPath } from 'url'
import {readdirSync} from 'fs'

const importImageDir = process.argv[2]

if (!importImageDir) {
    console.error('No input model path provided')
    process.exit(1)
}

console.log('Images import start')
const imageDir= path.resolve(process.cwd(), importImageDir)
const images = getFileList(imageDir)
images.forEach(async (value, index, arr) => {
    console.log(`${index + 1}:${value}`)

    const dirname = path.dirname(fileURLToPath(import.meta.url))
    const imagePath = path.resolve(importImageDir, value)
    const saveImagePath = path.resolve(dirname, '../../public/images')

    const image = await sharp(imagePath).webp({ quality: 80, effort: 6 }).toBuffer()

    const hash = createHash('sha256').update(image).digest('hex')

    fs.mkdirSync(path.resolve(saveImagePath, hash.slice(0, 2)), { recursive: true })
    fs.writeFileSync(
        path.resolve(saveImagePath, `${hash.slice(0, 2)}/${hash}.webp`),
        image
    )

    
    console.log('-', hash)
});

console.log('Images imported end')

export function getFileList(dirPath:string):string[] {

    let dirList: string[] = []

    dirList = readdirSync(dirPath, {
        withFileTypes: true, 
    }).filter(dirent => dirent.isFile())
    .map(dirent => dirent.name)

    return dirList;

}