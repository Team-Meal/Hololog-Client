# 호로록 (Hororog) — Client

학교 급식 운영 관리 플랫폼의 프론트엔드. Next.js (App Router) + TypeScript + Tailwind CSS v4로
작성되었으며, Feature-Sliced Design(FSD) 구조를 따릅니다.

## 시작하기

```bash
npm install
cp .env.example .env.local   # 값 채우기
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인할 수 있습니다.

## 환경 변수

`.env.example`을 참고해 `.env.local`을 구성하세요. 주요 변수:

- `NEXT_PUBLIC_MEAL_API_BASE_URL` — 백엔드 API 베이스 URL (필수)
- `NEXT_PUBLIC_SITE_URL` — 배포 도메인 (메타데이터용, 배포 시 설정 권장)
- `NEIS_API_KEY`, `KAMIS_CERT_KEY` / `KAMIS_CERT_ID` — 선택. 없으면 각각 무인증 모드 /
  정적 스냅샷으로 동작

## 명령어

- `npm run dev` — 개발 서버
- `npm run build` / `npm run start` — 프로덕션 빌드 / 서빙
- `npm run lint` — ESLint
- `npm run format` / `npm run format:check` — Prettier
- `npx tsc --noEmit` — 타입 체크

## 아키텍처

`app → views → widgets → features → entities → shared` 계층의 Feature-Sliced Design을
따릅니다. 자세한 규칙은 `CLAUDE.md`와 `.claude/rules/`를 참고하세요.

## 배포

Vercel에 배포하는 경우 [Next.js 배포 문서](https://nextjs.org/docs/app/building-your-application/deploying)를 참고하세요.
