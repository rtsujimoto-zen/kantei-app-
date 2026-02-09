# デプロイメント仕様書 (Deployment Specification)

## 概要
本プロジェクト「算命学算出アプリ (The Zen Terra)」のデプロイ環境と手順を定義します。

## 1. システム構成
| コンポーネント | 技術スタック | ホスティング | URL / Service Name |
|---|---|---|---|
| **Frontend** | Next.js (App Router) | **Vercel** | `https://kantei-app.vercel.app` (仮) |
| **Backend API** | FastAPI (Python) | **Cloud Run** | `kantei-api` <br> (`https://kantei-api-[HASH].us-central1.run.app`) |
| **Database** | (None / In-memory) | - | - |

> [!NOTE]
> ドメイン `the-zen-terra.com` は現在 Xserver VPS を向いていますが、将来的には Vercel に向けることを推奨します。

## 2. デプロイフロー

### Frontend (Next.js)
**Trigger**: GitHub `main` ブランチへの Push
**Process**: Node.js 20.x 環境でビルド (`npm run build`)
**Command**:
```bash
git add .
git commit -m "feat: Update UI"
git push origin main
```

### Backend (FastAPI)
**Trigger**: 手動コマンド実行 (Manual)
**Process**: Google Cloud Buildpacks を使用してコンテナ化・デプロイ
**Command**:
```bash
# 1. 認証 (必要に応じて)
gcloud auth login

# 2. プロジェクト設定
# プロジェクトID: kantei-app-486114
gcloud config set project kantei-app-486114

# 3. デプロイ
# ルートディレクトリで実行
gcloud run deploy kantei-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

## 3. 環境変数 (Environment Variables)

### Frontend (`.env.local` / Vercel Settings)
- `NEXT_PUBLIC_API_URL`: バックエンドAPIのURL
  - Current: `https://kantei-api-538317999249.us-central1.run.app`

### Backend (Cloud Run)
- 必要に応じて Cloud Run の設定画面または `--set-env-vars` で設定。
- 現在は ADC (Application Default Credentials) を使用しているため、認証情報は不要。

## 4. トラブルシューティング

### 認証エラー (gcloud)
`gcloud auth login` を再実行してください。

### デプロイ失敗 (Cloud Run)
`gcloud run deploy` のログを確認してください。
よくある原因:
- `requirements.txt` の不足
- Python バージョンの不一致
- `.gcloudignore` 設定ミス（不要なファイルが含まれている）

## 5. 運用ルール
- **AIエージェントへの指示**: 作業開始時に `AI_RULES.md` を読み込ませることで、この構成を認識させます。
- **構成変更時**: このファイルと `AI_RULES.md` を必ず更新してください。
