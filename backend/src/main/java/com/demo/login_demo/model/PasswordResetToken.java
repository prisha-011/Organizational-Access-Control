package com.demo.login_demo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
public class PasswordResetToken {

    private static final int EXPIRATION_MINUTES = 15;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // --- Generate Getters and Setters for id, token, user, and expiryDate ---
    @Getter
    @Setter
    private String token;

    @Setter
    @Getter
    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    @Setter
    @Getter
    private Date expiryDate;

    public PasswordResetToken() {}

    public PasswordResetToken(String token, User user) {
        this.token = token;
        this.user = user;
        // Set expiry date to 15 minutes from now
        this.expiryDate = new Date(System.currentTimeMillis() + (EXPIRATION_MINUTES * 60 * 1000));
    }

}