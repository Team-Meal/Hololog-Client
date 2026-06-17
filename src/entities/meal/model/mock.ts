import type { WeeklyMealSchedule } from "./types";

export const MOCK_WEEKLY_SCHEDULES: WeeklyMealSchedule[] = [
  {
    year: 2025,
    month: 6,
    week: 1,
    schoolName: "한빛초등학교",
    districtName: "서울 강서교육지원청",
    nutritionistName: "김서연",
    principalName: "이현수",
    nutritionScore: 94,
    days: [
      {
        dayOfWeek: "월",
        date: "6/2",
        meals: [
          { type: "조식", name: "전복죽", sides: ["누룽지", "우유", "오렌지"] },
          {
            type: "중식",
            name: "백미밥",
            sides: ["소고기무국", "제육볶음", "콩나물무침", "배추김치", "요구르트"],
          },
          {
            type: "석식",
            name: "비빔밥",
            sides: ["콩나물국", "불고기", "도라지무침", "깍두기", "초코푸딩"],
          },
        ],
      },
      {
        dayOfWeek: "화",
        date: "6/3",
        meals: [
          { type: "조식", name: "모닝롤", sides: ["스크램블에그", "사과주스", "요거트"] },
          {
            type: "중식",
            name: "차조밥",
            sides: ["어묵국", "닭갈비", "시금치나물", "깍두기", "사과"],
          },
          {
            type: "석식",
            name: "잡곡밥",
            sides: ["손두부찌개", "돈카스", "양배추샐러드", "배추김치", "오렌지"],
          },
        ],
      },
      {
        dayOfWeek: "수",
        date: "6/4",
        meals: [
          { type: "조식", name: "야채죽", sides: ["미니김밥", "우유", "바나나"] },
          {
            type: "중식",
            name: "카레라이스",
            sides: ["미소된장국", "동그랑땡", "오이무침", "배추김치", "바나나"],
          },
          {
            type: "석식",
            name: "김치볶음밥",
            sides: ["만둣국", "탕수육", "브로콜리무침", "단무지", "요구르트"],
          },
        ],
      },
      {
        dayOfWeek: "목",
        date: "6/5",
        meals: [
          { type: "조식", name: "프렌치토스트", sides: ["감자스프", "우유", "방울토마토"] },
          {
            type: "중식",
            name: "흑미밥",
            sides: ["떡국", "고등어구이", "멸치볶음", "배추김치", "식혜"],
          },
          {
            type: "석식",
            name: "기장밥",
            sides: ["북엇국", "삼치구이", "감자조림", "배추김치", "방울토마토"],
          },
        ],
      },
      {
        dayOfWeek: "금",
        date: "6/6",
        meals: [
          { type: "조식", name: "호박죽", sides: ["계란찜", "우유", "귤"] },
          {
            type: "중식",
            name: "짜장밥",
            sides: ["계란국", "군만두", "단무지", "배추김치", "귤"],
          },
          {
            type: "석식",
            name: "보리밥",
            sides: ["재첩국", "닭볶음탕", "콩자반", "깍두기", "수박"],
          },
        ],
      },
    ],
  },
  {
    year: 2025,
    month: 6,
    week: 2,
    schoolName: "한빛초등학교",
    districtName: "서울 강서교육지원청",
    nutritionistName: "김서연",
    principalName: "이현수",
    nutritionScore: 88,
    days: [
      {
        dayOfWeek: "월",
        date: "6/9",
        meals: [
          { type: "조식", name: "오트밀", sides: ["삶은달걀", "우유", "딸기"] },
          {
            type: "중식",
            name: "현미밥",
            sides: ["된장찌개", "불고기", "시금치무침", "배추김치", "요구르트"],
          },
          {
            type: "석식",
            name: "콩나물밥",
            sides: ["미역국", "제육볶음", "깻잎무침", "깍두기", "사과"],
          },
        ],
      },
      {
        dayOfWeek: "화",
        date: "6/10",
        meals: [
          { type: "조식", name: "크로아상", sides: ["치즈", "오렌지주스", "요거트"] },
          {
            type: "중식",
            name: "볶음밥",
            sides: ["계란국", "왕만두", "오이무침", "배추김치", "바나나"],
          },
          {
            type: "석식",
            name: "잡곡밥",
            sides: ["육개장", "돼지불백", "콩나물무침", "깍두기", "포도"],
          },
        ],
      },
      {
        dayOfWeek: "수",
        date: "6/11",
        meals: [
          { type: "조식", name: "토스트", sides: ["딸기잼", "우유", "키위"] },
          {
            type: "중식",
            name: "쌀밥",
            sides: ["순두부찌개", "갈비찜", "도라지무침", "배추김치", "식혜"],
          },
          {
            type: "석식",
            name: "비빔밥",
            sides: ["콩나물국", "제육볶음", "시금치나물", "배추김치", "귤"],
          },
        ],
      },
      {
        dayOfWeek: "목",
        date: "6/12",
        meals: [
          { type: "조식", name: "팬케이크", sides: ["메이플시럽", "우유", "블루베리"] },
          {
            type: "중식",
            name: "오므라이스",
            sides: ["양파수프", "치킨까스", "코울슬로", "단무지", "요구르트"],
          },
          {
            type: "석식",
            name: "흑미밥",
            sides: ["북엇국", "고등어구이", "멸치볶음", "깍두기", "방울토마토"],
          },
        ],
      },
      {
        dayOfWeek: "금",
        date: "6/13",
        meals: [
          { type: "조식", name: "죽", sides: ["누룽지", "우유", "오렌지"] },
          {
            type: "중식",
            name: "카레라이스",
            sides: ["미소된장국", "탕수육", "브로콜리무침", "배추김치", "수박"],
          },
          {
            type: "석식",
            name: "보리밥",
            sides: ["콩나물국", "닭볶음탕", "감자조림", "단무지", "포도"],
          },
        ],
      },
    ],
  },
  {
    year: 2025,
    month: 6,
    week: 3,
    schoolName: "한빛초등학교",
    districtName: "서울 강서교육지원청",
    nutritionistName: "김서연",
    principalName: "이현수",
    nutritionScore: 91,
    days: [
      {
        dayOfWeek: "월",
        date: "6/16",
        meals: [
          { type: "조식", name: "바나나팬케이크", sides: ["꿀", "우유", "딸기"] },
          {
            type: "중식",
            name: "쌀밥",
            sides: ["김치찌개", "삼겹살구이", "숙주나물", "배추김치", "요구르트"],
          },
          {
            type: "석식",
            name: "차조밥",
            sides: ["미역국", "제육볶음", "깻잎무침", "깍두기", "사과"],
          },
        ],
      },
      {
        dayOfWeek: "화",
        date: "6/17",
        meals: [
          { type: "조식", name: "식빵토스트", sides: ["버터", "오렌지주스", "삶은달걀"] },
          {
            type: "중식",
            name: "볶음밥",
            sides: ["순두부찌개", "돈까스", "오이소박이", "배추김치", "바나나"],
          },
          {
            type: "석식",
            name: "현미밥",
            sides: ["된장찌개", "불고기", "시금치나물", "깍두기", "귤"],
          },
        ],
      },
      {
        dayOfWeek: "수",
        date: "6/18",
        meals: [
          { type: "조식", name: "오트밀죽", sides: ["건과일", "우유", "키위"] },
          {
            type: "중식",
            name: "비빔밥",
            sides: ["콩나물국", "제육볶음", "당근무침", "배추김치", "식혜"],
          },
          {
            type: "석식",
            name: "잡곡밥",
            sides: ["북엇국", "갈치조림", "콩나물무침", "깍두기", "수박"],
          },
        ],
      },
      {
        dayOfWeek: "목",
        date: "6/19",
        meals: [
          { type: "조식", name: "와플", sides: ["메이플시럽", "우유", "블루베리"] },
          {
            type: "중식",
            name: "짜장밥",
            sides: ["계란국", "군만두", "단무지", "배추김치", "요구르트"],
          },
          {
            type: "석식",
            name: "흑미밥",
            sides: ["육개장", "삼치구이", "멸치볶음", "배추김치", "포도"],
          },
        ],
      },
      {
        dayOfWeek: "금",
        date: "6/20",
        meals: [
          { type: "조식", name: "호박죽", sides: ["계란찜", "우유", "귤"] },
          {
            type: "중식",
            name: "카레라이스",
            sides: ["미소된장국", "치킨까스", "브로콜리무침", "배추김치", "사과"],
          },
          {
            type: "석식",
            name: "보리밥",
            sides: ["재첩국", "고등어구이", "시금치나물", "단무지", "복숭아"],
          },
        ],
      },
    ],
  },
  {
    year: 2025,
    month: 6,
    week: 4,
    schoolName: "한빛초등학교",
    districtName: "서울 강서교육지원청",
    nutritionistName: "김서연",
    principalName: "이현수",
    nutritionScore: 96,
    days: [
      {
        dayOfWeek: "월",
        date: "6/23",
        meals: [
          { type: "조식", name: "크로아상", sides: ["치즈", "우유", "딸기잼"] },
          {
            type: "중식",
            name: "현미밥",
            sides: ["된장찌개", "삼겹살", "깻잎무침", "배추김치", "요구르트"],
          },
          {
            type: "석식",
            name: "콩나물밥",
            sides: ["미역국", "불고기", "시금치나물", "깍두기", "수박"],
          },
        ],
      },
      {
        dayOfWeek: "화",
        date: "6/24",
        meals: [
          { type: "조식", name: "토마토에그", sides: ["식빵", "오렌지주스", "요거트"] },
          {
            type: "중식",
            name: "쌀밥",
            sides: ["순두부찌개", "닭갈비", "오이무침", "배추김치", "바나나"],
          },
          {
            type: "석식",
            name: "잡곡밥",
            sides: ["육개장", "제육볶음", "콩나물무침", "단무지", "복숭아"],
          },
        ],
      },
      {
        dayOfWeek: "수",
        date: "6/25",
        meals: [
          { type: "조식", name: "야채죽", sides: ["미니김밥", "우유", "키위"] },
          {
            type: "중식",
            name: "비빔밥",
            sides: ["콩나물국", "갈비찜", "도라지무침", "배추김치", "식혜"],
          },
          {
            type: "석식",
            name: "흑미밥",
            sides: ["북엇국", "고등어구이", "멸치볶음", "깍두기", "귤"],
          },
        ],
      },
      {
        dayOfWeek: "목",
        date: "6/26",
        meals: [
          { type: "조식", name: "팬케이크", sides: ["메이플시럽", "우유", "블루베리"] },
          {
            type: "중식",
            name: "볶음밥",
            sides: ["계란국", "탕수육", "브로콜리무침", "배추김치", "요구르트"],
          },
          {
            type: "석식",
            name: "보리밥",
            sides: ["재첩국", "닭볶음탕", "감자조림", "배추김치", "사과"],
          },
        ],
      },
      {
        dayOfWeek: "금",
        date: "6/27",
        meals: [
          { type: "조식", name: "전복죽", sides: ["누룽지", "우유", "오렌지"] },
          {
            type: "중식",
            name: "카레라이스",
            sides: ["미소된장국", "왕만두", "오이소박이", "배추김치", "포도"],
          },
          {
            type: "석식",
            name: "차조밥",
            sides: ["된장찌개", "삼치구이", "시금치나물", "단무지", "수박"],
          },
        ],
      },
    ],
  },
];

export const MOCK_MEAL_SCHEDULE = MOCK_WEEKLY_SCHEDULES[1];
