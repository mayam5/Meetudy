CREATE TABLE Notifications (
    notification_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT       NOT NULL,
    type            VARCHAR(50)  NOT NULL,
    message         TEXT         NOT NULL,
    is_read         BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at      DATETIME     NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
