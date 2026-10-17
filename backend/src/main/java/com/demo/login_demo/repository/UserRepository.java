package com.demo.login_demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.demo.login_demo.dto.UserDto;
import com.demo.login_demo.model.Role;
import com.demo.login_demo.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    // DTO projection
    @Query("SELECT new com.demo.login_demo.dto.UserDto(u.firstName, u.lastName, u.userName) FROM User u")
    List<UserDto> findUserList();

    Optional<User> findById(Integer id);

    // Find enabled user by username and password
    Optional<User> findByUserName(String userName);
    Optional<User>findByUserNameOrEmail(String userName, String email);

    boolean existsByRole(Role role);
    boolean existsByEmail(String email);
    boolean existsByUserName(String userName);

}
