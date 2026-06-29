# Hololog Client — 기능 · 페이지 · API 전체 정리

---

## 1. 페이지 / 라우트

| 경로 | 뷰 | 설명 |
|------|-----|------|
| `/` | DashboardPage | 메인 대시보드 (오늘 식단, 예산, AI 인사이트) |
| `/meal` | MealManagementPage | 월간 식단 캘린더 — 식단 등록·수정·삭제·잔반 기록 |
| `/inventory` | InventoryPage | 식재료 재고 관리 — 목록·검색·일괄 삭제 |
| `/budget` | BudgetPage | 예산 집행 현황 및 KPI 카드 |
| `/ai-meal` | AiMealPage | AI 월간 식단 자동 생성 (조건 설정 → 결과 → 예산 평가) |
| `/export` | ExportPage | 식단 내보내기 (PDF·Excel·인쇄) |
| `/ingredient-plans` | IngredientPlansPage | 발주 계획 목록 — 등록·수정·삭제 |
| `/ingredient-plans/[planId]` | IngredientPlanDetailPage | 발주 계획 단건 상세 |
| `/settings` | SettingsPage | 프로필 확인 · 학교명 수정 · 로그아웃 |
| `/admin` | AdminPage | 영양사 가입 신청 승인·거절 (ADMIN 전용) |
| `/student` | StudentPage | 학생 포털 — 오늘 급식 조회, 먹고 싶은 급식 제안 |
| `/login` | LoginPage | 이메일·비밀번호 로그인 |
| `/signup` | SignupPage | 회원가입 (역할 선택 → 정보 입력 → 면허 인증) |

---

## 2. 뷰 (Views)

| 뷰 | 구성 위젯·피처 |
|----|----------------|
| DashboardPage | TodayMeals, BudgetSummary, StudentSuggestions |
| MealManagementPage | MealCalendar, DietFormDialog |
| InventoryPage | InventoryActions, InventoryTable |
| BudgetPage | BudgetKpiCards, ExecutionDonut |
| AiMealPage | ConditionsPanel, GeneratedMealPanel, EvaluationPanel, ActionBar |
| ExportPage | ExportCenter (FormSelector, ExportOptions, MealPreview) |
| IngredientPlansPage | IngredientPlansWidget |
| IngredientPlanDetailPage | IngredientPlanDetailWidget |
| LoginPage | AuthLayout, LoginForm |
| SignupPage | AuthLayout, SignupForm |
| SettingsPage | ProfilePanel, SchoolForm, LogoutButton |
| AdminPage | SignupRequestList |
| StudentPage | 오늘 급식 표시, 제안 폼 |

---

## 3. 위젯 (Widgets)

| 위젯 | 설명 |
|------|------|
| Sidebar | 로고, 역할별 네비게이션, 학교 선택, 유저 섹션 |
| TopBar | 페이지 제목, 현재 날짜 |
| MealCalendar | 월간 식단 그리드, 상세 패널, 수정·삭제·잔반 다이얼로그 |
| InventoryTable | 재고 목록 테이블 (검색, 카테고리 필터, 일괄 선택, CSV 내보내기) |
| BudgetSummary | 예산 도넛 차트, 집행률·잔액 표시 |
| TodayMeals | 조식·중식·석식 현황 카드 (칼로리, 상태) |
| StudentSuggestions | 학생 급식 제안 목록 — 승인·거절 버튼 |
| LowStock | 재고 부족 식재료 경고 (상위 4개, 진행바) |
| AiInsights | AI 추천 인사이트 3건 (가격·수량·메뉴, 신뢰도) |
| GeneratedMealPanel | AI 생성 결과 (상태·생성 건수·오류) |
| EvaluationPanel | 예산 정보·유효성 오류 목록 |
| ExportCenter | 서식 선택, 출력 옵션, 미리보기 3단 레이아웃 |
| IngredientPlansWidget | 발주 계획 카드 그리드 — 등록·수정·삭제 |
| IngredientPlanDetailWidget | 발주 계획 단건 상세 — 수정·삭제 |
| StatCards | KPI 4종 (오늘 식단, 내일 예측, 식재료 비용, AI 절감액) |

---

## 4. 피처 (Features)

| 피처 | 주요 동작 |
|------|-----------|
| auth | 로그인·회원가입·영양사 면허 제출·로그아웃, 역할별 라우트 가드 |
| meal | 오늘 급식 조회, 학생 급식 제안 CRUD·상태 변경, AI 식단 생성 |
| ingredient-plan | 발주 계획 CRUD, PlanFormModal |
| ai-meal-generator | AI 생성 조건 설정 (재고·예산·선호·영양), 생성 요청 |
| meal-export | 서식 선택 (공문·가정통신문·학생용), 포맷(PDF·Excel·인쇄) 선택 |
| ingredient-actions | 식재료 추가·수정·삭제 (IngredientFormModal) |
| admin | 영양사 가입 신청 목록 조회·승인·거절 (페이지네이션) |
| inventory-filter | 클라이언트 사이드 검색·카테고리 필터·일괄 선택 상태 관리 |

---

## 5. 엔티티 (Entities)

| 엔티티 | 도메인 모델 | 스토어 |
|--------|------------|--------|
| meal | TodayMeal, MealSuggestion, AiMealPlanResult | — |
| diet | Diet, DietListItem, DietLeftover, DietExport | meal-calendar.store (연동) |
| ingredient | IngredientItem, IngredientDetail | ingredient.store |
| budget | Budget | — |
| ingredient-plan | IngredientPlan | ingredient-plan.store |
| member | MemberProfile | profile.store |
| auth | LoginCredentials, SigninResponse, UserRole | — |
| school | School | — |

---

## 6. API 전체 목록

### 인증 (`/auth`)

| 메서드 | 엔드포인트 | 인증 | 요청 | 응답 |
|--------|-----------|------|------|------|
| POST | `/auth/signin` | ✗ | `{email, password}` | `{accessToken, refreshToken, role}` |
| POST | `/auth/signup` | ✗ | `{role, email, name, schoolName, password}` | 204 |
| POST | `/auth/signup-requests` | ✓ | `{licenseNumber}` | `{requestId, status}` |
| POST | `/auth/logout` | ✓ | — | 204 |

### 급식 (`/meals`)

| 메서드 | 엔드포인트 | 인증 | 요청 | 응답 |
|--------|-----------|------|------|------|
| GET | `/meals/today?mealType=BREAKFAST\|LUNCH\|DINNER` | ✓ | — | `TodayMeal` |
| GET | `/meals/suggestions` | ✓ | — | `MealSuggestion[]` |
| POST | `/meals/suggestions` | ✓ | `{title, content?}` | 204 |
| PATCH | `/meals/suggestions/{suggestionId}` | ✓ | `{mealSuggestionStatus}` | 204 |
| POST | `/meals/ai-generations` | ✓ | `{month, holidays?}` | `AiMealPlanResult` |
| POST | `/meals` | ✓ | AI 콜백 페이로드 | 201/204 |

### 식단 (`/diets`)

| 메서드 | 엔드포인트 | 인증 | 요청 | 응답 |
|--------|-----------|------|------|------|
| GET | `/diets` | ✓ | — | `DietListItem[]` |
| GET | `/diets/{dietId}` | ✓ | — | `Diet` |
| POST | `/diets` | ✓ | `{name, description?, dietDate, mealType?}` | 204 |
| PATCH | `/diets/{dietId}` | ✓ | `{name, description?, dietDate, mealType?}` | `Diet` |
| DELETE | `/diets/{dietId}` | ✓ | — | 204 |
| GET | `/diets/{dietId}/leftovers` | ✓ | — | `DietLeftover` \| null |
| POST | `/diets/{dietId}/leftovers` | ✓ | `{amount, unit, memo?}` | 204 |
| POST | `/diets/{dietId}/exports` | ✓ | `{dietExportFormat}` | `{id, fileUrl}` |

### 식재료 재고 (`/ingredients`)

| 메서드 | 엔드포인트 | 인증 | 요청 | 응답 |
|--------|-----------|------|------|------|
| GET | `/ingredients` | ✓ | — | `IngredientItem[]` |
| POST | `/ingredients` | ✓ | `{name, category, quantity, unit, expirationDate?}` | 201 |
| GET | `/ingredients/{id}` | ✓ | — | `IngredientDetail` |
| PATCH | `/ingredients/{id}` | ✓ | 부분 업데이트 | `IngredientDetail` |
| DELETE | `/ingredients/{id}` | ✓ | — | 204 |

### 발주 계획 (`/ingredients/plans`)

| 메서드 | 엔드포인트 | 인증 | 요청 | 응답 |
|--------|-----------|------|------|------|
| GET | `/ingredients/plans` | ✓ | — | `IngredientPlan[]` |
| GET | `/ingredients/plans/{planId}` | ✓ | — | `IngredientPlan` |
| POST | `/ingredients/plans` | ✓ | `{title, startDate, endDate, memo?}` | 201 |
| PATCH | `/ingredients/plans/{planId}` | ✓ | 부분 업데이트 | `IngredientPlan` |
| DELETE | `/ingredients/plans/{planId}` | ✓ | — | 204 |

### 예산 (`/budgets`)

| 메서드 | 엔드포인트 | 인증 | 요청 | 응답 |
|--------|-----------|------|------|------|
| GET | `/budgets` | ✓ | — | `Budget[]` |
| GET | `/budgets/{budgetId}` | ✓ | — | `Budget` |
| POST | `/budgets` | ✓ | `{title, totalAmount, startDate, endDate}` | 204 |

### 회원 (`/members`)

| 메서드 | 엔드포인트 | 인증 | 요청 | 응답 |
|--------|-----------|------|------|------|
| GET | `/members/me` | ✓ | — | `{name, role, schoolName}` |
| PATCH | `/members/me/school-name` | ✓ | `{schoolName}` | `MemberProfile` |

### 관리자 (`/admin`)

| 메서드 | 엔드포인트 | 인증 | 요청 | 응답 |
|--------|-----------|------|------|------|
| GET | `/admin/signup-requests?page=0&size=20` | ✓ (ADMIN) | — | `{requests[], totalPages, page}` |
| POST | `/admin/signup-requests/{requestId}/approve` | ✓ (ADMIN) | — | `SignupRequestResponse` |
| POST | `/admin/signup-requests/{requestId}/reject` | ✓ (ADMIN) | — | `SignupRequestResponse` |

### 내부 프록시 (`/api`)

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | `/api/neis/schools?name=...` | NEIS 학교 검색 프록시 |
| ANY | `/api/backend/[...path]` | 백엔드 프록시 리라이트 |

---

## 7. 상태 관리 (Zustand Stores)

| 스토어 | 위치 | 관리 상태 |
|--------|------|-----------|
| `useAuthStore` | `features/auth/model` | role, 로그인·로그아웃 액션 |
| `useMemberProfileStore` | `entities/member/model` | 프로필, fetchProfile, clearProfile |
| `useIngredientStore` | `entities/ingredient/model` | 재고 목록 CRUD |
| `useIngredientPlanStore` | `features/ingredient-plan/model` | 발주 계획 CRUD, 모달 open/close |
| `useGeneratorStore` | `features/ai-meal-generator/model` | AI 생성 조건·상태·결과 |
| `useExportStore` | `features/meal-export/model` | 서식·포맷 선택 |
| `useAdminStore` | `features/admin/model` | 가입 신청 목록, 페이지네이션 |
| `useInventoryFilterStore` | `features/inventory-filter/model` | 검색어·카테고리·일괄 선택 |
| `useMealCalendarStore` | `widgets/meal-calendar/model` | 선택된 식단 ID, 리로드 토큰 |
| `useMealStore` | `features/meal/model` | 오늘 급식, 제안 목록·액션 |

---

## 8. 인증 · 권한 흐름

```
로그인 → JWT (accessToken + refreshToken) → localStorage + cookie
  ├─ ADMIN       → /admin
  ├─ STUDENT     → /student
  └─ 그 외       → /dashboard

토큰 만료 시: axios 인터셉터 → /auth/reissue → 실패 시 /login 리다이렉트
미인증 접근 시: layout.tsx 서버 컴포넌트 → redirect('/login')

영양사 가입 흐름:
  PENDING_NUTRITIONIST 가입 → 면허번호 제출 (/auth/signup-requests)
  → ADMIN 승인 → NUTRITIONIST 역할 부여
```

---

## 9. 사용자 역할

| 역할 | 접근 가능 페이지 |
|------|----------------|
| `ADMIN` | /admin |
| `STUDENT` | /student, /settings |
| `TEACHER` · `NUTRITIONIST` | 대시보드 전체 (/dashboard, /meal, /inventory, /budget, /ai-meal, /export, /ingredient-plans, /settings) |
| `PENDING_NUTRITIONIST` | 로그인 즉시 로그아웃 처리 (미승인 상태) |
