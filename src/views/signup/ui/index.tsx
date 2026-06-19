import { AuthLayout, SignupForm } from "@/features/auth";

export function SignupPage() {
  return (
    <AuthLayout
      title="회원가입"
      description="계정 유형을 선택하고 정보를 입력해 주세요."
      headline={
        <>
          지금 시작하고
          <br />
          급식 관리를 혁신하세요
        </>
      }
      footerText="이미 계정이 있으신가요?"
      footerHref="/login"
      footerLink="로그인"
    >
      <SignupForm />
    </AuthLayout>
  );
}
