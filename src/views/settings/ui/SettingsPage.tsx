"use client";

import { type ReactNode, type SVGProps, useState } from "react";
import { Toaster, toast } from "sonner";

type TabId = "profile" | "school" | "notifications" | "ai" | "integrations";
type Aggressiveness = "보수적" | "균형" | "적극적";

interface SettingsTab {
  id: TabId;
  label: string;
  icon: (props: SVGProps<SVGSVGElement>) => ReactNode;
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
  { id: "profile", label: "프로필", icon: UserIcon },
  { id: "school", label: "학교 정보", icon: BuildingIcon },
  { id: "notifications", label: "알림", icon: BellIcon },
  { id: "ai", label: "AI 설정", icon: SparklesIcon },
  { id: "integrations", label: "연동", icon: PlugIcon },
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
    setToggleValues((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  return (
    <main className="min-h-screen bg-[#f4f4f6] px-4 py-6 text-[#18181b] sm:px-8 lg:px-12">
      <Toaster position="top-right" richColors closeButton />
      <section className="mx-auto flex w-full max-w-[1520px] flex-col gap-6">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#2f6df6]">설정</p>
            <h1 className="mt-2 text-4xl font-bold tracking-normal text-[#18181b] sm:text-5xl">
              설정
            </h1>
            <p className="mt-3 text-base font-medium text-[#8a8f98]">
              프로필, 학교 정보, 알림과 AI 동작 방식을 관리하세요.
            </p>
          </div>
          <button
            type="button"
            onClick={() => toast.success("변경 사항이 저장되었습니다.")}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2f6df6] px-5 text-base font-semibold text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#285ed9] hover:shadow-lg hover:shadow-[#2f6df6]/25 active:translate-y-0 active:scale-[0.98] sm:w-auto"
          >
            <CheckIcon className="size-5" />
            변경 사항 저장
          </button>
        </header>

        <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start">
          <nav
            aria-label="설정 메뉴"
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {tabs.map((tab) => {
              const selected = tab.id === activeTab;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={[
                    "flex h-12 shrink-0 items-center gap-3 rounded-xl px-4 text-left text-base font-semibold transition lg:w-full",
                    selected
                      ? "bg-[#eaf2ff] text-[#2f6df6]"
                      : "text-[#737780] hover:bg-white/70 hover:text-[#18181b]",
                  ].join(" ")}
                >
                  <Icon className="size-6" aria-hidden="true" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <section className="rounded-[28px] bg-white p-5 shadow-[0_1px_0_rgba(15,23,42,0.02)] sm:p-7 lg:p-8">
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
          </section>
        </div>
      </section>
    </main>
  );
}

function ProfilePanel() {
  return (
    <div>
      <h2 className="text-xl font-bold text-[#18181b]">프로필</h2>
      <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#dedfe6] text-xl font-bold text-[#6f727b]">
            박
          </div>
          <div>
            <p className="text-xl font-bold text-[#18181b]">박지윤 영양교사</p>
            <p className="mt-1 text-sm font-medium text-[#9a9fa8]">한빛초등학교</p>
          </div>
        </div>
        <ActionTextButton className="self-start sm:self-center">사진 변경</ActionTextButton>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Field label="이름" value="박지윤" />
        <Field label="직책" value="영양교사" />
        <Field label="이메일" value="jiyun.park@hanbit.sc.kr" type="email" />
        <Field label="연락처" value="02-000-0000" />
      </div>
    </div>
  );
}

function SchoolPanel() {
  return (
    <div>
      <h2 className="text-xl font-bold text-[#18181b]">학교 정보</h2>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Field label="학교명" value="한빛초등학교" />
        <Field label="교육지원청" value="서울 강서교육지원청" />
        <Field label="급식 인원" value="1,043명" />
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-[#737780]">급식 유형</span>
          <select
            defaultValue="조식·중식·석식"
            className="h-12 w-full rounded-xl border border-[#e6e8ec] bg-white px-4 text-base font-medium text-[#33363d] transition outline-none focus:border-[#2f6df6] focus:ring-4 focus:ring-[#2f6df6]/10"
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
    <PanelList title="알림">
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
        action={<Toggle enabled={toggleValues.aiInsight} onToggle={() => onToggle("aiInsight")} />}
      />
      <SettingRow
        title="예산 초과 경고"
        description="예상 집행률이 90%를 넘으면 경고해요."
        action={
          <Toggle enabled={toggleValues.budgetWarning} onToggle={() => onToggle("budgetWarning")} />
        }
      />
    </PanelList>
  );
}

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
    <PanelList title="AI 설정">
      <SettingRow
        title="자동 발주 제안"
        description="수요 예측에 따라 발주를 자동 제안해요."
        action={<Toggle enabled={toggleValues.autoOrder} onToggle={() => onToggle("autoOrder")} />}
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
      <div className="pt-5">
        <p className="text-base font-bold text-[#18181b]">추천 적극성</p>
        <p className="mt-1 text-sm font-medium text-[#a0a4ad]">
          AI가 새 메뉴를 얼마나 적극적으로 제안할지 정해요.
        </p>
        <div className="mt-4 grid max-w-sm grid-cols-3 rounded-2xl bg-[#eceef2] p-1">
          {(["보수적", "균형", "적극적"] as const).map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => onAggressivenessChange(label)}
              className={[
                "h-9 rounded-xl text-sm font-semibold transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
                label === aggressiveness
                  ? "bg-white text-[#18181b] shadow-md shadow-slate-300/40"
                  : "text-[#737780] hover:bg-white/50 hover:text-[#18181b]",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </PanelList>
  );
}

function IntegrationsPanel({
  toggleValues,
  onToggle,
}: {
  toggleValues: {
    sheetSync: boolean;
  };
  onToggle: (key: "sheetSync") => void;
}) {
  return (
    <PanelList title="연동">
      <SettingRow
        title="나이스(NEIS) 급식 시스템"
        description="교육행정정보시스템과 식단을 동기화해요."
        action={
          <span className="rounded-full bg-[#dff4df] px-3 py-1 text-xs font-bold text-[#318646]">
            연결됨
          </span>
        }
      />
      <SettingRow
        title="엑셀·구글 시트"
        description="재고 시트를 양방향으로 동기화해요."
        action={<Toggle enabled={toggleValues.sheetSync} onToggle={() => onToggle("sheetSync")} />}
      />
      <SettingRow
        title="공급업체 EDI"
        description="발주서를 공급업체 시스템으로 전송해요."
        action={<ActionTextButton>연결</ActionTextButton>}
      />
    </PanelList>
  );
}

function Field({ label, value, type = "text" }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#737780]">{label}</span>
      <input
        type={type}
        defaultValue={value}
        className="h-12 w-full rounded-xl border border-[#e6e8ec] bg-white px-4 text-base font-medium text-[#33363d] transition outline-none placeholder:text-[#b5bac3] focus:border-[#2f6df6] focus:ring-4 focus:ring-[#2f6df6]/10"
      />
    </label>
  );
}

function PanelList({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-[#18181b]">{title}</h2>
      <div className="mt-5 divide-y divide-[#eef0f3] border-t border-[#eef0f3]">{children}</div>
    </div>
  );
}

function SettingRow({ title, description, action }: SettingRowProps) {
  return (
    <div className="flex min-h-20 items-center justify-between gap-5 py-5">
      <div>
        <p className="text-base font-bold text-[#18181b]">{title}</p>
        <p className="mt-1 text-sm font-medium text-[#a0a4ad]">{description}</p>
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

function ActionTextButton({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={[
        "rounded-lg px-3 py-2 text-sm font-bold text-[#18181b] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-white hover:shadow-md hover:shadow-slate-200 active:translate-y-0 active:scale-[0.97]",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Toggle({ enabled, onToggle }: ToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={enabled}
      onClick={onToggle}
      className={[
        "relative h-8 w-14 rounded-full transition-colors duration-200 ease-out",
        enabled ? "bg-[#58bf61]" : "bg-[#c9ccd4]",
      ].join(" ")}
    >
      <span
        className={[
          "absolute top-1 left-1 size-6 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out",
          enabled ? "translate-x-6" : "translate-x-0",
        ].join(" ")}
      />
    </button>
  );
}

function UserIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function BuildingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
      <path d="M16 8h2a2 2 0 0 1 2 2v11" />
      <path d="M8 7h4M8 11h4M8 15h4M4 21h16" />
    </svg>
  );
}

function BellIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

function SparklesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z" />
      <path d="m5 16 .9 2.6L8.5 20l-2.6.9L5 23l-.9-2.1L1.5 20l2.6-1.4Z" />
      <path d="m19 1 .8 2.2L22 4l-2.2.8L19 7l-.8-2.2L16 4l2.2-.8Z" />
    </svg>
  );
}

function PlugIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M9 6V2M15 6V2M8 6h8v5a4 4 0 0 1-8 0Z" />
      <path d="M12 15v7" />
    </svg>
  );
}

function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}
