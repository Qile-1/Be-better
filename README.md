# Be better

移动端优先的中文 Web 应用，定位为四级阅读的 AI 费曼督学产品。

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

## 环境变量

复制 `.env.local.example` 为 `.env.local`，并填写：

```bash
DEEPSEEK_API_KEY=你的 DeepSeek API Key
```

`.env.local` 已写入 `.gitignore`，不会被提交到 Git。

## 推到 GitHub

```bash
git init
git add .
git commit -m "feat: initialize be better app"
git branch -M main
git remote add origin https://github.com/<你的用户名>/be-better.git
git push -u origin main
```

也可以用 GitHub CLI：

```bash
gh repo create be-better --private --source . --remote origin --push
```

## Zeabur 部署

1. 在 Zeabur 新建 Project，并从 GitHub 导入这个仓库。
2. Zeabur 会自动识别 Next.js 项目。
3. 在服务的 Variables 中配置 `DEEPSEEK_API_KEY`。
4. 部署区域选择你已购买的新加坡服务器。
5. 确认 Build/Start 配置使用 Zeabur 自动识别结果即可。
