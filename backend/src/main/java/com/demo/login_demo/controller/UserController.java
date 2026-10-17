package com.demo.login_demo.controller;

import com.demo.login_demo.model.PasswordResetToken;
import com.demo.login_demo.repository.PasswordResetTokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import com.demo.login_demo.service.LoginHistoryService;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.demo.login_demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.demo.login_demo.dto.LoginRequest;
import com.demo.login_demo.dto.UserDto;
import com.demo.login_demo.model.Menu;
import com.demo.login_demo.model.User;
import com.demo.login_demo.repository.MenuRepository; // <--- 1. NEW IMPORT
import com.demo.login_demo.security.JwtUtil;
import com.demo.login_demo.service.UserService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class UserController {

    @Autowired
    private LoginHistoryService loginHistoryService;

    @Autowired
    private UserService userService;

    @Autowired
    private MenuRepository menuRepository; // <--- 2. INJECT REPOSITORY

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private com.demo.login_demo.security.CustomUserDetailsService userDetailsService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ... [EXISTING ENDPOINTS] ...

    // 1. React calls this when the user types their email and hits "Send Link"
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam("email") String email) {
        User user = userRepository.findByUserNameOrEmail(email, email).orElse(null);
        if (user == null) {
            return ResponseEntity.ok("If an account with that email exists, a reset link has been sent.");
        }

        String token = java.util.UUID.randomUUID().toString();
        tokenRepository.save(new PasswordResetToken(token, user));

        // MOCK EMAIL (Look in your Spring Boot terminal for this link!)
        System.out.println("\n=== MOCK EMAIL ===");
        System.out.println("Click to reset: http://localhost:5173/reset-password?token=" + token);
        System.out.println("==================\n");

        return ResponseEntity.ok("If an account with that email exists, a reset link has been sent.");
    }

    // 2. React calls this when the user types a new password on the reset screen
    @PostMapping("reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam("token") String token,
                                                @RequestParam("newPassword") String newPassword) {

        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);
        if (tokenOpt.isEmpty() || tokenOpt.get().getExpiryDate().before(new java.util.Date())) {
            return ResponseEntity.badRequest().body("Invalid or expired token.");
        }

        PasswordResetToken resetToken = tokenOpt.get();
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword)); // Hash it!
        userRepository.save(user);
        tokenRepository.delete(resetToken); // Clean up

        return ResponseEntity.ok("Password reset successfully!");
    }

    @PostMapping("/create")
    public ResponseEntity<String> createUser(@RequestBody @Valid UserDto userDto) {

        // 1. Validation: Check Username
        if (userRepository.existsByUserName(userDto.getUserName())) {
            return ResponseEntity
                    .badRequest()
                    .body("Error: Username is already taken!");
        }

        // 2. Validation: Check Email
        if (userRepository.existsByEmail(userDto.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body("Error: Email is already registered!");
        }

        // 3. If valid, proceed to create
        userService.createUser(userDto);

        return new ResponseEntity<>("User created successfully!", HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> allUsers() {
        return new ResponseEntity<>(this.userService.allUsers(), HttpStatus.OK);
    }

    @GetMapping("/byid/{id}")
    public ResponseEntity<User> userById(@PathVariable("id") int userId) {
        return new ResponseEntity<>(this.userService.userById(userId), HttpStatus.OK);
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateUser(@RequestParam("id") int userId, @RequestBody @Valid UserDto userDto) {

        // 1. Fetch the existing user from DB to check current values
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // 2. Validation: Check Username (Only if it has changed)
        if (!existingUser.getUserName().equals(userDto.getUserName())) {
            // If the new username is different, check if it's already taken by someone else
            if (userRepository.existsByUserName(userDto.getUserName())) {
                return ResponseEntity
                        .badRequest()
                        .body("Error: Username is already taken!");
            }
        }

        // 3. Validation: Check Email (Only if it has changed)
        if (!existingUser.getEmail().equals(userDto.getEmail())) {
            // If the new email is different, check if it exists elsewhere
            if (userRepository.existsByEmail(userDto.getEmail())) {
                return ResponseEntity
                        .badRequest()
                        .body("Error: Email is already registered!");
            }
        }

        // 4. If validations pass, proceed with update
        this.userService.updateUser(userId, userDto);

        return new ResponseEntity<>("User updated successfully!", HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable("id") int userId) {
        this.userService.deleteUser(userId);
        return new ResponseEntity<>("User deleted successfully!", HttpStatus.OK);
    }

    @GetMapping("/user/all")
    public ResponseEntity<List<UserDto>> allUserList() {
        return new ResponseEntity<>(this.userService.allUserList(), HttpStatus.OK);
    }

    @PutMapping("/{id}/disable")
    public ResponseEntity<String> disableUser(@PathVariable int id) {
        userService.disableUser(id);
        return ResponseEntity.ok("User disabled successfully.");
    }

    @PutMapping("/enable")
    public ResponseEntity<String> enableUser(@RequestParam int id) {
        userService.enableUser(id);
        return ResponseEntity.ok("User enabled successfully");
    }

    @PostMapping("/login-new")
    public ResponseEntity<?> apiLogin(@RequestBody LoginRequest request,
                                      HttpServletRequest httpRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

            var userDetails = userDetailsService.loadUserByUsername(request.getUsername());
            String token = jwtUtil.generateToken(userDetails);
            User user = userService.findByUsernameOrEmail(request.getUsername());

            // ✅ SAVE SUCCESS LOGIN
            loginHistoryService.save(request.getUsername(), "SUCCESS", httpRequest);

            return ResponseEntity.ok(new LoginResponse(
                    true,
                    "Login successful",
                    token,
                    user.getId(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getUserName()
            ));

        } catch (Exception e) {

            // ❌ SAVE FAILED LOGIN
            loginHistoryService.save(request.getUsername(), "FAILED", httpRequest);

            return new ResponseEntity<>("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
    }

    // --- MENU MAPPING ENDPOINTS ---

    // 1. [NEW] Get ALL available menus (For the "ghost" list issue)
    @GetMapping("/menus")
    public ResponseEntity<List<Menu>> getAllMenus() {
        return ResponseEntity.ok(menuRepository.findAll());
    }

    // 2. Get menus SPECIFICALLY assigned to a user (For the checkmarks)
    @GetMapping("/users/{userId}/menus")
    public ResponseEntity<Set<Menu>> getUserMenus(@PathVariable int userId) {
        return ResponseEntity.ok(userService.getUserMenus(userId));
    }

    // 3. Save menu mapping
    @PostMapping("/users/{userId}/menus")
    public ResponseEntity<?> mapMenusToUser(@PathVariable int userId, @RequestBody List<Integer> menuIds) {
        userService.assignMenusToUser(userId, menuIds);
        return ResponseEntity.ok("Menus mapped successfully!");
    }

    record LoginResponse(boolean success, String message, String token, int userId, String firstName, String lastName, String userName) {}
}