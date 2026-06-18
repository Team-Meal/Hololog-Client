import { LoginForm } from "@/features/auth";
import { AuthLayout } from "@/features/auth/ui/AuthLayout";

export function LoginPage() {
  return (
    <AuthLayout
      title="로그인"
      description="아이디와 비밀번호를 입력해 주세요."
      headline={
        <>
          급식 관리의
          <br />
          새로운 기준
        </>
      }
      footerText="아직 계정이 없으신가요?"
      footerHref="/signup"
      footerLink="회원가입"
    >
      <LoginForm />
    </AuthLayout>
  );
}
