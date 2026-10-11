package com.pulsewatch.repository;

import com.pulsewatch.model.Monitor;
import com.pulsewatch.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MonitorRepository extends JpaRepository<Monitor, Long> {
    List<Monitor> findByUserOrderByIdDesc(User user);
    Optional<Monitor> findByIdAndUser(Long id, User user);
    List<Monitor> findAllByIsPausedFalse();

    @Query("SELECT COUNT(m) FROM Monitor m WHERE m.user = :user")
    long countByUser(User user);

    @Query("SELECT COUNT(m) FROM Monitor m WHERE m.user = :user AND m.status = 'UP' AND m.isPaused = false")
    long countUpByUser(User user);

    @Query("SELECT COUNT(m) FROM Monitor m WHERE m.user = :user AND m.status = 'DOWN' AND m.isPaused = false")
    long countDownByUser(User user);
}
