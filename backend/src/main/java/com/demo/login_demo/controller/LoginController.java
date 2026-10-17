package com.demo.login_demo.controller;

import java.util.Optional;
import jakarta.servlet.http.HttpServletRequest;
import com.demo.login_demo.service.LoginHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.demo.login_demo.model.User;
import com.demo.login_demo.repository.UserRepository;

import jakarta.servlet.http.HttpSession;

@Controller
public class LoginController {

    @Autowired
    private UserRepository userRepository;
    private LoginHistoryService loginHistoryService;

    @GetMapping("/login")
    public String showLoginPage() {
        return "login"; // Thymeleaf template name
    }

    @PostMapping("/login")
    public String login(@RequestParam String username,
                    @RequestParam String password,
                    HttpSession session,
                    Model model,
                        HttpServletRequest request) {

    Optional<User> userOpt = userRepository.findByUserNameOrEmail(username,username); 

    if (userOpt.isPresent()) {
        User user = userOpt.get();

            if (user.getPassword().equals(password) && user.isEnabled()) {

            loginHistoryService.save(username, "SUCCESS", request);
            session.setAttribute("loggedInUser", user);
            return "redirect:/dashboard";
        }
    }
    loginHistoryService.save(username, "FAILED", request);

    model.addAttribute("error", "Invalid username or password");
    return "login";
    }
    
    @GetMapping("/dashboard")
    public String showDashboard(HttpSession session, Model model) {
    User user = (User) session.getAttribute("loggedInUser");
    System.out.println("User from session = " + user);
    if (user != null) {
        model.addAttribute("username", user.getFirstName()); 
    }

    return "dashboard";       
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
    session.invalidate(); // remove session 
    return "redirect:/login"; // go back to login page
}
} 
