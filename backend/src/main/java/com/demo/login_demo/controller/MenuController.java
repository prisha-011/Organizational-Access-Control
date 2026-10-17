package com.demo.login_demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.demo.login_demo.model.Menu;
import com.demo.login_demo.service.MenuService;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "http://localhost:5173") // Allow React to access this
public class MenuController {
    
    @Autowired
    private MenuService menuService;

    //1.Create a new menu Item 
    @PostMapping("/create")
    public ResponseEntity<Menu> createMenu(@RequestBody Menu menu){
    Menu createdMenu = menuService.createMenu(menu);
    return ResponseEntity.ok(createdMenu);
    }

    // 2. Get all Menu Items (for the Sidebar)
    @GetMapping("/all")
    public ResponseEntity<List<Menu>> getAllMenus(){
        return ResponseEntity.ok(menuService.getAllMenus()); 
    }
}
