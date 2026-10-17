package com.demo.login_demo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.demo.login_demo.model.Menu;
import com.demo.login_demo.repository.MenuRepository;
import com.demo.login_demo.service.MenuService;

@Service
public class MenuServiceImpl implements MenuService {
    @Autowired
    private MenuRepository menuRepo; 
    
    @Override
    public Menu createMenu(Menu menu){
        return menuRepo.save(menu);
    }

    @Override
    public List<Menu> getAllMenus(){
        return menuRepo.findAll();
    }

    @Override
    public List<Menu> findAllById(List<Integer> ids) {
        return menuRepo.findAllById(ids);
    }
}
