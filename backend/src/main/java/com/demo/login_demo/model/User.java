package com.demo.login_demo.model;

import java.util.Date;
import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set; // <--- 1. NEW IMPORT

@Entity
@Table(name = "user_info")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String firstName;
    private String middleName;
    private String lastName;
    private int age;
    private String email;
    private String userName;

    @Column(name = "plain_password")
    private String plainPassword;

    private String password;

    private String salt;
    private String address;
    private String task;

    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be exactly 10 digits")
    private String mobileNo;

    @Column(nullable = true)
    private boolean enabled = true;

    @Enumerated(EnumType.STRING)
    private Role role;

    //Account security fields
    private int failedAttempts = 0;
    @Column(nullable = true)
    private boolean accountLocked = false;

    private java.time.LocalDateTime lockTime;


    // --- 2. NEW RELATIONSHIP FIELD ---
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_menus",               // Name of the intermediate table in DB
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "menu_id")
    )
    private Set<Menu> menus = new HashSet<>();
}