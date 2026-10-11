package com.pulsewatch.repository;

import com.pulsewatch.model.StatusPage;
import com.pulsewatch.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StatusPageRepository extends JpaRepository<StatusPage, Long> {

    Optional<StatusPage> findBySlug(String slug);

    List<StatusPage> findByUserOrderByIdDesc(User user);

    Optional<StatusPage> findByIdAndUser(Long id, User user);

    boolean existsBySlug(String slug);
}
