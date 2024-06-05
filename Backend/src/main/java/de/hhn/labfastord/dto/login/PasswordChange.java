package de.hhn.labfastord.dto.login;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
public class PasswordChange {

    @NotBlank
    private String oldPassword;

    @NotBlank
    private String newPassword;
}

