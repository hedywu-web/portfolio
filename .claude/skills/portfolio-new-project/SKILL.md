---
name: portfolio-new-project
description: 在 2026 作品集網站新增一個專案頁面的完整工作流程。當使用者說「新增專案」、「幫我加一個作品」、「複製一個頁面給 X」、「新增 X 的頁面」，或是把圖片放進 assets/projects/ 想建頁面時，一定要用這個 skill。涵蓋圖片轉換、命名、HTML 頁面生成、work.html 連結更新。
---

# 作品集新增專案工作流程

## 專案結構

```
2026 作品集/
├── projects/               ← 專案頁面放這裡（如 baplcp.html）
├── assets/
│   ├── projects/
│   │   └── [name]/        ← 專案圖片放這裡（WebP）
│   └── thumbnails/        ← work.html 的縮圖
├── work.html              ← 所有作品列表頁
├── _archive/              ← 淘汰檔案丟這裡
└── .claude/skills/
```

## 步驟一：圖片轉換

使用者把 PNG 放進 `assets/projects/[name]/` 後：

**命名規則**：`[project-name]-1.webp`、`[project-name]-2.webp`… 依序編號。  
若原始檔名有跳號或錯字（如 BAPCLP 而非 BAPLCP），轉換時修正並重新排序。

**轉換指令**（用 Python/Pillow，macOS 的 sips 不支援 WebP）：

```python
from PIL import Image
import os

base = "assets/projects/[name]"
files = [
    ("原始檔.png", "name-1.webp"),
    # ...
]
for src, dst in files:
    img = Image.open(os.path.join(base, src))
    img.save(os.path.join(base, dst), "WEBP", quality=88, method=6)
```

轉換後，把原始 PNG 移到 `_archive/`：
```bash
mv "assets/projects/[name]/*.png" "_archive/"
```

## 步驟二：建立專案頁面

以 `projects/mixerbox-ai.html` 為模板複製，修改以下部分：

| 位置 | mixerbox-ai 原文 | 改成 |
|------|-----------------|------|
| `<title>` | MixerBox AI App | 專案中文名稱 |
| breadcrumb `.here` | MixerBox AI App | 專案中文名稱 |
| `<h1>` | MixerBox AI App | 專案中文名稱 |
| gallery `<img>` | mbai-1.webp 等 | [name]-1.webp 等 |
| `alt` 屬性 | MixerBox AI App 作品介紹 | 對應專案名稱 |

**Gallery 結構**（圖片之間 gap: 0，無間距）：
```html
<main class="gallery">
  <div class="shot">
    <img src="../assets/projects/[name]/[name]-1.webp" alt="[專案名] 介紹 1">
  </div>
  <div class="shot">
    <img src="../assets/projects/[name]/[name]-2.webp" alt="[專案名] 介紹 2">
  </div>
  <!-- 依圖片數量增減 -->
</main>
```

`.gallery` 的 `gap` 必須是 `0`（不是 `28px`）。

Nav 的 Works 連結改為：
```html
<a href="../work.html" class="active">Works</a>
```

## 步驟三：更新 work.html

找到對應的作品卡片，把 `<div class="work reveal">` 改成 `<a>`：

```html
<!-- 改前 -->
<div class="work reveal">

<!-- 改後 -->
<a class="work reveal" href="projects/[name].html">
```

結尾 tag 也要從 `</div>` 改成 `</a>`。

## 常見狀況

**使用者分批放圖片**：一張一張補進來很正常。每次補圖流程：
1. 轉 WebP（覆蓋舊的或新增編號）
2. 移除 PNG 到 `_archive/`
3. 若 HTML 裡還沒有這張圖，在 gallery 補上對應的 `<div class="shot">`

**圖片順序有誤**：若已有 1、3、4 缺少 2，補上 2 之後，把舊的 2→3、3→4 依序重新命名，HTML 的 src 也一起更新。

**ffmpeg 無法輸出 WebP**：這台機器的 ffmpeg 沒有 libwebp encoder，永遠用 Python Pillow。

## 不需要做的事

- 不用改 `index.html`（首頁）
- 不用建 mobile 版圖片（mixerbox-ai 有 mobile srcset，但新頁面不需要，除非使用者要求）
- 不用加 proj-meta、proj-lede 等欄位，除非使用者要求
