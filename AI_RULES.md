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
