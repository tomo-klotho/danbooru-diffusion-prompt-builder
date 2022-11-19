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

<script lang="ts" setup>
import {
    ElButton,
    ElButtonGroup,
    ElScrollbar,
    ElMessageBox,
} from 'element-plus'
import { ref } from 'vue'
import { useCartStore } from '../stores/cart'
import ImportDialog from '../components/ImportDialog.vue'
import ResultDialog from '../components/ResultDialog.vue'
import FeatureSwitches from '../components/FeatureSwitches.vue'
import CartTree from '../components/CartTree.vue'

const cartStore = useCartStore()

const resultVisible = ref(false)
const importVisible = ref(false)

async function clearDialog() {
    try {
        await ElMessageBox.confirm('本当にカートを空にしますか？', 'カートを空にする', {
            confirmButtonText: '決定',
            cancelButtonText: '取消',
            type: 'warning',
        })
        cartStore.clear()
    } catch (e) {
        // ignore
    }
}
</script>

<template>
    <div class="mobile-topbar-el">
        <FeatureSwitches />
    </div>
    <div class="cart-container">
        <h1 class="text-center cart-title">カート</h1>
        <ElScrollbar class="scrollable">
            <div class="subcart-container cart-positive-container">
                <h1>必要</h1>
                <CartTree direction="positive" />
            </div>
            <div class="subcart-container cart-negative-container">
                <h1>不要</h1>
                <CartTree direction="negative" />
            </div>
        </ElScrollbar>
        <div class="btn-block">
            <ElButtonGroup class="btn-group">
                <ElButton
                    type="success"
                    class="btn"
                    @click="importVisible = true">
                    タグのインポート
                </ElButton>
                <ElButton type="danger" class="btn" @click="clearDialog">
                    カートを空にする
                </ElButton>
            </ElButtonGroup>
        </div>
        <div class="btn-block mb-bottom">
            <ElButton
                type="primary"
                class="btn"
                size="large"
                @click="resultVisible = true">
                生成
                </ElButton>
        </div>
        <ImportDialog v-model="importVisible" />
        <ResultDialog v-model="resultVisible" />
    </div>
</template>

<style lang="scss" scoped>
.cart-container {
    padding: 5px 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
    height: calc(100% - 10px);
    min-height: 0;
}

.scrollable {
    overflow: auto;
    flex: 1;
    //margin-bottom: 1.5rem;
}

.text-center {
    text-align: center;
}

.btn-block {
    display: block;
    width: 100%;
    margin-bottom: 1rem;
    .btn-group {
        width: 100%;
        display: flex;
        > .btn {
            width: 100%;
        }
    }
    > .btn {
        width: 100%;
    }
}

.subcart-container {
    margin-bottom: 1.5rem;
}

.el-tree {
    :deep(.el-tree-node__label) {
        margin-right: 1rem;
    }
    :deep(.el-tree-node__content) {
        height: auto;
        padding-top: 0.25rem;
        padding-bottom: 0.25rem;
    }
}

.mb-bottom {
    margin-bottom: 1rem;
}

.cart-title {
    margin: 0.75rem 0;
}
</style>
