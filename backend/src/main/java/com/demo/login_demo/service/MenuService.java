package com.demo.login_demo.service;
import com.demo.login_demo.model.Menu;
import java.util.List;

public interface MenuService {
    Menu createMenu(Menu menu);
    List<Menu> getAllMenus();

    List<Menu> findAllById(List<Integer> ids);
}