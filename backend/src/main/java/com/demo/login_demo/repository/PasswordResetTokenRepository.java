package com.demo.login_demo.repository;
import com.demo.login_demo.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken,Integer> {
    Optional<PasswordResetToken> findByToken(String Token);
}
