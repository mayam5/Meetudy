export const ALL_STUDIES = [
    { id: 1, title: "알고리즘 1", host: "민수", field: "개발", users: ["A", "B"] },
    { id: 2, title: "알고리즘 2", host: "철수", field: "개발", users: ["A"] },
    { id: 3, title: "알고리즘 3", host: "영희", field: "개발", users: ["A", "B", "C"] },
    { id: 4, title: "UIUX 1", host: "수빈", field: "디자인", users: ["A"] },
    { id: 5, title: "UIUX 2", host: "지훈", field: "디자인", users: ["A", "B"] },
    { id: 6, title: "토익 1", host: "민지", field: "언어", users: ["A", "B"] },
    { id: 7, title: "토익 2", host: "준호", field: "언어", users: ["A"] },
    { id: 8, title: "자격증 1", host: "철수", field: "자격증", users: ["A", "B", "C"] },
    { id: 9, title: "취업 1", host: "영희", field: "취업", users: ["A"] },
];

export const DUMMY_STUDIES = Array.from({ length: 11 }, (_, i) => ({
    id: i + 1,
    title: `스터디 ${i + 1}`,
    host: "닉네임",
    hostId: 1,
    tags: ["IT", "개발"],
    users: ["A", "B", "C"],
    field: "개발",
    applicationStatus: i === 1 ? "accepted" : i === 2 ? "rejected" : "pending",
}));

export const DUMMY_ROOMS = [
    {
        id: 1,
        title: "React 초보 스터디",
        lastMessage: "오늘 과제 어디까지인가요?",
        time: "2m",
        unread: 2,
    },
    {
        id: 2,
        title: "알고리즘 1일 1문제",
        lastMessage: "방금 깃허브에 인증했습니다!",
        time: "10m",
        unread: 0,
    },
    {
        id: 3,
        title: "토익 스피킹 메이트",
        lastMessage: "녹음본 확인 부탁드려요.",
        time: "1h",
        unread: 1,
    },
];

export const DUMMY_NOTIFICATIONS = [
    {
        id: 1,
        type: "accepted",
        message: "React 초보 스터디 참여가 수락되었습니다.",
        time: "2m",
        read: false,
    },
    {
        id: 2,
        type: "rejected",
        message: "알고리즘 스터디 참여가 거절되었습니다.",
        time: "10m",
        read: false,
    },
    {
        id: 3,
        type: "apply",
        message: "누군가 내 스터디에 참여를 신청했습니다.",
        time: "1h",
        read: true,
    },
    {
        id: 4,
        type: "chat",
        message: "토익 스피킹 메이트에 새 메시지가 있습니다.",
        time: "2h",
        read: true,
    },
];

export const BOOKMARK_DATA = [
    { id: 1, title: "React 스터디", host: "김예빈", field: "개발" },
    { id: 2, title: "토익 스터디", host: "홍길동", field: "외국어" },
    { id: 3, title: "알고리즘 스터디", host: "철수", field: "개발" },
];

export const MEETING_DATA = {
    "참여 중인 모임": [
        { id: 1, title: "React 스터디", host: "김예빈", field: "개발", users: ["A", "B", "C"] },
        { id: 2, title: "토익 스터디", host: "홍길동", field: "외국어", users: ["A", "B"] },
    ],
    "참여 승인 대기": [
        { id: 3, title: "SQL 자격증", host: "관리자", field: "자격증", users: ["A", "B", "C", "D"] },
    ],
    "신청한 모임": [
        { id: 4, title: "알고리즘 스터디", host: "철수", field: "개발", users: ["A"] },
    ],
    "작성한 모임": [
        { id: 5, title: "UIUX 스터디", host: "나", field: "디자인", users: ["A", "B", "C"] },
    ],
};