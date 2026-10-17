package com.demo.login_demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.demo.login_demo.model.LoginHistory;
public interface LoginHistoryRepository extends JpaRepository<LoginHistory, Long> {
}
