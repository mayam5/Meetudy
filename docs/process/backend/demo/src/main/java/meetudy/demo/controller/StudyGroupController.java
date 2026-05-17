package meetudy.demo.controller;

import lombok.RequiredArgsConstructor;
import meetudy.demo.common.ApiResponse;
import meetudy.demo.dto.response.StudyGroupMemberResponse;
import meetudy.demo.dto.response.StudyGroupResponse;
import meetudy.demo.service.StudyGroupService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/study-groups")
@RequiredArgsConstructor
public class StudyGroupController {

    private final StudyGroupService studyGroupService;

    /** 내가 속한 스터디 그룹 목록 */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<StudyGroupResponse>>> getMyGroups(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(studyGroupService.getMyGroups(userId)));
    }

    /** 스터디 그룹 상세 조회 */
    @GetMapping("/{groupId}")
    public ResponseEntity<ApiResponse<StudyGroupResponse>> getGroupInfo(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long groupId) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(studyGroupService.getGroupInfo(userId, groupId)));
    }

    /** 스터디 그룹 멤버 목록 */
    @GetMapping("/{groupId}/members")
    public ResponseEntity<ApiResponse<List<StudyGroupMemberResponse>>> getGroupMembers(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long groupId) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(studyGroupService.getGroupMembers(userId, groupId)));
    }
}
