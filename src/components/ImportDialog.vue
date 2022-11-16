<!------------------------------------------------------------------------------
  - Danbooru Diffusion Prompt Builder
  - Copyright (C) 2022  Jabasukuriputo Wang
  -
  - This program is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as published by
  - the Free Software Foundation, either version 3 of the License, or
  - (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program.  If not, see <https://www.gnu.org/licenses/>.
  -
  ----------------------------------------------------------------------------->

<script setup lang="ts">
import { ElButton, ElDialog, ElInput, ElAlert } from 'element-plus'
import { useCartStore } from '../stores/cart'
import { computed, ref } from 'vue'
import { isDark } from '../composables/dark'
import { parse } from '../prompt/parser'
import { checkBoundaryParen, checkParen } from '../prompt/checkParen'

const cartStore = useCartStore()
const props = defineProps<{
    modelValue: boolean
}>()

const positiveTags = ref('')
const negativeTags = ref('')

const positiveError = ref('')
const negativeError = ref('')

const emit = defineEmits(['update:modelValue'])
const mv = computed({
    get: () => props.modelValue,
    set: (v) => emit('update:modelValue', v),
})

function cancel() {
    positiveTags.value = ''
    negativeTags.value = ''
    mv.value = false
}

async function save(newEmphasis: boolean) {
    const positiveTagsValue = positiveTags.value.replaceAll(/\r\n|\r|\n/g, ' ').trim()
    const negativeTagsValue = negativeTags.value.replaceAll(/\r\n|\r|\n/g, ' ').trim()
    try {
        await Promise.all([
            (async () => {
                try {
                    const checkParenResult = checkParen(positiveTagsValue)
                    if (checkParenResult !== null) {
                        throw new Error(`ブラケットの不一致：段落内 ${checkParenResult.i} 登場人物，期待すること "${checkParenResult.expected}"，しかし、実際の出会いは "${checkParenResult.char}"。`)
                    }
                    const checkBoundaryParenResult = checkBoundaryParen(positiveTagsValue)
                    if (checkBoundaryParenResult !== null) {
                        throw new Error(`括弧が想定外の位置にある：段落内 ${checkBoundaryParenResult.i} 登場人物，カンマに合わせたカッコを期待する，実際の出会い "${checkBoundaryParenResult.char}"。`)
                    }
                    parse(positiveTags.value, newEmphasis)
                } catch (e: any) {
                    positiveError.value = e.message
                    throw e
                }
            })(),
            (async () => {
                try {
                    const checkParenResult = checkParen(negativeTagsValue)
                    if (checkParenResult !== null) {
                        throw new Error(`ブラケットの不一致：段落内 ${checkParenResult.i} 登場人物，期待すること "${checkParenResult.expected}"，しかし、実際の出会いは "${checkParenResult.char}"。`)
                    }
                    const checkBoundaryParenResult = checkBoundaryParen(negativeTagsValue)
                    if (checkBoundaryParenResult !== null) {
                        throw new Error(`括弧が想定外の位置にある：段落内 ${checkBoundaryParenResult.i} 登場人物，カンマに合わせたカッコを期待する，実際の出会い "${checkBoundaryParenResult.char}"。`)
                    }
                    parse(negativeTags.value, newEmphasis)
                } catch (e: any) {
                    negativeError.value = e.message
                    throw e
                }
            })(),
        ])
    } catch (e) {
        return
    }

    cartStore.import('positive', positiveTagsValue, newEmphasis)
    cartStore.import('negative', negativeTagsValue, newEmphasis)
    mv.value = false
}

function saveOld() {
    const positiveTagsValue = positiveTags.value.replaceAll(/\r\n|\r|\n/g, ' ').trim()
    const negativeTagsValue = negativeTags.value.replaceAll(/\r\n|\r|\n/g, ' ').trim()
    cartStore.importClassic('positive', positiveTagsValue)
    cartStore.importClassic('negative', negativeTagsValue)
    mv.value = false
}
</script>

<template>
    <ElDialog v-model="mv" title="导入标签" width="50%">
        <p>
            注：タグのフォーマットは非常に多様であるため、インポートが完全に成功することを保証するものではありません。
            インポートを成功させるために、タグがカンマで区切られていること、ブラケットが両方向に完全に閉じられていることを確認してください。
        </p>
        <div class="tag-positive">
            <div class="title">ポジティブラベル</div>
            <ElInput
                v-model="positiveTags"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 8 }"
                class="tag-pre"
                placeholder="Prompt" />
            <ElAlert
                v-show="positiveError !== ''"
                :title="positiveError"
                type="error"
                class="parse-error"
                :effect="isDark ? 'dark' : 'light'"
                show-icon
                @close="positiveError = ''" />
        </div>
        <div class="tag-negative">
            <div class="title">リバースラベル</div>
            <ElInput
                v-model="negativeTags"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 8 }"
                class="tag-pre"
                placeholder="Negative prompt" />
            <ElAlert
                v-show="negativeError !== ''"
                :title="negativeError"
                type="error"
                class="parse-error"
                :effect="isDark ? 'dark' : 'light'"
                show-icon
                @close="negativeError = ''" />
        </div>
        <template #footer>
            <span class="dialog-footer">
                <ElButton @click="cancel()">取消</ElButton>
                <ElButton type="info" @click="saveOld()">朴素解析器</ElButton>
                <ElButton type="primary" @click="save(false)">NAI構文のパース</ElButton>
                <ElButton type="primary" @click="save(true)">WebUIの文法を解析する</ElButton>
            </span>
        </template>
    </ElDialog>
</template>

<style scoped lang="scss">
// .tag-positive,
// .tag-negative {
//     margin-bottom: 1.5rem;
// }

.title {
    font-size: 14pt;
    margin-bottom: 1rem;
}

.tag-pre {
    // resize: vertical;
    width: 100%;
    font-family: Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    margin-bottom: 1.5rem;
}

.parse-error {
    margin-bottom: 1rem;
    :deep(.el-alert__title) {
        white-space: pre-wrap;
        font-family: Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    }
}
</style>
