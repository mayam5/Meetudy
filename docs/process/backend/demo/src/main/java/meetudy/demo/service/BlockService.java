package meetudy.demo.service;

import lombok.RequiredArgsConstructor;
import meetudy.demo.dto.response.BlockedUserResponse;
import meetudy.demo.entity.User;
import meetudy.demo.entity.UserBlock;
import meetudy.demo.exception.CustomException;
import meetudy.demo.exception.ErrorCode;
import meetudy.demo.repository.UserBlockRepository;
import meetudy.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlockService {

    private final UserBlockRepository userBlockRepository;
    private final UserRepository userRepository;

    /** BLK-03: 유저 차단 */
    @Transactional
    public void blockUser(Long blockerId, Long targetId) {
        if (blockerId.equals(targetId)) {
            throw new CustomException(ErrorCode.SELF_BLOCK_NOT_ALLOWED);
        }

        if (userBlockRepository.existsByBlocker_UserIdAndBlocked_UserId(blockerId, targetId)) {
            throw new CustomException(ErrorCode.ALREADY_BLOCKED);
        }

        User blocker = userRepository.findById(blockerId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        User blocked = userRepository.findById(targetId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        userBlockRepository.save(UserBlock.builder()
                .blocker(blocker)
                .blocked(blocked)
                .build());
    }

    /** BLK-04: 차단 해제 */
    @Transactional
    public void unblockUser(Long blockerId, Long targetId) {
        UserBlock userBlock = userBlockRepository
                .findByBlocker_UserIdAndBlocked_UserId(blockerId, targetId)
                .orElseThrow(() -> new CustomException(ErrorCode.BLOCK_NOT_FOUND));

        userBlockRepository.delete(userBlock);
    }

    /** BLK-05: 차단 목록 조회 */
    @Transactional(readOnly = true)
    public List<BlockedUserResponse> getBlockList(Long blockerId) {
        return userBlockRepository.findAllByBlocker_UserId(blockerId)
                .stream()
                .map(BlockedUserResponse::from)
                .collect(Collectors.toList());
    }
}
