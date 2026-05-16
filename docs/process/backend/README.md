# Meetudy 백엔드

스터디 그룹 매칭 및 오프라인 스터디 공간 예약 플랫폼 **Meetudy**의 백엔드 서버입니다.

---

## 프로젝트 소개

Meetudy는 스터디 모집, 멤버 매칭, 오프라인 스터디 공간 예약 기능을 제공하는 서비스입니다.

- 스터디 모집 게시글 작성 및 참여 신청
- 관심사·지역·시간대 기반 스터디 매칭
- 오프라인 스터디 공간 지도 검색 (KakaoMap API)
- 스터디 그룹 전용 채팅
- 학습 통계 기록 및 조회

---

## 기술 스택

| 분류 | 기술 |
|---|---|
| Language | Java 21 |
| Framework | Spring Boot 3.5 |
| ORM | Spring Data JPA / Hibernate |
| Security | Spring Security + JWT |
| Database | MySQL 8.x |
| Build | Gradle |
| API 문서 | Thunder Client (VS Code) |
| 지도 | KakaoMap API |
| 프론트엔드 | React |
| 실시간 채팅 | WebSocket / STOMP |

---

## 로컬 실행 방법

### 사전 준비

- Java 21 이상
- MySQL 8.x (로컬 설치)
- MySQL Workbench

### 1단계 — DB 생성

MySQL Workbench에서 `meetudy_workbench.sql` 파일을 열고 전체 실행합니다.

```
Ctrl + A (전체 선택) → Ctrl + Shift + Enter (실행)
```

### 2단계 — 환경 설정

`src/main/resources/application.properties` 파일에서 DB 접속 정보를 확인합니다.

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/meetudy
spring.datasource.username=root
spring.datasource.password={각자의 비밀번호} - 나중에 서버에 올려서 공용 DB만들거에요

jwt.secret=meetudy-jwt-secret-key-must-be-at-least-256bits-long!!
jwt.expiration-ms=86400000
```

### 3단계 — 실행

```bash
./gradlew bootRun
```

실행 후 `http://localhost:8080` 으로 접근합니다.

---

## 개발 순서 (기능 단위 반복)

기능 하나를 추가할 때마다 아래 순서를 반복합니다.

```
1. DB 설계      Workbench에서 테이블 구조 확정
      ↓
2. Entity       DB 테이블을 Java 클래스로 표현 (@Entity)
      ↓
3. Repository   DB 접근 인터페이스 선언 (JpaRepository)
      ↓
4. Service      비즈니스 로직 작성 (Repository 호출)
      ↓
5. Controller   API 엔드포인트 정의 (HTTP 요청 수신)
      ↓
6. 테스트       Thunder Client로 API 호출 → Workbench로 DB 확인
```

### Entity란?

DB 테이블을 Java 클래스로 표현한 것입니다. JPA가 Entity를 읽고 SQL을 자동 생성합니다.

```java
// Java 코드
userRepository.save(user);

// JPA가 자동으로 변환
INSERT INTO Users (email, nickname, ...) VALUES (?, ?, ...);
```

---

## 프로젝트 구조

```
src/main/java/meetudy/demo/
├── common/
│   └── ApiResponse.java                  # 공통 응답 포맷
├── config/
│   ├── SecurityConfig.java               # Spring Security 설정
│   └── WebSocketConfig.java              # STOMP WebSocket 설정
├── controller/
│   ├── AuthController.java
│   ├── UserController.java
│   ├── CategoryController.java
│   ├── UserInterestController.java
│   ├── PostController.java
│   ├── ApplicationController.java
│   ├── ChatController.java
│   └── BlockController.java
├── service/
│   ├── AuthService.java
│   ├── UserService.java
│   ├── CategoryService.java
│   ├── UserInterestService.java
│   ├── PostService.java
│   ├── ApplicationService.java
│   ├── ChatService.java
│   └── BlockService.java
├── repository/
│   ├── UserRepository.java
│   ├── CategoryRepository.java
│   ├── UserInterestRepository.java
│   ├── PostRepository.java
│   ├── PlaceRepository.java
│   ├── StudyApplicationRepository.java
│   ├── StudyGroupRepository.java
│   ├── StudyGroupMemberRepository.java
│   ├── ChatRoomRepository.java
│   ├── ChatRoomMemberRepository.java
│   ├── ChatRoomMessageRepository.java
│   └── UserBlockRepository.java
├── entity/                               # JPA 엔티티 19개
├── dto/
│   ├── request/
│   └── response/
├── security/
│   ├── JwtProvider.java
│   ├── JwtFilter.java
│   └── CustomUserDetailsService.java
├── websocket/
│   └── ChatMessageHandler.java           # 실시간 메시지 송수신 (STOMP)
└── exception/
    ├── ErrorCode.java
    ├── CustomException.java
    └── GlobalExceptionHandler.java
```

---

## DB 스키마 (v1.2.0)

총 20개 테이블로 구성됩니다.

| 도메인 | 테이블 |
|---|---|
| 회원/소셜 | Users, Regions, User_Interests, UserBlocks, Study_Logs |
| 스케줄 | Time_Slots, User_Schedules |
| 모집/커뮤니티 | Categories, Posts, Hashtags, PostHashtags, PostBookmarks, Study_Applications |
| 스터디 운영 | Study_Groups, Study_Group_Members |
| 채팅 | Chat_Rooms, Chat_Room_Members, Chat_Room_Messages |
| 장소 | Places |
| 인증 | User_Refresh_Tokens (추가 예정) |

---

## 구현된 API

### 인증 (AUTH)

| 메서드 | URL | 설명 | 인증 필요 |
|---|---|---|---|
| POST | `/auth/register` | 회원가입 | X |
| POST | `/auth/login` | 로그인 (Access + Refresh Token 발급) | X |
| POST | `/auth/refresh` | Access Token 재발급 (Refresh Token Rotation) | X |
| POST | `/auth/logout` | 로그아웃 (Refresh Token 전체 폐기) | O |

**토큰 발급 흐름**
```
POST /auth/login
  └─ 응답: accessToken (유효기간 1시간) + refreshToken (유효기간 14일)
         refreshToken은 SHA-256 해시 후 Refresh_Tokens 테이블에 저장

accessToken 만료 시
  └─ POST /auth/refresh { "refreshToken": "..." }
       └─ 기존 refreshToken 즉시 폐기 (Rotation)
       └─ 새 accessToken + 새 refreshToken 발급

refreshToken도 만료 시
  └─ 401 응답 → 클라이언트에서 로그인 페이지로 이동
```

### 유저 (USER)

| 메서드 | URL | 설명 | 인증 필요 |
|---|---|---|---|
| GET | `/users/me` | 내 프로필 조회 | O |
| PATCH | `/users/me` | 프로필 수정 (비밀번호 변경 포함) | O |
| PATCH | `/users/me/image` | 프로필 이미지 수정 | O |
| DELETE | `/users/me` | 회원 탈퇴 | O |

### 카테고리 (CAT)

| 메서드 | URL | 설명 | 인증 필요 |
|---|---|---|---|
| GET | `/categories` | 전체 카테고리 조회 | X |

### 관심사 (INT)

| 메서드 | URL | 설명 | 인증 필요 |
|---|---|---|---|
| GET | `/users/me/interests` | 내 관심사 목록 조회 | O |
| POST | `/users/me/interests` | 관심사 추가 | O |
| DELETE | `/users/me/interests/{categoryId}` | 관심사 삭제 | O |

### 게시글 (POST)

| 메서드 | URL | 설명 | 인증 필요 |
|---|---|---|---|
| GET | `/posts` | OPEN 게시글 목록 조회 | X |
| GET | `/posts?keyword={keyword}` | 키워드 검색 | X |
| GET | `/posts?categoryId={id}` | 카테고리별 조회 | X |
| GET | `/posts/{postId}` | 게시글 단건 조회 | X |
| GET | `/posts/me` | 내 게시글 목록 | O |
| POST | `/posts` | 게시글 작성 | O |
| PATCH | `/posts/{postId}` | 게시글 수정 | O |
| PATCH | `/posts/{postId}/close` | 모집 마감 | O |
| DELETE | `/posts/{postId}` | 게시글 삭제 | O |

**게시글 작성 시 자동 생성 (트랜잭션 내)**
```
POST /posts
  ├─ Posts 저장
  ├─ Study_Groups 생성 (groupName = postTitle)
  ├─ Study_Group_Members 추가 (작성자, role = HOST)
  ├─ Chat_Rooms 생성
  └─ Chat_Room_Members 추가 (작성자)
```

### 스터디 신청 (APP)

| 메서드 | URL | 설명 | 인증 필요 |
|---|---|---|---|
| POST | `/applications` | 스터디 신청 | O |
| DELETE | `/applications/{applicationId}` | 신청 취소 (PENDING만) | O |
| GET | `/applications/me` | 내 신청 목록 | O |
| GET | `/posts/{postId}/applications` | 게시글 신청 목록 (작성자만) | O |
| PATCH | `/applications/{applicationId}/accept` | 신청 수락 | O |
| PATCH | `/applications/{applicationId}/reject` | 신청 거절 | O |

**신청 수락 시 자동 처리 (트랜잭션 내)**
```
PATCH /applications/{id}/accept
  ├─ StudyApplication.status → ACCEPTED
  ├─ Post.currentMembers++
  ├─ currentMembers >= maxMembers → Post.status → CLOSED
  ├─ Study_Group_Members 추가 (신청자, role = MEMBER)
  └─ Chat_Room_Members 추가 (신청자)
```

### 채팅 (CHAT)

| 메서드 | URL | 설명 | 인증 필요 |
|---|---|---|---|
| GET | `/chats/{roomId}` | 채팅방 정보 조회 | O |
| GET | `/chats/{roomId}/messages` | 메시지 목록 조회 (페이징) | O |
| PATCH | `/chats/{roomId}/read` | 읽음 처리 | O |

**WebSocket 실시간 채팅**
```
연결:   ws://localhost:8080/ws
구독:   /topic/chat.{roomId}
전송:   /app/chat.send
헤더:   Authorization: Bearer {token}
```

### 차단 (BLK)

| 메서드 | URL | 설명 | 인증 필요 |
|---|---|---|---|
| POST | `/users/block/{targetId}` | 유저 차단 | O |
| DELETE | `/users/block/{targetId}` | 차단 해제 | O |
| GET | `/users/block` | 차단 목록 조회 | O |

---

### 스케줄 (SCH)

| 메서드 | URL | 설명 | 인증 필요 |
|---|---|---|---|
| GET | `/schedules/me` | 내 스케줄 목록 조회 | O |
| POST | `/schedules` | 스케줄 단건 추가 | O |
| PUT | `/schedules` | 스케줄 전체 교체 (Bulk Replace) | O |
| PATCH | `/schedules/{scheduleId}` | 스케줄 단건 수정 | O |
| DELETE | `/schedules/{scheduleId}` | 스케줄 단건 삭제 | O |

**스케줄 전체 교체 요청 형식**
```
PUT /schedules
  → 현재 체크된 전체 셀 목록을 한 번에 전송
  → 기존 스케줄 전부 삭제 후 새로 저장 (트랜잭션 내 flush 처리)
```

```json
{
  "schedules": [
    { "dayOfWeek": "MON", "timeSlotId": 1 },
    { "dayOfWeek": "MON", "timeSlotId": 2 },
    { "dayOfWeek": "WED", "timeSlotId": 3 }
  ]
}
```

**dayOfWeek 허용값:** `MON` `TUE` `WED` `THU` `FRI` `SAT` `SUN`


---

### 북마크 (BM)

| 메서드 | URL | 설명 | 인증 필요 |
|---|---|---|---|
| POST | `/posts/{postId}/bookmark` | 북마크 추가 | O |
| DELETE | `/posts/{postId}/bookmark` | 북마크 취소 | O |
| GET | `/posts/bookmarks` | 내 북마크 목록 (최신순) | O |

---

### 학습 로그 (LOG)

| 메서드 | URL | 설명 | 인증 필요 |
|---|---|---|---|
| POST | `/study-logs` | 학습 로그 기록 | O |
| GET | `/study-logs/me` | 내 학습 로그 목록 (날짜 최신순) | O |
| DELETE | `/study-logs/{studyLogId}` | 학습 로그 삭제 (본인만) | O |

---

## 에러 코드

| 코드 | HTTP | 메시지 |
|---|---|---|
| EMAIL_ALREADY_EXISTS | 409 | 이미 사용 중인 이메일입니다 |
| NICKNAME_ALREADY_EXISTS | 409 | 이미 사용 중인 닉네임입니다 |
| INVALID_CREDENTIALS | 401 | 이메일 또는 비밀번호가 올바르지 않습니다 |
| INVALID_REFRESH_TOKEN | 401 | 유효하지 않은 Refresh Token입니다 |
| USER_NOT_FOUND | 404 | 존재하지 않는 사용자입니다 |
| POST_NOT_FOUND | 404 | 존재하지 않는 게시글입니다 |
| POST_NOT_AUTHOR | 403 | 게시글 작성자만 수행할 수 있습니다 |
| POST_ALREADY_CLOSED | 400 | 이미 마감된 게시글입니다 |
| ALREADY_APPLIED | 409 | 이미 신청한 게시글입니다 |
| APPLICATION_NOT_FOUND | 404 | 존재하지 않는 신청입니다 |
| SELF_APPLICATION_NOT_ALLOWED | 400 | 본인 게시글에는 신청할 수 없습니다 |
| APPLICATION_CANCEL_NOT_ALLOWED | 400 | 대기 중인 신청만 취소할 수 있습니다 |
| CATEGORY_NOT_FOUND | 404 | 존재하지 않는 카테고리입니다 |
| INTEREST_ALREADY_EXISTS | 409 | 이미 추가된 관심사입니다 |
| INTEREST_NOT_FOUND | 404 | 존재하지 않는 관심사입니다 |
| CHAT_ROOM_NOT_FOUND | 404 | 존재하지 않는 채팅방입니다 |
| SELF_BLOCK_NOT_ALLOWED | 400 | 자기 자신을 차단할 수 없습니다 |
| ALREADY_BLOCKED | 409 | 이미 차단한 유저입니다 |
| BLOCK_NOT_FOUND | 404 | 차단 내역이 존재하지 않습니다 |
| BOOKMARK_ALREADY_EXISTS | 409 | 이미 북마크한 게시글입니다 |
| BOOKMARK_NOT_FOUND | 404 | 북마크 내역이 존재하지 않습니다 |
| STUDY_LOG_NOT_FOUND | 404 | 존재하지 않는 학습 로그입니다 |
| PLACE_NOT_FOUND | 404 | 존재하지 않는 장소입니다 |
| SCHEDULE_NOT_FOUND | 404 | 존재하지 않는 스케줄입니다 |
| SCHEDULE_ALREADY_EXISTS | 409 | 이미 등록된 스케줄입니다 |
| TIMESLOT_NOT_FOUND | 404 | 존재하지 않는 타임슬롯입니다 |
| FORBIDDEN | 403 | 접근 권한이 없습니다 |

---

### 인증 방식

로그인 후 발급받은 JWT 토큰을 모든 요청 헤더에 포함합니다.

```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

---

## 공통 응답 포맷

모든 API는 동일한 형식으로 응답합니다.

```json
{
  "success": true,
  "message": "OK",
  "data": { ... }
}
```

오류 응답:

```json
{
  "success": false,
  "message": "이미 사용 중인 이메일입니다.",
  "data": null
}
```

---

## 구현 현황

```
✅ AUTH    회원가입, 로그인
✅ USER    프로필 조회/수정/비밀번호 변경/탈퇴
✅ CAT     카테고리 목록
✅ INT     관심사 등록/삭제
✅ POST    스터디 모집 게시글 CRUD (작성/조회/수정/마감/삭제)
✅ BM      북마크
✅ APP     스터디 신청/수락/거절
✅ GRP     스터디 그룹 생성/관리
✅ CHAT    채팅 (WebSocket/STOMP)
✅ BLK     차단
✅ SCH     스케줄 관리
✅ LOG     학습 로그
⬜ PLC     장소 등록/검색 (KakaoMap)
```

---

## 팀 정보

가천대학교 고급 웹 프로그래밍(Advanced Web Programing) 수업 팀 프로젝트
