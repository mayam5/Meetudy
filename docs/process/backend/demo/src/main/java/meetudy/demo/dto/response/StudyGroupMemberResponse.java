package meetudy.demo.dto.response;

import lombok.Getter;
import meetudy.demo.entity.StudyGroupMember;

import java.time.LocalDateTime;

@Getter
public class StudyGroupMemberResponse {

    private final Long userId;
    private final String nickname;
    private final String profileImage;
    private final String memberRole;
    private final LocalDateTime joinedAt;

    private StudyGroupMemberResponse(StudyGroupMember member) {
        this.userId       = member.getUser().getUserId();
        this.nickname     = member.getUser().getNickname();
        this.profileImage = member.getUser().getProfileImage();
        this.memberRole   = member.getMemberRole();
        this.joinedAt     = member.getJoinedAt();
    }

    public static StudyGroupMemberResponse from(StudyGroupMember member) {
        return new StudyGroupMemberResponse(member);
    }
}
