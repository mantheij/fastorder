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
public class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private int createdProductId;

    @Test
    public void returnAllProducts() throws Exception {
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    public void createNewProductAndUpdate() throws Exception {
        String newProductJson = "{ \"name\": \"NewProduct\", \"price\": 10.0, \"quantity\": 100, \"productCategoryId\": \"1\", \"size\": \"1L\" }";

        MvcResult result = mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(newProductJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("NewProduct")))
                .andReturn();

        String responseString = result.getResponse().getContentAsString();
        createdProductId = JsonPath.read(responseString, "$.productId");

        mockMvc.perform(get("/api/products/" + createdProductId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.productId", is(createdProductId)))
                .andExpect(jsonPath("$.name", is("NewProduct")));

        String updatedProductJson = "{ \"name\": \"UpdatedProduct\", \"price\": 15.0, \"quantity\": 50, \"productCategoryId\": \"1\", \"size\": \"2L\" }";

        mockMvc.perform(put("/api/products/" + createdProductId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatedProductJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("UpdatedProduct")))
                .andExpect(jsonPath("$.price", is(15.0)))
                .andExpect(jsonPath("$.quantity", is(50)))
                .andExpect(jsonPath("$.size", is("2L")));
    }
    
    @Test
    public void deleteProduct() throws Exception {
        mockMvc.perform(delete("/api/products/" + createdProductId))
                .andExpect(status().isOk())
                .andExpect(content().string("Successfully deleted"));
    }

    @Test
    public void checkIfProductDeleted() throws Exception {
        mockMvc.perform(get("/api/products/" + createdProductId))
                .andExpect(status().isNotFound());
    }
}
