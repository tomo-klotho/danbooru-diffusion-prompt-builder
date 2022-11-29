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

import yaml from 'js-yaml'
import fs from 'fs'
import glob from 'glob'
import path from 'path'
import { fileURLToPath } from 'url'
import type { TagFile } from '../types/file'
import type { PresetFile } from '../types/file'
import { isNull } from 'lodash'
import type { Presets, Preset, PresetCategoryInfo, CategoryHierarchy } from '../types/data'
import Decimal from 'decimal.js-light'

const resolution = new Set()
const dirname = path.dirname(fileURLToPath(import.meta.url))

// タグのチェック
const tagFiles = glob.sync('**/*.yaml', {
    cwd: path.resolve(dirname, '../../data/tags'),
})
let hasError = false
for (const file of tagFiles) {
    const tagData: TagFile = yaml.load(
        fs.readFileSync(path.resolve(dirname, '../../data/tags', file), 'utf-8')
    ) as TagFile
    for (const [rawTag, meta] of Object.entries(tagData.content)) {
        const tag = rawTag.toLowerCase().replaceAll('_', ' ')
        if(meta.name == undefined){
            console.error(`NotName tag ${tag} from ${file}`)
            hasError = true
        }
    }
}

// プリセットのチェック
const presetsFiles = glob.sync('**/*.yaml', {
    cwd: path.resolve(dirname, '../../data/presets'),
})
for (const file of presetsFiles) {
    const presetData: PresetFile = yaml.load(
        fs.readFileSync(path.resolve(dirname, '../../data/presets', file), 'utf-8')
    ) as PresetFile
    for (const [k, vs] of Object.entries(presetData.content)) {
        console.log(k)
        for (const [l, vt] of Object.entries(vs.content)) {
            const [tag, weight] = vt.split(':')
            if(weight != undefined){
                const d = new Decimal(weight)
                console.log(tag,d)
            }
            
        }

        
    }
}


if (hasError) {
    process.exit(1)
} else {
    console.log('No error tag found')
}
