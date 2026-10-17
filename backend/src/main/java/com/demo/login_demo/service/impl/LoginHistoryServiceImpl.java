package com.demo.login_demo.service.impl;

import com.demo.login_demo.model.LoginHistory;
import com.demo.login_demo.repository.LoginHistoryRepository;
import com.demo.login_demo.service.LoginHistoryService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class LoginHistoryServiceImpl implements LoginHistoryService {

    @Autowired
    private LoginHistoryRepository repository;

    @Override
    public void save(String username, String status, HttpServletRequest request) {
        LoginHistory log = new LoginHistory();
        log.setUsername(username);
        log.setLoginTime(LocalDateTime.now());
        log.setIpAddress(request.getRemoteAddr());
        log.setStatus(status);

        repository.save(log);
    }
}