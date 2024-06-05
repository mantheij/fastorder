package de.hhn.labfastord.dto;


import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class ProductDTO {
    private Long productId;
    private String name;
    private Double price;
    private String imgName;
    private MultipartFile file;
    private boolean available;
    private Integer quantity;
    private Long categoryId;
    private String size;
    private String allergens;
    private String ingredients;
    private String nutrition;

    public ProductDTO() {
    }
}

