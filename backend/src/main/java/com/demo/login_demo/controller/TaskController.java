package com.demo.login_demo.controller;

import com.demo.login_demo.model.User;
import com.demo.login_demo.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private UserRepository userRepository;

    // Show Add User Form
    @GetMapping("/adduserform")
    public String showAddUserForm(Model model, HttpSession session) {

        // ensure user is logged in
        if (session.getAttribute("loggedInUser") == null) {
            return "redirect:/login";
        }

        model.addAttribute("user", new User());
        return "add-user";
    }

    // POST Add User with validation
    @PostMapping("/postuserdata")
    public String addUser(@Valid @ModelAttribute("user") User user,
                          BindingResult result,
                          Model model) {

        if (result.hasErrors()) {
            model.addAttribute("message", "Please correct the errors below.");
            return "add-user";   
        }

        userRepository.save(user);
        model.addAttribute("message", "User added successfully!");
        return "redirect:/api/tasks/dashboard"; 
    }

    // View All Users
    @GetMapping("/all-users")
    public String viewAllUsers(Model model, HttpSession session) {

    User loggedIn = (User) session.getAttribute("loggedInUser");

    if (loggedIn == null) {
        return "redirect:/login";
    }

    model.addAttribute("users",
        userRepository.findAll()
            .stream()
            .filter(u -> u.getId() != loggedIn.getId())
            .toList()
    );

    return "view-users";
}


    // Dashboard
    @GetMapping("/dashboard")
    public String dashboard() {
        return "dashboard";
    }
    @GetMapping("/disable/{id}")
    public String disableUser(@PathVariable int id, HttpSession session) {

    if (session.getAttribute("loggedInUser") == null) {
        return "redirect:/login";
    }

    User user = userRepository.findById(id).orElse(null);

    if (user != null) {
        user.setEnabled(false);
        userRepository.save(user);
    }

    return "redirect:/api/tasks/all-users";
    }
    @GetMapping("/restore/{id}")
    public String restoreUser(@PathVariable int id, HttpSession session) {

    if (session.getAttribute("loggedInUser") == null) {
        return "redirect:/login";
    }

    User user = userRepository.findById(id).orElse(null);

    if (user != null) {
        user.setEnabled(true);
        userRepository.save(user);
    }

    return "redirect:/api/tasks/all-users";
    }
    @GetMapping("/update/{id}")
public String showUpdateForm(@PathVariable int id, Model model, HttpSession session) {

    // Ensure user is logged in
    if (session.getAttribute("loggedInUser") == null) {
        return "redirect:/login";
    }

    User user = userRepository.findById(id).orElse(null);

    if (user == null) {
        return "redirect:/api/tasks/all-users";
    }

    model.addAttribute("user", user);
    return "update-user"; // this will be the update form page
}
@PostMapping("/update/{id}")
public String updateUser(@PathVariable int id,
                         @ModelAttribute("user") User updatedUser,
                         BindingResult result,
                         Model model,
                         HttpSession session) {

    if (session.getAttribute("loggedInUser") == null) {
        return "redirect:/login";
    }

    User existingUser = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // Ignore password validation during update
    if (result.hasErrors()) {
        result.getFieldErrors().removeIf(e -> e.getField().equals("password"));

        if (result.hasErrors()) {
            model.addAttribute("user", updatedUser);
            return "update-user";
        }
    }

    existingUser.setFirstName(updatedUser.getFirstName());
    existingUser.setMiddleName(updatedUser.getMiddleName());
    existingUser.setLastName(updatedUser.getLastName());
    existingUser.setAge(updatedUser.getAge());
    existingUser.setEmail(updatedUser.getEmail());
    existingUser.setMobileNo(updatedUser.getMobileNo());
    existingUser.setUserName(updatedUser.getUserName());
    existingUser.setAddress(updatedUser.getAddress());
    existingUser.setTask(updatedUser.getTask());

    // Update password only when provided
    if (updatedUser.getPassword() != null && !updatedUser.getPassword().trim().isEmpty()) {
        existingUser.setPassword(updatedUser.getPassword());
    }

    userRepository.save(existingUser);

    return "redirect:/api/tasks/all-users";
}
}

