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

## 폴더 구조

```
src/main/java/meetudy/demo/
├── common/
│   └── ApiResponse.java               공통 응답 포맷
├── controller/
│   ├── AuthController.java            인증 API
│   ├── UserController.java            유저 API
│   ├── CategoryController.java        카테고리 API
│   ├── UserInterestController.java    관심사 API
│   └── PostController.java            게시글 API
├── dto/
│   ├── request/                       요청 DTO
│   └── response/                      응답 DTO
├── entity/                            DB 테이블 매핑 클래스 (20개)
│   ├── User.java
│   ├── Post.java
│   ├── StudyGroup.java
│   └── ...
├── exception/
│   ├── CustomException.java           커스텀 예외
│   ├── ErrorCode.java                 에러 코드 정의
│   └── GlobalExceptionHandler.java    전역 예외 처리
├── repository/
│   ├── UserRepository.java
│   ├── CategoryRepository.java
│   ├── UserInterestRepository.java
│   ├── PostRepository.java
│   └── PlaceRepository.java
├── security/
│   ├── JwtProvider.java               JWT 생성/검증
│   ├── JwtFilter.java                 요청마다 토큰 파싱
│   ├── SecurityConfig.java            Security 설정
│   └── CustomUserDetailsService.java
└── service/
    ├── AuthService.java
    ├── UserService.java
    ├── CategoryService.java
    ├── UserInterestService.java
    └── PostService.java
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
| 인증 | User_Refresh_Tokens |  # 아직 추가 안됨. 추가할 예정

---

## 구현된 API

### 인증 (AUTH)

| 메서드 | URL | 설명 | 인증 필요 |
|---|---|---|---|
| POST | `/auth/register` | 회원가입 | X |
| POST | `/auth/login` | 로그인 (JWT 발급) | X |

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
⬜ BM      북마크
⬜ APP     스터디 신청/수락/거절
⬜ GRP     스터디 그룹 생성/관리
⬜ CHAT    채팅 (WebSocket/STOMP)
⬜ BLK     차단
⬜ SCH     스케줄 관리
⬜ LOG     학습 로그
⬜ PLC     장소 등록/검색 (KakaoMap)
```

---

## 팀 정보

가천대학교 데이터베이스 수업 팀 프로젝트