package de.hhn.labfastord;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class ProductCategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private int createdCategoryId;

    @Test
    public void returnAllCategories() throws Exception {
        mockMvc.perform(get("/api/productCategories"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    public void createNewCategoryAndUpdate() throws Exception {
        String newCategoryJson = "{ \"name\": \"NewCategory\", \"description\": \"New category description\" }";

        MvcResult result = mockMvc.perform(post("/api/productCategories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(newCategoryJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("NewCategory")))
                .andReturn();

        String responseString = result.getResponse().getContentAsString();
        createdCategoryId = JsonPath.read(responseString, "$.categoryId");

        mockMvc.perform(get("/api/productCategories/" + createdCategoryId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.categoryId", is(createdCategoryId)))
                .andExpect(jsonPath("$.name", is("NewCategory")));

        String updatedCategoryJson = "{ \"name\": \"UpdatedCategory\", \"description\": \"Updated description\" }";

        mockMvc.perform(put("/api/productCategories/" + createdCategoryId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatedCategoryJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("UpdatedCategory")))
                .andExpect(jsonPath("$.description", is("Updated description")));
    }

    @Test
    public void deleteCategory() throws Exception {
        mockMvc.perform(delete("/api/productCategories/" + createdCategoryId))
                .andExpect(status().isOk())
                .andExpect(content().string("Successfully deleted"));
    }

    @Test
    public void checkIfCategoryDeleted() throws Exception {
        mockMvc.perform(get("/api/productCategories/" + createdCategoryId))
                .andExpect(status().isNotFound());
    }
}
