package meetudy.demo.service;

import lombok.RequiredArgsConstructor;
import meetudy.demo.dto.response.CategoryResponse;
import meetudy.demo.entity.Category;
import meetudy.demo.entity.User;
import meetudy.demo.entity.UserInterest;
import meetudy.demo.exception.CustomException;
import meetudy.demo.exception.ErrorCode;
import meetudy.demo.repository.CategoryRepository;
import meetudy.demo.repository.UserInterestRepository;
import meetudy.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserInterestService {

    private final UserInterestRepository userInterestRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    /** INT-03: 내 관심사 목록 조회 */
    @Transactional(readOnly = true)
    public List<CategoryResponse> getMyInterests(Long userId) {
        return userInterestRepository.findAllByUser_UserId(userId)
                .stream()
                .map(ui -> CategoryResponse.from(ui.getCategory()))
                .collect(Collectors.toList());
    }

    /** INT-04: 관심사 추가 */
    @Transactional
    public void addInterest(Long userId, Long categoryId) {
        if (userInterestRepository.existsByUser_UserIdAndCategory_CategoryId(userId, categoryId)) {
            throw new CustomException(ErrorCode.INTEREST_ALREADY_EXISTS);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CustomException(ErrorCode.CATEGORY_NOT_FOUND));

        userInterestRepository.save(UserInterest.builder()
                .user(user)
                .category(category)
                .build());
    }

    /** INT-05: 관심사 삭제 */
    @Transactional
    public void removeInterest(Long userId, Long categoryId) {
        UserInterest interest = userInterestRepository
                .findByUser_UserIdAndCategory_CategoryId(userId, categoryId)
                .orElseThrow(() -> new CustomException(ErrorCode.INTEREST_NOT_FOUND));

        userInterestRepository.delete(interest);
    }
}
