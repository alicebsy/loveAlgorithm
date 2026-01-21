# Project: Love Algorithm

React + TypeScript + Vite로 구현된 비주얼 노벨 게임입니다.

## 환경 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 설정을 추가하세요:

```env
# API 모드 설정
# mock: 모킹 데이터 사용 (백엔드 없이 테스트)
# backend: 실제 백엔드 API 사용
VITE_API_MODE=mock

# 백엔드 API 기본 URL (백엔드 모드일 때 사용)
VITE_API_BASE_URL=http://lovealgorithmgame.site:8081/api
```

### 모킹 모드 (기본값)
- `VITE_API_MODE=mock`로 설정
- 백엔드 없이도 모든 기능 테스트 가능
- 모킹 데이터를 사용하여 프론트엔드 동작 확인

### 백엔드 모드
- `VITE_API_MODE=backend`로 설정
- 실제 Spring Boot 백엔드와 통신
- `VITE_API_BASE_URL`에 백엔드 URL 설정

## 설치 및 실행

```bash
npm install
npm run dev
```

## 배포하기

프론트엔드를 배포하려면:

1. **빠른 배포**: `QUICK_DEPLOY.md` 참고 (5분 안에 배포)
2. **상세 가이드**: `VERCEL_DEPLOY.md` 참고 (Vercel 배포)
3. **전체 가이드**: `DEPLOYMENT_GUIDE.md` 참고 (다양한 플랫폼)

**가장 쉬운 방법**: Vercel 사용 (무료, 자동 배포)

## API 명세서

백엔드 API 명세서는 `docs/api-spec.md`를 참고하세요.

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
