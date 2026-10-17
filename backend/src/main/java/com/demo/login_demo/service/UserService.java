package com.demo.login_demo.service;

import java.util.List;
import java.util.Set; // <--- NEW IMPORT

import com.demo.login_demo.dto.UserDto;
import com.demo.login_demo.model.Menu; // <--- NEW IMPORT
import com.demo.login_demo.model.User;

public interface UserService {

    void createUser(UserDto userDto);
    List<User> allUsers();
    User userById(int userId);
    void updateUser(int userId, UserDto userDto);
    void deleteUser(int userId);
    List<UserDto> allUserList();
    void disableUser(int userId);
    void enableUser(int userId);
    User findByUsernameOrEmail(String value);

    // --- NEW METHODS FOR MENU MAPPING ---
    Set<Menu> getUserMenus(int userId);
    void assignMenusToUser(int userId, List<Integer> menuIds);
}