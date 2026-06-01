-- 1. Refresh_Tokens 테이블 추가
CREATE TABLE Refresh_Tokens (
    token_id        BIGINT          NOT NULL AUTO_INCREMENT,
    user_id         BIGINT          NOT NULL,
    token_hash      VARCHAR(512)    NOT NULL COMMENT 'Refresh Token을 해시 처리한 값',
    device_info     VARCHAR(255)    NULL     COMMENT '브라우저 정보',
    expires_at      TIMESTAMP       NOT NULL COMMENT '토큰 만료 시각',
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '토큰 발급 시각',
    revoked_at      TIMESTAMP       NULL     COMMENT '무효화된 시각',
    PRIMARY KEY (token_id),
    CONSTRAINT fk_rt_user FOREIGN KEY (user_id) REFERENCES Users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Posts 테이블에 category_id 추가 및 외래키 설정
ALTER TABLE Posts 
    ADD COLUMN category_id BIGINT NOT NULL AFTER post_content,
    ADD CONSTRAINT fk_post_category 
        FOREIGN KEY (category_id) REFERENCES Categories (category_id) 
        ON DELETE RESTRICT ON UPDATE CASCADE;