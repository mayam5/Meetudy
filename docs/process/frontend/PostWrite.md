# PostWrite

게시글 작성 페이지 구현 (`PostWrite.jsx`, `PostWrite.css`)

<br><br>

## 1. 게시글 작성 기능

### 0. 필수 입력 항목 - 카테고리, 제목, 모임 설명, 모임 최대 인원

### * 1. 카테고리
- 등록된 카테고리 중 한 개만 선택 가능
- 선택한 카테고리: button className="category-button selected"
- 선택되지 않은 카테고리: button className="category-button">

### * 2. 제목
- 텍스트 입력
- 최대 50자 제한

### * 3. 모임 설명
- 텍스트 입력
- 최대 500자 제한

### * 4. 모임 최대 인원
- Dropdown 선택 방식

### 5. 해시태그
- 텍스트 입력 후 버튼 생성
- 중복 불가
- 최대 3개 가능
- 삭제 가능

### 6. 모임 시간
- 요일 + 시간대 선택 가능 -> 버튼 생성
- 중복 불가
- 최대 3개 가능
- 삭제 가능

### 7. 모임 장소
- 텍스트 입력 기반 자동 검색
- Map API 연동 필요
- 한 개만 선택 가능

### 8. 장소 예약 비용
- 텍스트 입력
- 숫자만 입력 가능
- 최대 50자 제한

<br><br>

## 2. 하단 버튼 기능

### 처음 작성 시
- 임시 저장
- 올리기

### 수정 모드 시
- 삭제하기
- 상태 변경하기
- 수정하기

#### 상태 변경 옵션
- 모집 중
- 모집 완료
- 모집 일시 중단

<br><br>

## 3. State 설명

## isEditMode

```jsx
const [isEditMode, setIsEditMode] = useState(true);
```

- 게시글 작성 / 수정 상태 구분용 state
- `true`: 수정 모드
- `false`: 처음 작성 모드
- 추후 URL의 `postId` 존재 여부로 판단 예정

## isStatusPopupOpen

```jsx
const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false);
```
- 상태 변경 popup UI 표시 여부 제어
- 프론트 UI 전용 state
- 백엔드 전송 X

## postStatus

```jsx
const [postStatus, setPostStatus] = useState("");
```
- 실제 게시글 모집 상태 데이터
- 백엔드 전송 O
- DB 저장 가능

<br><br>

# Backend

## POST 요청 데이터 구조

```js
{
  category,
  title,
  description,
  maxMembers: Number(number),
  hashtags,
  meetingTimes,
  place: selectedPlace,
  cost: cost === "" ? 0 : Number(cost),
  status: postStatus
}
```


## TODO

- 카카오맵 API 연결 후 `dummyPlaces` 제거
- 게시글 수정 시 기존 데이터 fetch 필요
- 프론트 validation과 백엔드 validation 동일하게 유지


# Validation 규칙

1. 필수값 검증
   - category
   - title
   - description
   - number

2. 해시태그 / 모임 시간
   - 최대 3개 제한
   - 프론트 + 백엔드 모두 검증

3. 비용(cost)
   - 문자열이 아닌 Number로 변환 후 전송

4. 장소(selectedPlace)
   - 향후 아래 정보까지 받을 구조로 확장 예정
     - placeName
     - address
     - latitude
     - longitude

5. dummyPlaces
   - 카카오맵 API 연동 시 제거 필요