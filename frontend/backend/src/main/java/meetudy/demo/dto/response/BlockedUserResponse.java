package meetudy.demo.dto.response;

import lombok.Getter;
import meetudy.demo.entity.UserBlock;

import java.time.LocalDateTime;

@Getter
public class BlockedUserResponse {

    private final Long blockId;
    private final Long blockedUserId;
    private final String blockedNickname;
    private final LocalDateTime createdAt;

    private BlockedUserResponse(Long blockId, Long blockedUserId,
                                 String blockedNickname, LocalDateTime createdAt) {
        this.blockId = blockId;
        this.blockedUserId = blockedUserId;
        this.blockedNickname = blockedNickname;
        this.createdAt = createdAt;
    }

    public static BlockedUserResponse from(UserBlock userBlock) {
        return new BlockedUserResponse(
                userBlock.getBlockId(),
                userBlock.getBlocked().getUserId(),
                userBlock.getBlocked().getNickname(),
                userBlock.getCreatedAt()
        );
    }
}
