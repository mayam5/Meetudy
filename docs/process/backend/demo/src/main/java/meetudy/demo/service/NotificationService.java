package meetudy.demo.service;

import lombok.RequiredArgsConstructor;
import meetudy.demo.dto.response.NotificationResponse;
import meetudy.demo.entity.Notification;
import meetudy.demo.entity.User;
import meetudy.demo.exception.CustomException;
import meetudy.demo.exception.ErrorCode;
import meetudy.demo.repository.NotificationRepository;
import meetudy.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<NotificationResponse> getMyNotifications(Long userId) {
        return notificationRepository.findAllByUser_UserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(NotificationResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(Long userId, Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOTIFICATION_NOT_FOUND));
        if (!notification.getUser().getUserId().equals(userId)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }
        notification.markAsRead();
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.findAllByUser_UserIdOrderByCreatedAtDesc(userId)
                .forEach(Notification::markAsRead);
    }

    @Transactional
    public void createNotification(Long userId, String type, String message, String targetUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        notificationRepository.save(Notification.builder()
                .user(user)
                .type(type)
                .message(message)
                .targetUrl(targetUrl)
                .build());
    }
}
