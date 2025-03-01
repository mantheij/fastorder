package de.hhn.labfastord.controllers;

import de.hhn.labfastord.dto.create.NewTableDTO;
import de.hhn.labfastord.models.Tables;
import de.hhn.labfastord.repositories.TablesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * The TablesController class manages the web requests related to tables.
 */
@CrossOrigin(origins = {"http://localhost:80", "http://react:80", "http://localhost:3000"}, maxAge = 3600)
@RestController
@RequestMapping("/api/tables")
public class TablesController {

    @Autowired
    private TablesRepository tablesRepository;

    /**
     * Gets all tables.
     *
     * @return all tables as ResponseEntity.
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
     *
     * @param id the ID of the table to retrieve
     * @return A ResponseEntity containing the found Tables, or a not found status if not present, or an internal server error if an exception occurs.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Tables> getTableById(@PathVariable Long id) {
        try {
            return tablesRepository.findById(id)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }


    /**
     * Updates a table
     *
     * @param id          the ID of the newTableDto to update
     * @param newTableDto the newTableDto data to update
     * @return the updated table as ResponseEntity.
     */
    //@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Tables> updateTable(@PathVariable Long id, @RequestBody NewTableDTO newTableDto) {
        try {
            return tablesRepository.findById(id)
                    .map(existingTable -> {
                        existingTable.setName(newTableDto.getName());
                        existingTable.setArea(newTableDto.getArea());
                        existingTable.setOccupied(newTableDto.isOccupied());
                        existingTable.setWidth(newTableDto.getWidth());
                        existingTable.setHeight(newTableDto.getHeight());
                        return ResponseEntity.ok(tablesRepository.save(existingTable));
                    })
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Creates a new Table.
     *
     * @param newTableDTO the new table data.
     * @return the created product as ResponseEntity.
     */
    //@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Tables> createTable(@RequestBody NewTableDTO newTableDTO) {
        try {
            Tables table = new Tables();
            table.setName(newTableDTO.getName());
            table.setArea(newTableDTO.getArea());
            table.setOccupied(newTableDTO.isOccupied());
            table.setWidth(newTableDTO.getWidth());
            table.setHeight(newTableDTO.getHeight());
            return ResponseEntity.ok(tablesRepository.save(table));
        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }


    /**
     * Deletes a Table.
     *
     * @param id the Table ID.
     * @return a confirmation message as ResponseEntity.
     */
    //@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable Long id) {
        try {
            tablesRepository.deleteById(id);
            return ResponseEntity.ok("Successfully deleted");
        } catch (DataAccessException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
