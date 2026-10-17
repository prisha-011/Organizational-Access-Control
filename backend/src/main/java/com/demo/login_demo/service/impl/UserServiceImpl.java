package com.demo.login_demo.service.impl;

import java.util.HashSet; // <--- NEW IMPORT
import java.util.List;
import java.util.Set;     // <--- NEW IMPORT

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.demo.login_demo.dto.UserDto;
import com.demo.login_demo.model.Menu; // <--- NEW IMPORT
import com.demo.login_demo.model.Role;
import com.demo.login_demo.model.User;
import com.demo.login_demo.repository.UserRepository;
import com.demo.login_demo.service.MenuService; // <--- NEW IMPORT
import com.demo.login_demo.service.UserService;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MenuService menuService; // <--- Inject MenuService

    // ... [Your existing methods: createUser, allUsers, userById, etc.] ...
    // (Keep all your existing overrides here exactly as they were)

    @Override
    public void createUser(UserDto userDto) {
        // ... paste your existing createUser logic here ...
        try {
            if (userDto.getRole() == Role.SUPER_ADMIN) {
                if (userRepo.existsByRole(Role.SUPER_ADMIN)) {
                    throw new RuntimeException("Operation failed: A Super Admin already exists.");
                }
            }
            User user = new User();
            BeanUtils.copyProperties(userDto, user);
            if (user.getRole() == null) {
                user.setRole(Role.USER);
            }
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            userRepo.save(user);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public List<User> allUsers() { return this.userRepo.findAll(); }

    @Override
    public User userById(int userId) { return this.userRepo.findById(userId).orElse(null); }

    @Override
    public void updateUser(int userId, UserDto userDto) {
        // ... paste your existing updateUser logic here ...
        User user = userById(userId);
        if(user != null) {
            BeanUtils.copyProperties(userDto, user, "password", "role");
            if (userDto.getRole() != null) {
                if (userDto.getRole() == Role.SUPER_ADMIN) {
                    if (user.getRole() != Role.SUPER_ADMIN && userRepo.existsByRole(Role.SUPER_ADMIN)) {
                        throw new RuntimeException("Operation failed: A Super Admin already exists.");
                    }
                }
                user.setRole(userDto.getRole());
            }
            String newPlainPassword = userDto.getPassword();
            if (newPlainPassword != null && !newPlainPassword.isEmpty()) {
                // Correctly encode the new password before saving!
                user.setPassword(passwordEncoder.encode(newPlainPassword));
            }
            userRepo.save(user);
        }
    }

    @Override
    public void deleteUser(int userId) { userRepo.deleteById(userId); }

    @Override
    public List<UserDto> allUserList() { return userRepo.findUserList(); }

    @Override
    public void disableUser(int userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(false);
        userRepo.save(user);
    }

    @Override
    public void enableUser(int userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(true);
        userRepo.save(user);
    }

    @Override
    public User findByUsernameOrEmail(String value) {
        return userRepo.findByUserNameOrEmail(value, value).orElse(null);
    }

    // --- NEW METHODS IMPLEMENTATION ---

    @Override
    public Set<Menu> getUserMenus(int userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return user.getMenus();
    }

    @Override
    public void assignMenusToUser(int userId, List<Integer> menuIds) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Get the Menu objects using the IDs
        List<Menu> selectedMenus = menuService.findAllById(menuIds);

        // Update user's menu set
        user.setMenus(new HashSet<>(selectedMenus));

        userRepo.save(user);
    }
}