---
title: "Signal Pipeline"
description: "X.com 수집부터 Quartz 자동 배포까지의 운영 파이프라인"
tags:
  - system
  - pipeline
  - automation
draft: false
---

# Signal Pipeline

Signal Cabinet의 운영 파이프라인은 아래 흐름을 따릅니다.

```text
[인물 목록]
→ [X.com 글 4시간마다 수집]
→ [날짜별 raw 저장]
→ [OpenClaw 요약 에이전트]
→ [분야별 분류]
→ [Quartz용 Markdown 생성]
→ [GitHub commit/push]
→ [Quartz 블로그 자동 배포]
```

## 1. 인물 목록

기준 파일:

```text
data/people.yaml
```

각 인물은 이름, 분야, X 핸들, 수집 여부, 신뢰도 정보를 가집니다.

## 2. X.com 수집

수집 주기:

```text
4시간마다
```

저장 위치 예시:

```text
data/raw/2026-05-14/elon-musk.json
```

단, 글 파일명에는 날짜를 쓰지 않습니다. 날짜는 raw 데이터와 frontmatter에만 남깁니다.

## 3. OpenClaw 요약

요약 에이전트는 raw 글 묶음을 읽고 아래 정보를 추립니다.

- 오늘의 핵심 신호
- 인물별 발언 요약
- 분야별 변화
- 주목할 연결고리
- 원문 링크
- 주목도: 높음/중간/낮음

요약과 해석은 [[editorial-rules|Editorial Rules]]를 반드시 따릅니다.

## 4. Quartz Markdown 생성

Markdown 글은 아래 폴더에 생성합니다.

```text
content/signals/
```

파일명은 날짜가 아니라 **코드네임**입니다.

예:

```text
content/signals/the-orbit-of-giants.md
content/signals/robots-under-the-glass-moon.md
content/signals/the-cabinet-of-fire-and-silicon.md
```

## 5. GitHub Pages 배포

GitHub에 push하면 Actions가 Quartz를 빌드하고 GitHub Pages로 배포합니다.

배포 기준:

- branch: `v4`
- build command: `npx quartz build`
- output: `public/`
