package de.hhn.labfastord.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/images")
public class FileUploadController {

    @Value("${upload.path}")
    private String uploadPath;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            Path copyLocation = Paths.get(uploadPath + File.separator + file.getOriginalFilename());
            Files.copy(file.getInputStream(), copyLocation);
            return ResponseEntity.ok("/images/products/" + file.getOriginalFilename());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not upload the file: " + file.getOriginalFilename() + " - " + e.getMessage());
        }
    }

    @PostMapping("/download")
    public ResponseEntity<String> downloadImage(@RequestParam("imageUrl") String imageUrl, @RequestParam("filename") String filename) {
        try {
            URL url = new URL(imageUrl);
            File file = new File(uploadPath + File.separator + filename);
            FileCopyUtils.copy(url.openStream(), new FileOutputStream(file));
            return ResponseEntity.ok("/images/products/" + filename);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not download the image from URL: " + imageUrl + " - " + e.getMessage());
        }
    }
}
