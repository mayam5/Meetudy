package meetudy.demo.dto.response;

import lombok.Getter;
import meetudy.demo.entity.Category;

@Getter
public class CategoryResponse {

    private final Long categoryId;
    private final String categoryName;

    private CategoryResponse(Long categoryId, String categoryName) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
    }

    public static CategoryResponse from(Category category) {
        return new CategoryResponse(category.getCategoryId(), category.getCategoryName());
    }
}
