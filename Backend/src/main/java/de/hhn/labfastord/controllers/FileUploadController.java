package de.hhn.labfastord.controllers;

import de.hhn.labfastord.dto.ProductDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api")
public class FileUploadController {

    @Value("${upload.path}")
    private String uploadPath;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@ModelAttribute ProductDTO productDTO) {
        if (productDTO.getFile().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No file selected");
        }

        try {
            String fileName = productDTO.getFile().getOriginalFilename();
            Path path = Paths.get(uploadPath + fileName);
            Files.write(path, productDTO.getFile().getBytes());

            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/images/products/")
                    .path(fileName)
                    .toUriString();

            return ResponseEntity.ok(fileDownloadUri);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File upload failed: " + e.getMessage());
        }
    }
}
