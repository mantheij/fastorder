package de.hhn.labfastord.controllers;

import de.hhn.labfastord.models.Tables;
import de.hhn.labfastord.repositories.TablesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
public class TablesController {

    @Autowired
    private TablesRepository tablesRepository;

    @GetMapping
    public List<Tables> getAllTables() {
        return tablesRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tables> getTableById(@PathVariable Integer id) {
        return tablesRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Tables createTable(@RequestBody Tables table) {
        return tablesRepository.save(table);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTable(@PathVariable Integer id) {
        tablesRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
