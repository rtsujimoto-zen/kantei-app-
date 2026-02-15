---
description: コード変更後のビルド・Git記録・デプロイ
---

# デプロイワークフロー

コード変更が完了したら、以下の手順で記録・デプロイする。

// turbo-all

1. フロントエンドをビルドする
```bash
cd /Users/r_tsuji/Documents/開発/算命学算出/webapp/frontend && npm run build
```

2. 変更をGitにコミットする（メッセージは変更内容に応じて適切に設定）
```bash
cd /Users/r_tsuji/Documents/開発/算命学算出 && git add . && git commit -m "<変更内容の要約>"
```

3. GitHubにプッシュする
```bash
cd /Users/r_tsuji/Documents/開発/算命学算出 && git push origin main
```

4. ローカル開発サーバーを再起動する（ビルドで停止するため必須）
```bash
cd /Users/r_tsuji/Documents/開発/算命学算出/webapp/frontend && npm run dev
```
