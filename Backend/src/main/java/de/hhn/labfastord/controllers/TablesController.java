package de.hhn.labfastord.controllers;

import de.hhn.labfastord.models.Tables;
import de.hhn.labfastord.repositories.TablesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataAccessException;

import java.util.List;

/**
 * The TablesController class manages the web requests related to tables.
 */
@RestController
@RequestMapping("/api/tables")
public class TablesController {

    @Autowired
    private TablesRepository tablesRepository;

    /**
     * Retrieves all tables.
     * @return A ResponseEntity containing a list of Tables or an internal server error if an exception occurs.
     */
    @GetMapping
    public ResponseEntity<List<Tables>> getAllTables() {
        try {
            List<Tables> tables = tablesRepository.findAll();
            return ResponseEntity.ok(tables);
        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Retrieves a specific table by ID.
     * @param id the ID of the table to retrieve
     * @return A ResponseEntity containing the found Tables, or a not found status if not present, or an internal server error if an exception occurs.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Tables> getTableById(@PathVariable Integer id) {
        try {
            return tablesRepository.findById(id)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Updates an existing table identified by ID.
     * @param id the ID of the table to update
     * @param table the table data to update
     * @return A ResponseEntity containing the updated table, or a not found status if no table is found, or an internal server error if an exception occurs.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Tables> updateTable(@PathVariable Integer id, @RequestBody Tables table) {
        try {
            return tablesRepository.findById(id)
                    .map(existingTable -> {
                        existingTable.setNumber(table.getNumber());
                        return ResponseEntity.ok(tablesRepository.save(existingTable));
                    })
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public Tables createTable(@RequestBody Tables table) {
        return tablesRepository.save(table);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable Integer id) {
        try {
            tablesRepository.deleteById(id);
            return ResponseEntity.ok("Successfully deleted");

        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
