"use client";

import { type ReactNode, useState } from "react";
import { toast } from "sonner";

import {
  PageShell,
  SurfaceCard,
  SectionTitle,
  Button,
  CheckIcon,
  BellIcon,
  SparklesIcon,
  UserIcon,
  BuildingIcon,
  PlugIcon,
} from "@/shared/ui";

type TabId = "profile" | "school" | "notifications" | "ai" | "integrations";
type Aggressiveness = "보수적" | "균형" | "적극적";

interface SettingsTab {
  id: TabId;
  label: string;
  Icon: React.FC<{ className?: string }>;
}

interface FieldProps {
  label: string;
  value: string;
  type?: string;
}

interface ToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

interface SettingRowProps {
  title: string;
  description: string;
  action: ReactNode;
}

const tabs: SettingsTab[] = [
  { id: "profile", label: "프로필", Icon: UserIcon },
  { id: "school", label: "학교 정보", Icon: BuildingIcon },
  { id: "notifications", label: "알림", Icon: BellIcon },
  { id: "ai", label: "AI 설정", Icon: SparklesIcon },
  { id: "integrations", label: "연동", Icon: PlugIcon },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [toggleValues, setToggleValues] = useState({
    stockShortage: true,
    expiryReminder: true,
    aiInsight: true,
    budgetWarning: false,
    autoOrder: true,
    preferenceLearning: true,
    allergyAvoidance: true,
    sheetSync: true,
  });
  const [aggressiveness, setAggressiveness] = useState<Aggressiveness>("균형");

  const handleToggle = (key: keyof typeof toggleValues) => {
    setToggleValues((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <PageShell
      eyebrow="설정"
      title="설정"
      description="프로필, 학교 정보, 알림과 AI 동작 방식을 관리하세요."
      actions={
        <Button
          variant="primary"
          size="md"
          onClick={() => toast.success("변경 사항이 저장되었습니다.")}
        >
          <CheckIcon className="size-4" />
          변경 사항 저장
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start">
        {/* 탭 내비게이션 */}
        <SurfaceCard className="p-2">
          <nav
            aria-label="설정 메뉴"
            className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible"
          >
            {tabs.map((tab) => {
              const selected = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={[
                    "flex h-11 shrink-0 items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold lg:w-full",
                    selected
                      ? "bg-blue-50 text-blue-600"
                      : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800",
                  ].join(" ")}
                >
                  <tab.Icon
                    className={[
                      "size-4 shrink-0",
                      selected ? "text-blue-600" : "text-zinc-400",
                    ].join(" ")}
                    aria-hidden="true"
                  />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </SurfaceCard>

        {/* 패널 콘텐츠 */}
        <SurfaceCard>
          {activeTab === "profile" && <ProfilePanel />}
          {activeTab === "school" && <SchoolPanel />}
          {activeTab === "notifications" && (
            <NotificationsPanel toggleValues={toggleValues} onToggle={handleToggle} />
          )}
          {activeTab === "ai" && (
            <AiPanel
              toggleValues={toggleValues}
              onToggle={handleToggle}
              aggressiveness={aggressiveness}
              onAggressivenessChange={setAggressiveness}
            />
          )}
          {activeTab === "integrations" && (
            <IntegrationsPanel toggleValues={toggleValues} onToggle={handleToggle} />
          )}
        </SurfaceCard>
      </div>
    </PageShell>
  );
}

/* ─── 프로필 ─────────────────────────────────────── */

function ProfilePanel() {
  return (
    <div className="flex flex-col gap-8">
      <SectionTitle title="프로필" description="이름, 연락처, 비밀번호를 수정하세요." />

      {/* 아바타 + 이름 */}
      <div className="flex items-center gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-blue-400 to-blue-600 text-2xl font-bold text-white">
          박
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold text-zinc-950">박지윤 영양교사</p>
          <p className="mt-0.5 text-sm text-zinc-500">한빛초등학교</p>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100"
        >
          사진 변경
        </button>
      </div>

      {/* 필드 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="이름" value="박지윤" />
        <Field label="직책" value="영양교사" />
        <Field label="이메일" value="jiyun.park@hanbit.sc.kr" type="email" />
        <Field label="연락처" value="02-000-0000" />
      </div>
    </div>
  );
}

/* ─── 학교 정보 ───────────────────────────────────── */

function SchoolPanel() {
  return (
    <div className="flex flex-col gap-8">
      <SectionTitle title="학교 정보" description="급식 운영 기본 정보를 관리하세요." />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="학교명" value="한빛초등학교" />
        <Field label="교육지원청" value="서울 강서교육지원청" />
        <Field label="급식 인원" value="1,043명" />
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-zinc-600">급식 유형</span>
          <select
            defaultValue="조식·중식·석식"
            className="h-10 w-full rounded-xl bg-zinc-50 px-3 text-sm font-medium text-zinc-800 outline-none focus:bg-blue-50 focus:ring-2 focus:ring-blue-300"
          >
            <option>조식·중식·석식</option>
            <option>중식</option>
            <option>중식·석식</option>
          </select>
        </label>
      </div>
    </div>
  );
}

/* ─── 알림 ───────────────────────────────────────── */

function NotificationsPanel({
  toggleValues,
  onToggle,
}: {
  toggleValues: {
    stockShortage: boolean;
    expiryReminder: boolean;
    aiInsight: boolean;
    budgetWarning: boolean;
  };
  onToggle: (key: "stockShortage" | "expiryReminder" | "aiInsight" | "budgetWarning") => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle title="알림" description="받고 싶은 알림 유형을 켜거나 끄세요." />
      <RowList>
        <SettingRow
          title="재고 부족 알림"
          description="안전 재고 이하로 떨어지면 알려드려요."
          action={
            <Toggle enabled={toggleValues.stockShortage} onToggle={() => onToggle("stockShortage")} />
          }
        />
        <SettingRow
          title="유통기한 임박 알림"
          description="유통기한 3일 전 알림을 받아요."
          action={
            <Toggle
              enabled={toggleValues.expiryReminder}
              onToggle={() => onToggle("expiryReminder")}
            />
          }
        />
        <SettingRow
          title="AI 인사이트 알림"
          description="새로운 절감·최적화 추천을 받아요."
          action={
            <Toggle enabled={toggleValues.aiInsight} onToggle={() => onToggle("aiInsight")} />
          }
        />
        <SettingRow
          title="예산 초과 경고"
          description="예상 집행률이 90%를 넘으면 경고해요."
          action={
            <Toggle
              enabled={toggleValues.budgetWarning}
              onToggle={() => onToggle("budgetWarning")}
            />
          }
        />
      </RowList>
    </div>
  );
}

/* ─── AI 설정 ─────────────────────────────────────── */

function AiPanel({
  toggleValues,
  onToggle,
  aggressiveness,
  onAggressivenessChange,
}: {
  toggleValues: {
    autoOrder: boolean;
    preferenceLearning: boolean;
    allergyAvoidance: boolean;
  };
  onToggle: (key: "autoOrder" | "preferenceLearning" | "allergyAvoidance") => void;
  aggressiveness: Aggressiveness;
  onAggressivenessChange: (value: Aggressiveness) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle title="AI 설정" description="AI가 수행하는 자동화 방식을 조정하세요." />
      <RowList>
        <SettingRow
          title="자동 발주 제안"
          description="수요 예측에 따라 발주를 자동 제안해요."
          action={
            <Toggle enabled={toggleValues.autoOrder} onToggle={() => onToggle("autoOrder")} />
          }
        />
        <SettingRow
          title="선호도 학습"
          description="학생 투표·잔반 데이터로 추천을 개선해요."
          action={
            <Toggle
              enabled={toggleValues.preferenceLearning}
              onToggle={() => onToggle("preferenceLearning")}
            />
          }
        />
        <SettingRow
          title="알레르기 자동 회피"
          description="등록된 알레르기 식품을 식단에서 제외해요."
          action={
            <Toggle
              enabled={toggleValues.allergyAvoidance}
              onToggle={() => onToggle("allergyAvoidance")}
            />
          }
        />
      </RowList>

      {/* 추천 적극성 — 세그먼트 컨트롤 */}
      <div>
        <p className="text-sm font-semibold text-zinc-950">추천 적극성</p>
        <p className="mt-1 text-sm text-zinc-400">
          AI가 새 메뉴를 얼마나 적극적으로 제안할지 정해요.
        </p>
        <div className="mt-3 grid max-w-xs grid-cols-3 gap-1 rounded-xl bg-zinc-100 p-1">
          {(["보수적", "균형", "적극적"] as const).map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => onAggressivenessChange(label)}
              className={[
                "h-8 rounded-lg text-sm font-semibold",
                label === aggressiveness
                  ? "bg-white text-zinc-950 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── 연동 ───────────────────────────────────────── */

function IntegrationsPanel({
  toggleValues,
  onToggle,
}: {
  toggleValues: { sheetSync: boolean };
  onToggle: (key: "sheetSync") => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle
        title="연동"
        description="급식 운영에 사용하는 외부 시스템을 연결하세요."
      />
      <RowList>
        <SettingRow
          title="나이스(NEIS) 급식 시스템"
          description="교육행정정보시스템과 식단을 동기화해요."
          action={
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              연결됨
            </span>
          }
        />
        <SettingRow
          title="엑셀·구글 시트"
          description="재고 시트를 양방향으로 동기화해요."
          action={
            <Toggle enabled={toggleValues.sheetSync} onToggle={() => onToggle("sheetSync")} />
          }
        />
        <SettingRow
          title="공급업체 EDI"
          description="발주서를 공급업체 시스템으로 전송해요."
          action={
            <button
              type="button"
              className="rounded-lg px-3 py-1.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100"
            >
              연결
            </button>
          }
        />
      </RowList>
    </div>
  );
}

/* ─── 공통 서브 컴포넌트 ──────────────────────────── */

function Field({ label, value, type = "text" }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-zinc-600">{label}</span>
      <input
        type={type}
        defaultValue={value}
        className="h-10 w-full rounded-xl bg-zinc-50 px-3 text-sm font-medium text-zinc-800 outline-none placeholder:text-zinc-400 focus:bg-blue-50 focus:ring-2 focus:ring-blue-300"
      />
    </label>
  );
}

function RowList({ children }: { children: ReactNode }) {
  return <div className="divide-y divide-zinc-100">{children}</div>;
}

function SettingRow({ title, description, action }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between gap-6 py-4 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-zinc-950">{title}</p>
        <p className="mt-0.5 text-sm text-zinc-400">{description}</p>
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

function Toggle({ enabled, onToggle }: ToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={enabled}
      onClick={onToggle}
      className={[
        "relative h-6 w-11 rounded-full",
        enabled ? "bg-blue-600" : "bg-zinc-200",
      ].join(" ")}
    >
      <span
        className={[
          "absolute top-1 size-4 rounded-full bg-white shadow-sm",
          enabled ? "left-6" : "left-1",
        ].join(" ")}
      />
    </button>
  );
}
