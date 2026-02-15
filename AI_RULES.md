# AI Rules & Context
このファイルは、AIエージェントがプロジェクトの文脈を理解し、一貫した操作を行うためのルールセットです。
AIは作業開始時に必ずこのファイルを参照してください。

## 1. プロジェクト構成
- **Frontend**: Next.js (TypeScript)
  - ホスティング: **Vercel**
  - デプロイ方法: GitHub (`main` ブランチ) への Push で自動デプロイ
- **Backend**: Python (FastAPI)
  - ホスティング: **Cloud Run**
  - サービス名: `kantei-api`
  - リージョン: `us-central1`
  - デプロイ方法: `gcloud` コマンドによる手動デプロイ（またはCloud Build）

## 2. デプロイ手順
### Frontend
1. 変更をコミット: `git commit -m "feat: ..."`
2. Push: `git push origin main`
3. Vercelが自動的にビルド・デプロイします。

### Backend
1. Google Cloud認証確認: `gcloud auth login` (初回のみ)
2. デプロイコマンド実行:
   ```bash
   # プロジェクトIDの設定
   gcloud config set project kantei-app-486114
   
   # デプロイ
   gcloud run deploy kantei-api --source . --region us-central1
   ```
   ※ ルートディレクトリで実行すること。

## 3. 重要ファイル
- `webapp/frontend/.env.local`: API接続先URL (`NEXT_PUBLIC_API_URL`)
- `webapp/backend/api.py`: バックエンドのエントリーポイント
- `webapp/frontend/src/components/`: UIコンポーネント

## 4. 特記事項
- **VPS (Xserver)**: 過去に使用していたが現在は使用しない。`update_vps.sh` は使用禁止。
- **デプロイフロー**: フロントエンドは自動、バックエンドは手動。
- **改善提案**: 将来的な改善やアイデアは `future_improvements.md` に追記・管理すること。

## 5. UI変更時の検証ルール（必須）
UI・レイアウト・画像配置を変更した場合、以下を**必ず**実施すること。ユーザーに報告する前に自分で検証を完了させること。

### 5-1. ブラウザでの目視確認
- **必ずスクリーンショットを撮影**し、変更箇所が要求通りかを**自分の目で判断**する
- ブラウザサブエージェントの「問題ない」というテキスト報告だけを信じない。スクリーンショット画像を直接確認する
- PC表示とSP表示（375px幅）の両方で確認する

### 5-2. 透明度の低い要素の確認
- シルエット画像やウォーターマークなど、opacityが低く薄い要素を修正する場合は、**一時的にopacityを0.3程度に上げて**位置が正しいことを確認してから元に戻す

### 5-3. 確認できなかった場合
- 変更の効果がスクリーンショットで判断できない場合は、「確認済み」と報告せず、正直に「視認しづらいため追加確認が必要」と報告する
