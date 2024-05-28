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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class TablesControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private int createdTableId;

    @Test
    public void returnAllTables() throws Exception {
        mockMvc.perform(get("/api/tables"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(9))));
    }

    @Test
    public void createNewTable() throws Exception {
        String newTableJson = "{\"name\":\"NewTable\"}";

        MvcResult result = mockMvc.perform(post("/api/tables")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(newTableJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("NewTable")))
                .andReturn();

        String responseString = result.getResponse().getContentAsString();
        createdTableId = JsonPath.read(responseString, "$.tableId");

        mockMvc.perform(get("/api/tables/" + createdTableId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.tableId", is(createdTableId)))
                .andExpect(jsonPath("$.name", is("NewTable")));
    }

    @Test
    public void deleteNewTable() throws Exception {
        mockMvc.perform(delete("/api/tables/" + createdTableId))
                .andExpect(status().isOk())
                .andExpect(content().string("Successfully deleted"));
    }

    @Test
    public void checkIfTableDeleted() throws Exception {
        mockMvc.perform(get("/api/tables/" + createdTableId))
                .andExpect(status().isNotFound());
    }
}
