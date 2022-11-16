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
  import {ElButton, ElSwitch, ElScrollbar} from 'element-plus'
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
  import {faEye, faEyeSlash, faClipboard, faThumbsDown, faThumbsUp, faLightbulb, faSlash} from '@fortawesome/free-solid-svg-icons'
  import {faCircleMinus, faCirclePlus, faTrash, faThumbsDown as faThumbsDownRegular, faThumbsUp as faThumbsUpRegular, faBlender as faBlenderRegular} from '@fortawesome/free-solid-svg-icons'
  import {useSettingsStore} from '../stores/settings'
  import {useTagStore} from '../stores/tags'
  import {usePresetStore} from '../stores/presets'
  import {useEmbeddingStore} from '../stores/embeddings'
  import {useHypernetworkStore} from '../stores/hypernetworks'
  import {h} from 'vue'
  import { isDark } from '../composables/dark'
  import dayjs from 'dayjs'
  
  defineProps<{
      category: undefined
  }>()
  
  const settingsStore = useSettingsStore()
  const tagStore = useTagStore()
  const presetStore = usePresetStore()
  const embeddingStore = useEmbeddingStore()
  const hypernetworkStore = useHypernetworkStore()
  
  const activeIcon = h(FontAwesomeIcon, { icon: faEye })
  const inactiveIcon = h(FontAwesomeIcon, { icon: faEyeSlash })
  const lightIcon = h(FontAwesomeIcon, { icon: faLightbulb })
  const darkIcon = h(FontAwesomeIcon, { icon: faSlash })
  const ax = h('span', {class: 'switch-text-icon math-style'}, ['a', h('sup', {}, 'x')])
  const plus = h('span', { class: 'switch-text-icon' }, ['+'])
  
  const buildTime = dayjs(__BUILD_TIMESTAMP__).format('YYYY-MM-DD HH:mm:ss Z')
  const buildType = import.meta.env.PROD ? 'プロダクション' : '開発'
  
  </script>
  
  <template>
      <ElScrollbar>
          <h1>このサイトについて</h1>
          <p>Danbooruのタグポートフォリオを構築するためのサイトです。</p>
          <p>
              現在のバージョンは {{ buildTime }} にビルドされた{{ buildType }}バージョンです。
              現在合計 {{ tagStore.allTagCount }} 個のタグが含まれており、合計 {{ tagStore.tagWithPhotosCount }} 個のタグに写真があります。合計 {{ presetStore.count }} セットのプリセットラベル、{{ embeddingStore.count }} の組み込みモデル、および {{ hypernetworkStore.count }} のハイパーネットワーク モデルが含まれています。
          </p>
          <p>
              このサイトのソースコードとすべての生データは
              <a href="https://github.com/wfjsw/danbooru-diffusion-prompt-builder" target="_blank">danbooru-diffusion-prompt-builder @ GitHub</a>
              GNU AGPL-3.0 契約に基づいて公開されています。このサイトが役に立ったと思われる場合は、GitHub のスターをクリックしてください。
              同時に、 <a href="https://github.com/wfjsw/danbooru-diffusion-prompt-builder/issues" target="_blank">GitHub Issues</a> を通じて質問や提案を提起したり、
              または <a href="https://github.com/wfjsw/danbooru-diffusion-prompt-builder/pulls" target="_blank">Pull Request</a> を通じてこのサイトを変更または補足したりすることも歓迎します。
          </p>
          <p>使い方：</p>
          <ul>
              <li>
                  <p>
                      サイドバーでカテゴリを選択します。カテゴリ タブ カードで、
                      <span class="inline-control">
                          <ElButton type="success" circle>
                              <FontAwesomeIcon :icon="faThumbsUp" />
                          </ElButton>
                      </span>
                      転送ラベル リストにラベルを追加するには、
                      <span class="inline-control">
                          <ElButton type="danger" circle>
                              <FontAwesomeIcon :icon="faThumbsDown" />
                          </ElButton>
                      </span>
                      除外ラベルのリストに追加します。このラベルをリストから削除するには、2 回クリックします。クリック
                      <span class="inline-control">
                          <ElButton circle type="primary">
                              <FontAwesomeIcon :icon="faClipboard" />
                          </ElButton>
                      </span>
                      個々のタグをクリップボードにコピーできます。
                  </p>
              </li>
              <li>
                  <p>
                      画像には職場での閲覧に適さない内容が含まれている可能性があるため、右上隅の2番目のスイッチを調整してください
                      <span class="inline-control">
                          <ElSwitch
                              v-model="settingsStore.showImage"
                              :active-icon="activeIcon"
                              :inactive-icon="inactiveIcon"
                              inline-prompt
                              size="large"
                          />
                      </span>
                      ラベル画像を表示するかどうかを選択します。
                  </p>
              </li>
              <li>
                  <p>
                      右上の 4 番目のスイッチを使用します
                      <span class="inline-control">
                          <ElSwitch
                              v-model="settingsStore.newEmphasis"
                              active-text="()"
                              inactive-text="{}"
                              inline-prompt
                              size="large"
                          />
                      </span>
                      Stable-Diffusion-WebUI 形式で利用可能なアクセント <code>()</code> と
                      NovelAI フォーマット強調 <code>{}</code> の中から選ぶ。注意、
                      このオプションを変更すると、各括弧の重みが
                      {{ settingsStore.newEmphasis ? '1.10' : '1.05' }}
                      から
                      {{ settingsStore.newEmphasis ? '1.05' : '1.10' }}
                      に変更されることに注意してください。
                  </p>
              </li>
              <li>
                  <p>
                      ショッピングカートでは、ラベルを自由にドラッグして、前後の順序を調整できます。位置が高いラベルほど重みが高くなります。右上隅にある 3 番目のスイッチを変更することによって
                      <span class="inline-control">
                          <ElSwitch
                              v-model="settingsStore.useFixedMultiplier"
                              :active-icon="plus"
                              :inactive-icon="ax"
                              inline-prompt
                              size="large"
                          />
                      </span>
                      ステップレートは、線形スケーリングと指数スケーリングの間で選択できます。クリック
                      <span class="inline-control">
                          <ElButton link type="primary">
                              <FontAwesomeIcon :icon="faCirclePlus" />
                          </ElButton>
                      </span>
                      ボタンをクリックして、ラベルの重みを {{ settingsStore.useFixedMultiplier ? '5%' : (settingsStore.newEmphasis ? '1.10' : '1.05') + ' 倍' }}に増やします。
                      <span class="inline-control">
                          <ElButton link type="primary">
                              <FontAwesomeIcon :icon="faCircleMinus" />
                          </ElButton>
                      </span>
                      ボタンをクリックして、ラベルの重量を元の値の{{ settingsStore.useFixedMultiplier ? ' 5%' : '为原先的 ' + (settingsStore.newEmphasis ? '90.91' : '95.24') + '%' }}に減らします。
                      クリック
                      <span class="inline-control">
                          <ElButton link type="primary">
                              <FontAwesomeIcon :icon="faThumbsUpRegular" />
                          </ElButton>
                          <ElButton link type="primary">
                              <FontAwesomeIcon :icon="faThumbsDownRegular" />
                          </ElButton>
                      </span>
                      ラベルは、正方向と負方向の間で移動できます。
                      クリック
                      <span class="inline-control">
                          <ElButton link type="danger">
                              <FontAwesomeIcon :icon="faTrash" />
                          </ElButton>
                      </span>
                      タグはカートから削除できます。
                  </p>
              </li>
              <li>
                  <p>
                      カートをクリックして
                      <span class="inline-control">
                          <ElButton link type="primary">
                              <FontAwesomeIcon :icon="faBlenderRegular" />
                          </ElButton>
                      </span>
                      キーを押すか、別のラベルをラベルにドラッグして混合グループを作成します。混合グループは無限にネストできます。現在のアプリは、次の3つのミックスグループをサポートしています。
                  </p>
                  <ul>
                      <li>
                          <p>
                              <b>タブの置換 (<a href="https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Features#prompt-editing" target="_blank">Prompt Editing</a>別名ステップレンダリング): </b>
                              このmixinは、1つまたは2つのタブとパーセンテージを受け入れます。パーセンテージで表される生成ステップ数の前に、生成エンジンはグループ内の最初のラベルを使用します。このステップ数に達すると、生成エンジンは自動的にグループの 2 番目のラベルに切り替えます。このタブは、Stable-Diffusion-WebUI 形式でのみ使用できます。
                          </p>
                      </li>
                      <li>
                          <p>
                              <b>タグローテーション (<a href="https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Features#alternating-words" target="_blank">Alternating Words</a>): </b>
                              この混合グループは、2つ以上のタグを受け入れます。ビルド プロセス中、ビルド エンジンは、ビルドの各ステップでグループ内のラベルを順番にローテーションします。このタブは、Stable-Diffusion-WebUI 形式でのみ使用できます。
                          </p>
                      </li>
                      <li>
                          <p>
                              <b>タググループ: </b>
                              単純なタグの組み合わせ。このタブは、Stable-Diffusion-WebUI 形式と NovelAI 形式の両方で使用できます。
                          </p>
                      </li>
                  </ul>
              </li>
              <li>
                  <p>ラベルの混合について (<a href="https://github.com/AUTOMATIC1111/stable-diffusion-webui/#:~:text=Composable%2DDiffusion%2C%20a,a%20penguin%20%3A2.2" target="_blank">Composable-Diffusion</a>, つまり <code>AND</code> 文法)：</p>
                  <p>
                      タグ mixin 構文のサポートは、コミット <a href="https://github.com/wfjsw/danbooru-diffusion-prompt-builder/commit/483896ae32a7504f2359e2f6bab389e49d834613" target="_blank">483896a</a> で削除されました。
                      これは、構文の実際の効果から逸脱した実装に関する深刻な問題のためです。文法の<code>AND</code>範囲は完全なプロンプトワードステートメントであり、その優先度は他のすべての文法よりも高く、ステートメント全体が複数の部分に分割され、後続の処理プロセスに送信されることに注意してください。したがって、括弧やコンマなどの文字を使用してスコープを<code>AND</code>制限です。<code>AND</code>デリミタの前後は、完全なプロンプト ワード ステートメントにする必要があります。したがって、ダンボールタグスーパーマーケットを<code>AND</code>文法場合<code>AND</code>は、文法の両側の節を別々に処理する必要があります。たとえば、接続語を使用して決済出力結果を手動でつなぎ合わせるか、<code>AND</code>接続語個別にインポートしてください。
                  </p>
              </li>
  
              <li>
                  <p>
                      右上の最初のスイッチを使用します
                      <span class="inline-control">
                          <ElSwitch
                              v-model="isDark"
                              :active-icon="darkIcon"
                              :inactive-icon="lightIcon"
                              inline-prompt
                              size="large"
                          />
                      </span>
                      切り替え可能な明るい背景。
                  </p>
              </li>
              <li>
                  <p>
                      「Import Tags」で提供される 2 つのパーサーについて:
                  </p>
                  <ul>
                      <li>
                          <p>
                              <b>Naive パーサー: </b>
                              古い手作りの単純なパーサーで、波括弧と括弧が混在するタグを解析するために使用できます。アンバランスな括弧や奇妙な記号に対する許容度が高く、クラッシュはまれですが、正確な結果を解析するのは難しい場合があります。このパーサーは、複雑な混合グループを解析できません。
                          </p>
                      </li>
                      <li>
                          <p>
                              <b>WebUI / NAI パーサー: </b>
                              Earley DSL を使用して構築されたパーサーの新しいバージョン。複雑な構文の正確な解析をサポートしますが、括弧が混在するケースはサポートしません。耐障害性が低く、スタック状態になる可能性があります。
                          </p>
                      </li>
                  </ul>
                  <p>
                      解析するときは、タグの境界を正確に区別するために、タグがカンマで区切られていることを確認してください。角かっこ (中かっこ、角かっこ、括弧を含む。\エスケープ) はコンマに隣接する必要があり、タグの途中にある角かっこはサポートされていません。
                  </p>
              </li>
          </ul>
      </ElScrollbar>
  </template>
  
  <style scoped lang="scss">
  h1 {
      font-size: 1.25rem;
  }
  
  p {
      line-height: 2rem;
      margin-bottom: 1rem;
  }
  
  .scrollable {
      //height: calc(100vh - 64px - 20px - 10px - 2rem - 6em);
      height: 100%;
      overflow-y: auto;
  }
  
  .inline-control > div {
      position: relative;
      top: -.75px;
  }
  
  a {
      text-decoration: none;
      color: hsl(210, 100%, 62%);
  }
  </style>
  