import type { WeeklyMealSchedule } from "./types";

export const MOCK_MEAL_SCHEDULE: WeeklyMealSchedule = {
  year: 2025,
  month: 6,
  week: 2,
  schoolName: "한빛초등학교",
  districtName: "서울 강서교육지원청",
  nutritionistName: "김서연",
  principalName: "이현수",
  days: [
    {
      dayOfWeek: "월",
      date: "6/8",
      items: ["백미밥", "소고기무국", "제육볶음", "콩나물무침", "배추김치", "요구르트"],
    },
    {
      dayOfWeek: "화",
      date: "6/9",
      items: ["차조밥", "어묵국", "닭갈비", "시금치나물", "깍두기", "사과"],
    },
    {
      dayOfWeek: "수",
      date: "6/10",
      items: ["카레라이스", "미소된장국", "동그랑땡", "오이무침", "배추김치", "바나나"],
    },
    {
      dayOfWeek: "목",
      date: "6/11",
      items: ["흑미밥", "떡국", "고등어구이", "멸치볶음", "배추김치", "식혜"],
    },
    {
      dayOfWeek: "금",
      date: "6/12",
      items: ["짜장밥", "계란국", "군만두", "단무지", "배추김치", "귤"],
    },
  ],
};
