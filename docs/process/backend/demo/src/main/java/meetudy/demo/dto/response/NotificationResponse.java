package meetudy.demo.dto.response;

import lombok.Getter;
import meetudy.demo.entity.Notification;

import java.time.LocalDateTime;

@Getter
public class NotificationResponse {

    private final Long id;
    private final String type;
    private final String message;
    private final boolean read;
    private final LocalDateTime createdAt;

    private NotificationResponse(Notification n) {
        this.id        = n.getNotificationId();
        this.type      = n.getType();
        this.message   = n.getMessage();
        this.read      = n.isRead();
        this.createdAt = n.getCreatedAt();
    }

    public static NotificationResponse from(Notification n) {
        return new NotificationResponse(n);
    }
}
