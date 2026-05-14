---
title: Signal Cabinet
description: "세계 주요 인물의 공개 신호를 모아 미래의 방향을 읽는 니치 브리핑 블로그"
tags:
  - home
  - signal-cabinet
---

# Signal Cabinet

**세계를 움직이는 사람들의 공개 신호를 채집해, 내일의 지도를 만드는 관측소.**

이곳은 단순한 뉴스 요약 블로그가 아닙니다.  
정치, AI, 테크, 투자, 로봇, 미디어 인물들이 X.com에 남기는 공개 발언을 모아 **흐름·충돌·전조**를 읽는 작은 정보 캐비닛입니다.

## 우리가 보는 것

- **인물의 말**: 공식 계정에서 나온 직접 발언
- **분야의 온도**: AI, 테크, 투자, 로봇, 미디어, 정치의 움직임
- **반복되는 신호**: 하루짜리 소음이 아니라 축적되는 패턴
- **미래의 방향**: 지금은 작은 문장이지만 나중에는 큰 변화가 될 수 있는 단서

## 운영 방식

1. [[atlas/people|인물 목록]]을 기준으로 X.com 공개 글을 수집합니다.
2. 수집된 글은 날짜별 raw 데이터로 보존합니다.
3. OpenClaw 요약 에이전트가 핵심 신호를 추립니다.
4. 분야별로 분류하고, Quartz용 Markdown으로 변환합니다.
5. GitHub에 commit/push되면 Quartz 블로그가 자동 배포됩니다.

## 글 제목과 파일명 원칙

이 블로그는 `2026-05-14.md` 같은 파일명을 쓰지 않습니다.  
날짜는 기록용 메타데이터로만 남기고, 글 파일은 매번 **그날의 신호를 상징하는 멋진 코드네임**으로 저장합니다.

예:

- `the-signal-cabinet-opens.md`
- `a-quiet-council-of-machines.md`
- `the-orbit-of-giants.md`
- `robots-under-the-glass-moon.md`

먼저 읽어볼 글: [[signals/the-signal-cabinet-opens|The Signal Cabinet Opens]]
