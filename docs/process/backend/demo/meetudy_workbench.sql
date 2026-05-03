-- =============================================================
--  Meetudy Database Schema v1.1.2
--  사용법: Workbench에서 전체 선택(Ctrl+A) 후 실행(Ctrl+Shift+Enter)
-- =============================================================

CREATE DATABASE IF NOT EXISTS meetudy
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE meetudy;

SET FOREIGN_KEY_CHECKS = 0;

-- ─────────────────────────────────────────────
-- STEP 1. 기존 테이블 전부 삭제
-- ─────────────────────────────────────────────
DROP TABLE IF EXISTS Reservations;
DROP TABLE IF EXISTS Chat_Room_Messages;
DROP TABLE IF EXISTS Chat_Room_Members;
DROP TABLE IF EXISTS Chat_Rooms;
DROP TABLE IF EXISTS Study_Group_Members;
DROP TABLE IF EXISTS Study_Groups;
DROP TABLE IF EXISTS Study_Applications;
DROP TABLE IF EXISTS PostBookmarks;
DROP TABLE IF EXISTS PostBookmark;
DROP TABLE IF EXISTS PostHashtags;
DROP TABLE IF EXISTS Posts;
DROP TABLE IF EXISTS User_Schedules;
DROP TABLE IF EXISTS Study_Logs;
DROP TABLE IF EXISTS UserBlocks;
DROP TABLE IF EXISTS UserBlock;
DROP TABLE IF EXISTS User_Interests;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Hashtags;
DROP TABLE IF EXISTS Hashtag;
DROP TABLE IF EXISTS Places;
DROP TABLE IF EXISTS Time_Slots;
DROP TABLE IF EXISTS Categories;
DROP TABLE IF EXISTS Regions;

-- ─────────────────────────────────────────────
-- STEP 2. 테이블 생성
-- ─────────────────────────────────────────────

-- 1. 독립 테이블 --------------------------------

CREATE TABLE Regions (
    region_id   BIGINT      NOT NULL AUTO_INCREMENT,
    city_name   VARCHAR(50) NOT NULL COMMENT '시/도',
    gu_name     VARCHAR(50) NOT NULL COMMENT '구/군',
    dong_name   VARCHAR(50) NOT NULL COMMENT '동/읍/면',
    PRIMARY KEY (region_id),
    UNIQUE KEY uq_region (city_name, gu_name, dong_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Categories (
    category_id     BIGINT       NOT NULL AUTO_INCREMENT,
    category_name   VARCHAR(100) NOT NULL,
    PRIMARY KEY (category_id),
    UNIQUE KEY uq_category_name (category_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Time_Slots (
    time_slot_id    BIGINT      NOT NULL AUTO_INCREMENT,
    slot_name       VARCHAR(50) NOT NULL,
    start_time      TIME        NOT NULL,
    end_time        TIME        NOT NULL,
    PRIMARY KEY (time_slot_id),
    UNIQUE KEY uq_slot_name (slot_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ★ Places: region_id, latitude, longitude 추가
CREATE TABLE Places (
    place_id    BIGINT          NOT NULL AUTO_INCREMENT,
    region_id   BIGINT          NULL,
    name        VARCHAR(200)    NOT NULL,
    address     VARCHAR(500)    NOT NULL,
    latitude    DECIMAL(10, 8)  NULL COMMENT '위도 (-90~90)',
    longitude   DECIMAL(11, 8)  NULL COMMENT '경도 (-180~180)',
    PRIMARY KEY (place_id),
    CONSTRAINT fk_places_region
        FOREIGN KEY (region_id) REFERENCES Regions (region_id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ★ Hashtags (테이블명 복수형으로 변경)
CREATE TABLE Hashtags (
    hashtag_id      BIGINT       NOT NULL AUTO_INCREMENT,
    hashtag_name    VARCHAR(100) NOT NULL,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (hashtag_id),
    UNIQUE KEY uq_hashtag_name (hashtag_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Users -------------------------------------

CREATE TABLE Users (
    user_id             BIGINT       NOT NULL AUTO_INCREMENT,
    email               VARCHAR(255) NOT NULL,
    password            VARCHAR(255) NOT NULL,
    nickname            VARCHAR(50)  NOT NULL,
    profile_image       VARCHAR(500) NULL,
    birth_date          DATE         NULL,
    is_age_public       BOOLEAN      NOT NULL DEFAULT TRUE,
    gender              VARCHAR(10)  NULL,
    bio                 TEXT         NULL,
    preferred_region_id BIGINT       NULL,
    created_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at          TIMESTAMP    NULL,
    PRIMARY KEY (user_id),
    UNIQUE KEY uq_email    (email),
    UNIQUE KEY uq_nickname (nickname),
    CONSTRAINT fk_users_region
        FOREIGN KEY (preferred_region_id) REFERENCES Regions (region_id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Users 종속 테이블 --------------------------

CREATE TABLE User_Interests (
    user_interest_id    BIGINT NOT NULL AUTO_INCREMENT,
    user_id             BIGINT NOT NULL,
    category_id         BIGINT NOT NULL,
    PRIMARY KEY (user_interest_id),
    UNIQUE KEY uq_user_category (user_id, category_id),
    CONSTRAINT fk_ui_user     FOREIGN KEY (user_id)     REFERENCES Users      (user_id)     ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ui_category FOREIGN KEY (category_id) REFERENCES Categories (category_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ★ UserBlocks (테이블명 복수형으로 변경)
CREATE TABLE UserBlocks (
    block_id    BIGINT    NOT NULL AUTO_INCREMENT,
    blocker_id  BIGINT    NOT NULL,
    blocked_id  BIGINT    NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (block_id),
    UNIQUE KEY uq_block (blocker_id, blocked_id),
    CONSTRAINT fk_block_blocker FOREIGN KEY (blocker_id) REFERENCES Users (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_block_blocked FOREIGN KEY (blocked_id) REFERENCES Users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Study_Logs (
    study_log_id        BIGINT NOT NULL AUTO_INCREMENT,
    user_id             BIGINT NOT NULL,
    study_date          DATE   NOT NULL,
    duration_minutes    INT    NOT NULL,
    PRIMARY KEY (study_log_id),
    CONSTRAINT fk_log_user FOREIGN KEY (user_id) REFERENCES Users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE User_Schedules (
    user_schedule_id    BIGINT      NOT NULL AUTO_INCREMENT,
    user_id             BIGINT      NOT NULL,
    day_of_week         VARCHAR(10) NOT NULL,
    time_slot_id        BIGINT      NOT NULL,
    PRIMARY KEY (user_schedule_id),
    UNIQUE KEY uq_schedule (user_id, day_of_week, time_slot_id),
    CONSTRAINT fk_sch_user FOREIGN KEY (user_id)      REFERENCES Users      (user_id)      ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_sch_slot FOREIGN KEY (time_slot_id) REFERENCES Time_Slots (time_slot_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ★ Posts: category_id 삭제, place_price 삭제, end_time 추가
CREATE TABLE Posts (
    post_id         BIGINT       NOT NULL AUTO_INCREMENT,
    user_id         BIGINT       NOT NULL,
    post_title      VARCHAR(200) NOT NULL,
    post_content    TEXT         NOT NULL,
    meeting_time    TIMESTAMP    NOT NULL COMMENT '스터디 시작 시각',
    end_time        TIMESTAMP    NOT NULL COMMENT '스터디 종료 시각',
    max_members     INT          NOT NULL,
    current_members INT          NOT NULL DEFAULT 1,
    place_id        BIGINT       NULL,
    post_status     VARCHAR(20)  NOT NULL DEFAULT 'OPEN' COMMENT 'OPEN / CLOSED / CANCELLED / DONE',
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id),
    CONSTRAINT fk_post_user  FOREIGN KEY (user_id)  REFERENCES Users  (user_id)  ON DELETE CASCADE  ON UPDATE CASCADE,
    CONSTRAINT fk_post_place FOREIGN KEY (place_id) REFERENCES Places (place_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Posts 종속 테이블 --------------------------

CREATE TABLE PostHashtags (
    post_hashtag_id BIGINT NOT NULL AUTO_INCREMENT,
    post_id         BIGINT NOT NULL,
    hashtag_id      BIGINT NOT NULL,
    PRIMARY KEY (post_hashtag_id),
    UNIQUE KEY uq_post_hashtag (post_id, hashtag_id),
    CONSTRAINT fk_ph_post    FOREIGN KEY (post_id)    REFERENCES Posts    (post_id)    ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ph_hashtag FOREIGN KEY (hashtag_id) REFERENCES Hashtags (hashtag_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ★ PostBookmarks (테이블명 복수형으로 변경)
CREATE TABLE PostBookmarks (
    bookmark_id BIGINT    NOT NULL AUTO_INCREMENT,
    user_id     BIGINT    NOT NULL,
    post_id     BIGINT    NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (bookmark_id),
    UNIQUE KEY uq_bookmark (user_id, post_id),
    CONSTRAINT fk_bm_user FOREIGN KEY (user_id) REFERENCES Users (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_bm_post FOREIGN KEY (post_id) REFERENCES Posts (post_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ★ Study_Applications: status로 컬럼명 변경, UNIQUE 제약 추가
CREATE TABLE Study_Applications (
    application_id  BIGINT      NOT NULL AUTO_INCREMENT,
    post_id         BIGINT      NOT NULL,
    applicant_id    BIGINT      NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT 'PENDING / ACCEPTED / REJECTED',
    created_at      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (application_id),
    UNIQUE KEY uq_application (post_id, applicant_id),
    CONSTRAINT fk_app_post      FOREIGN KEY (post_id)      REFERENCES Posts (post_id)  ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_app_applicant FOREIGN KEY (applicant_id) REFERENCES Users (user_id)  ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ★ Study_Groups: created_at 추가
CREATE TABLE Study_Groups (
    study_group_id  BIGINT       NOT NULL AUTO_INCREMENT,
    post_id         BIGINT       NOT NULL,
    group_name      VARCHAR(200) NOT NULL,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (study_group_id),
    UNIQUE KEY uq_sg_post (post_id),
    CONSTRAINT fk_sg_post FOREIGN KEY (post_id) REFERENCES Posts (post_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ★ Study_Group_Members: PK 컬럼명 membership_id로 변경
CREATE TABLE Study_Group_Members (
    membership_id   BIGINT      NOT NULL AUTO_INCREMENT,
    study_group_id  BIGINT      NOT NULL,
    user_id         BIGINT      NOT NULL,
    member_role     VARCHAR(20) NOT NULL DEFAULT 'MEMBER' COMMENT 'HOST / MEMBER',
    member_status   VARCHAR(20) NULL     COMMENT 'ACTIVE / INACTIVE / KICKED',
    joined_at       TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    left_at         TIMESTAMP   NULL,
    PRIMARY KEY (membership_id),
    UNIQUE KEY uq_sgm (study_group_id, user_id),
    CONSTRAINT fk_sgm_group FOREIGN KEY (study_group_id) REFERENCES Study_Groups (study_group_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_sgm_user  FOREIGN KEY (user_id)        REFERENCES Users         (user_id)        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 채팅 도메인 ----------------------------------

CREATE TABLE Chat_Rooms (
    chat_room_id    BIGINT      NOT NULL AUTO_INCREMENT,
    study_group_id  BIGINT      NOT NULL,
    room_status     VARCHAR(20) NULL DEFAULT 'ACTIVE',
    created_at      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (chat_room_id),
    UNIQUE KEY uq_cr_group (study_group_id),
    CONSTRAINT fk_cr_group FOREIGN KEY (study_group_id) REFERENCES Study_Groups (study_group_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Chat_Room_Members (
    chat_room_member_id     BIGINT      NOT NULL AUTO_INCREMENT,
    chat_room_id            BIGINT      NOT NULL,
    user_id                 BIGINT      NOT NULL,
    last_read_message_id    BIGINT      NULL,
    member_status           VARCHAR(20) NULL,
    joined_at               TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    left_at                 TIMESTAMP   NULL,
    PRIMARY KEY (chat_room_member_id),
    UNIQUE KEY uq_crm (chat_room_id, user_id),
    CONSTRAINT fk_crm_room FOREIGN KEY (chat_room_id) REFERENCES Chat_Rooms (chat_room_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_crm_user FOREIGN KEY (user_id)      REFERENCES Users       (user_id)      ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Chat_Room_Messages (
    message_id      BIGINT      NOT NULL AUTO_INCREMENT,
    chat_room_id    BIGINT      NOT NULL,
    sender_id       BIGINT      NOT NULL,
    message_content TEXT        NOT NULL,
    message_type    VARCHAR(20) NOT NULL DEFAULT 'TEXT',
    sent_at         TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (message_id),
    CONSTRAINT fk_msg_room   FOREIGN KEY (chat_room_id) REFERENCES Chat_Rooms (chat_room_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_msg_sender FOREIGN KEY (sender_id)   REFERENCES Users       (user_id)      ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE Chat_Room_Members
    ADD CONSTRAINT fk_crm_last_msg
        FOREIGN KEY (last_read_message_id) REFERENCES Chat_Room_Messages (message_id)
        ON DELETE SET NULL ON UPDATE CASCADE;

-- ─────────────────────────────────────────────
-- STEP 3. 인덱스
-- ─────────────────────────────────────────────
CREATE INDEX idx_posts_status    ON Posts              (post_status);
CREATE INDEX idx_posts_user      ON Posts              (user_id);
CREATE INDEX idx_posts_meeting   ON Posts              (meeting_time);
CREATE INDEX idx_app_post        ON Study_Applications (post_id);
CREATE INDEX idx_app_applicant   ON Study_Applications (applicant_id);
CREATE INDEX idx_app_status      ON Study_Applications (status);
CREATE INDEX idx_msg_room_time   ON Chat_Room_Messages (chat_room_id, sent_at);
CREATE INDEX idx_log_user_date   ON Study_Logs         (user_id, study_date);
CREATE INDEX idx_users_deleted   ON Users              (deleted_at);
CREATE INDEX idx_places_region   ON Places             (region_id);
CREATE INDEX idx_places_location ON Places             (latitude, longitude);

-- ─────────────────────────────────────────────
-- STEP 4. 기초 데이터
-- ─────────────────────────────────────────────
INSERT INTO Categories (category_name) VALUES
    ('코딩/프로그래밍'), ('영어/외국어'), ('자격증/취업'),
    ('토익/토플'), ('수학/과학'), ('독서/글쓰기'), ('디자인'), ('기타');

INSERT INTO Time_Slots (slot_name, start_time, end_time) VALUES
    ('새벽', '00:00:00', '06:00:00'),
    ('오전', '06:00:00', '12:00:00'),
    ('오후', '12:00:00', '18:00:00'),
    ('저녁', '18:00:00', '22:00:00'),
    ('밤',   '22:00:00', '23:59:59');

SET FOREIGN_KEY_CHECKS = 1;
