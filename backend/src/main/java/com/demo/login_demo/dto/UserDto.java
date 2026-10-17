package com.demo.login_demo.dto;

import com.demo.login_demo.model.Role; // Import the Role enum
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    @NotNull(message = "First name is Required!")
    private String firstName;
    
    private String middleName;
    
    @NotNull(message = "Last name is Required!")
    private String lastName;
    
    private int age;
    
    @Email(message = "Email should be valid!")
    private String email;
    
    private String mobileNo;
    private String userName;
    private String password;
    private String address;
    private String task;

    // --- NEW FIELD: Role ---
    private Role role; 
    // -----------------------

    public UserDto(String firstName, String lastName, String userName) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.userName = userName;
    }
}