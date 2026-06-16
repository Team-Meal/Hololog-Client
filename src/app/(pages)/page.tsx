import { redirect } from "next/navigation";

// 메인은 대시보드로 이동시킨다.
export default function Home() {
  redirect("/dashboard");
}
