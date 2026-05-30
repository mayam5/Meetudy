package meetudy.demo.service;

import lombok.RequiredArgsConstructor;
import meetudy.demo.dto.request.CreatePostRequest;
import meetudy.demo.dto.request.UpdatePostRequest;
import meetudy.demo.dto.response.PostResponse;
import meetudy.demo.entity.*;
import meetudy.demo.exception.CustomException;
import meetudy.demo.exception.ErrorCode;
import meetudy.demo.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final PlaceRepository placeRepository;
    private final CategoryRepository categoryRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final StudyGroupMemberRepository studyGroupMemberRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;
    private final TimeSlotRepository timeSlotRepository;

    /** POST-06: OPEN 게시글 전체 조회 */
    @Transactional(readOnly = true)
    public List<PostResponse> getAllOpenPosts() {
        return postRepository.findAllByPostStatusOrderByCreatedAtDesc("OPEN")
                .stream()
                .map(PostResponse::from)
                .collect(Collectors.toList());
    }

    /** POST-07: 게시글 단건 조회 */
    @Transactional(readOnly = true)
    public PostResponse getPostById(Long postId) {
        return PostResponse.from(findPost(postId));
    }

    /** POST-08: 카테고리별 조회 */
    @Transactional(readOnly = true)
    public List<PostResponse> getPostsByCategory(Long categoryId) {
        return postRepository
                .findAllByPostStatusAndCategory_CategoryIdOrderByCreatedAtDesc("OPEN", categoryId)
                .stream()
                .map(PostResponse::from)
                .collect(Collectors.toList());
    }

    /** POST-09: 키워드 검색 */
    @Transactional(readOnly = true)
    public List<PostResponse> searchPosts(String keyword) {
        return postRepository.searchByKeyword(keyword)
                .stream()
                .map(PostResponse::from)
                .collect(Collectors.toList());
    }

    /** POST-10: 내 게시글 목록 */
    @Transactional(readOnly = true)
    public List<PostResponse> getMyPosts(Long userId) {
        return postRepository.findAllByUser_UserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(PostResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * POST-11: 게시글 작성
     * → StudyGroup, StudyGroupMember(HOST), ChatRoom, ChatRoomMember 동시 생성
     */
    @Transactional
    public PostResponse createPost(Long userId, CreatePostRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new CustomException(ErrorCode.CATEGORY_NOT_FOUND));
/* 
        Place place = null;
        if (request.getPlaceId() != null) {
            place = placeRepository.findById(request.getPlaceId())
                    .orElseThrow(() -> new CustomException(ErrorCode.PLACE_NOT_FOUND));
        }
*/

        Place place = null;

if (request.getPlaceId() != null) {
    place = placeRepository.findById(request.getPlaceId())
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 장소입니다."));
}

        TimeSlot timeSlot = timeSlotRepository.findById(request.getTimeSlotId())
    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 시간대입니다."));

        // 1. Post 저장
        Post post = postRepository.save(Post.builder()
                .user(user)
                .postTitle(request.getPostTitle())
                .postContent(request.getPostContent())
                //.meetingTime(request.getMeetingTime())
                //.endTime(request.getEndTime())
                .dayOfWeek(request.getDayOfWeek())
                .timeSlot(timeSlot)
                .maxMembers(request.getMaxMembers())
                .category(category)
                .place(place)
                .build());

        // 2. StudyGroup 생성 (그룹 이름 = 게시글 제목)
        StudyGroup studyGroup = studyGroupRepository.save(StudyGroup.builder()
                .post(post)
                .groupName(post.getPostTitle())
                .build());

        // 3. 작성자를 HOST로 StudyGroupMember 추가
        studyGroupMemberRepository.save(StudyGroupMember.builder()
                .studyGroup(studyGroup)
                .user(user)
                .memberRole("HOST")
                .build());

        // 4. ChatRoom 생성
        ChatRoom chatRoom = chatRoomRepository.save(ChatRoom.builder()
                .studyGroup(studyGroup)
                .build());

        // 5. 작성자를 ChatRoomMember로 추가
        chatRoomMemberRepository.save(ChatRoomMember.builder()
                .chatRoom(chatRoom)
                .user(user)
                .memberStatus("ACTIVE")
                .build());

        return PostResponse.from(post);
    }

    /** POST-12: 게시글 수정 (작성자만) */
    @Transactional
    public PostResponse updatePost(Long userId, Long postId, UpdatePostRequest request) {
        Post post = findPost(postId);
        checkAuthor(post, userId);

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new CustomException(ErrorCode.CATEGORY_NOT_FOUND));
        }

        post.update(
                request.getPostTitle(),
                request.getPostContent(),
                request.getMeetingTime(),
                request.getEndTime(),
                request.getMaxMembers(),
                category
        );
        return PostResponse.from(post);
    }

    /** POST-13: 모집 마감 (작성자만) */
    @Transactional
    public void closePost(Long userId, Long postId) {
        Post post = findPost(postId);
        checkAuthor(post, userId);

        if (!post.isOpen()) {
            throw new CustomException(ErrorCode.POST_ALREADY_CLOSED);
        }
        post.close();
    }

    /** POST-14: 게시글 삭제 (작성자만) */
    @Transactional
    public void deletePost(Long userId, Long postId) {
        Post post = findPost(postId);
        checkAuthor(post, userId);
        postRepository.delete(post);
    }

    // ── 내부 헬퍼 ──────────────────────────────────────────

    private Post findPost(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));
    }

    private void checkAuthor(Post post, Long userId) {
        if (!post.isAuthor(userId)) {
            throw new CustomException(ErrorCode.POST_NOT_AUTHOR);
        }
    }
}
