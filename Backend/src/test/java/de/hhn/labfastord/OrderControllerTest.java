package de.hhn.labfastord;

import com.jayway.jsonpath.JsonPath;
import de.hhn.labfastord.repositories.OrderRepository;
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
public class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrderRepository orderRepository;

    private int createdOrderId;

    @Test
    public void returnAllOrders() throws Exception {
        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    public void returnAllOpenOrders() throws Exception {
        mockMvc.perform(get("/api/orders/open"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[*].status", everyItem(is("open"))));
    }

    @Test
    public void createNewOrderAndUpdateStatus() throws Exception {
        String newOrderJson = "{ \"tableId\": 1, \"orderDetails\": [{ \"product\": { \"productId\": 1 }, \"quantity\": 2 }] }";

        MvcResult result = mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(newOrderJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("open")))
                .andReturn();

        String responseString = result.getResponse().getContentAsString();
        createdOrderId = JsonPath.read(responseString, "$.orderId");

        mockMvc.perform(get("/api/orders/" + createdOrderId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.orderId", is(createdOrderId)))
                .andExpect(jsonPath("$.status", is("open")));

        String statusJson = "{\"status\": \"closed\"}";

        mockMvc.perform(patch("/api/orders/" + createdOrderId + "/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(statusJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("closed")));
    }

    @Test
    public void deleteOrder() throws Exception {
        mockMvc.perform(delete("/api/orders/" + createdOrderId))
                .andExpect(status().isOk())
                .andExpect(content().string("Successfully deleted"));
    }

    @Test
    public void checkIfOrderDeleted() throws Exception {
        mockMvc.perform(get("/api/orders/" + createdOrderId))
                .andExpect(status().isNotFound());
    }
}
