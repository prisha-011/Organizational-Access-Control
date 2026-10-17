package com.demo.login_demo.service;

import jakarta.servlet.http.HttpServletRequest;

public interface LoginHistoryService {
    void save(String username, String status, HttpServletRequest request);
}