package meetudy.demo.service;

import lombok.RequiredArgsConstructor;
import meetudy.demo.dto.request.BulkScheduleRequest;
import meetudy.demo.dto.request.ScheduleRequest;
import meetudy.demo.dto.response.ScheduleResponse;
import meetudy.demo.entity.TimeSlot;
import meetudy.demo.entity.User;
import meetudy.demo.entity.UserSchedule;
import meetudy.demo.exception.CustomException;
import meetudy.demo.exception.ErrorCode;
import meetudy.demo.repository.TimeSlotRepository;
import meetudy.demo.repository.UserRepository;
import meetudy.demo.repository.UserScheduleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final UserScheduleRepository scheduleRepository;
    private final UserRepository userRepository;
    private final TimeSlotRepository timeSlotRepository;

    /** SCH-03: 내 스케줄 목록 조회 */
    @Transactional(readOnly = true)
    public List<ScheduleResponse> getMySchedules(Long userId) {
        return scheduleRepository.findAllByUser_UserId(userId)
                .stream()
                .map(ScheduleResponse::from)
                .collect(Collectors.toList());
    }

    /** SCH-04: 스케줄 추가 */
    @Transactional
    public ScheduleResponse addSchedule(Long userId, ScheduleRequest request) {
        // 중복 체크 (같은 요일 + 같은 타임슬롯)
        if (scheduleRepository.existsByUser_UserIdAndDayOfWeekAndTimeSlot_TimeSlotId(
                userId, request.getDayOfWeek(), request.getTimeSlotId())) {
            throw new CustomException(ErrorCode.SCHEDULE_ALREADY_EXISTS);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        TimeSlot timeSlot = timeSlotRepository.findById(request.getTimeSlotId())
                .orElseThrow(() -> new CustomException(ErrorCode.TIMESLOT_NOT_FOUND));

        UserSchedule schedule = scheduleRepository.save(UserSchedule.builder()
                .user(user)
                .dayOfWeek(request.getDayOfWeek())
                .timeSlot(timeSlot)
                .build());

        return ScheduleResponse.from(schedule);
    }

    /** SCH-05: 스케줄 수정 (기존 삭제 후 새로 저장) */
    @Transactional
    public ScheduleResponse updateSchedule(Long userId, Long scheduleId, ScheduleRequest request) {
        // 본인 스케줄인지 확인 후 삭제
        UserSchedule existing = scheduleRepository
                .findByUserScheduleIdAndUser_UserId(scheduleId, userId)
                .orElseThrow(() -> new CustomException(ErrorCode.SCHEDULE_NOT_FOUND));

        // 변경 후 중복 체크 (본인 것 제외)
        if (scheduleRepository.existsByUser_UserIdAndDayOfWeekAndTimeSlot_TimeSlotId(
                userId, request.getDayOfWeek(), request.getTimeSlotId())) {
            throw new CustomException(ErrorCode.SCHEDULE_ALREADY_EXISTS);
        }

        TimeSlot timeSlot = timeSlotRepository.findById(request.getTimeSlotId())
                .orElseThrow(() -> new CustomException(ErrorCode.TIMESLOT_NOT_FOUND));

        scheduleRepository.delete(existing);

        UserSchedule updated = scheduleRepository.save(UserSchedule.builder()
                .user(existing.getUser())
                .dayOfWeek(request.getDayOfWeek())
                .timeSlot(timeSlot)
                .build());

        return ScheduleResponse.from(updated);
    }

        /** SCH-05-B: 스케줄 전체 교체 (Bulk Replace) */
        @Transactional
        public List<ScheduleResponse> replaceSchedules(Long userId, BulkScheduleRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // DELETE 먼저 DB에 반영 후 INSERT (flush 없으면 충돌)
        scheduleRepository.deleteAll(scheduleRepository.findAllByUser_UserId(userId));
        scheduleRepository.flush();

        List<UserSchedule> updated = request.getSchedules().stream()
                .map(req -> {
                        TimeSlot timeSlot = timeSlotRepository.findById(req.getTimeSlotId())
                                .orElseThrow(() -> new CustomException(ErrorCode.TIMESLOT_NOT_FOUND));
                        return UserSchedule.builder()
                                .user(user)
                                .dayOfWeek(req.getDayOfWeek())
                                .timeSlot(timeSlot)
                                .build();
                })
                .collect(Collectors.toList());

        return scheduleRepository.saveAll(updated)
                .stream()
                .map(ScheduleResponse::from)
                .collect(Collectors.toList());
        }

    /** SCH-06: 스케줄 삭제 */
    @Transactional
    public void deleteSchedule(Long userId, Long scheduleId) {
        UserSchedule schedule = scheduleRepository
                .findByUserScheduleIdAndUser_UserId(scheduleId, userId)
                .orElseThrow(() -> new CustomException(ErrorCode.SCHEDULE_NOT_FOUND));

        scheduleRepository.delete(schedule);
    }
}