package com.example.usedcars.config;

import com.example.usedcars.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/favicon.ico",
                                "/vite.svg",
                                "/assets/**",
                                "/css/**",
                                "/js/**",
                                "/images/**",
                                "/uploads/**",
                                "/static/**",
                                "/listings/**",
                                "/login",
                                "/register",
                                "/dashboard",
                                "/my-listings/**",
                                "/create-listing",
                                "/edit-listing/**",
                                "/profile",
                                "/favorites",
                                "/admin/**"
                        ).permitAll()
                        .requestMatchers("/api/auth/**", "/actuator/**").permitAll()
                        // A sajat hirdetesek listaja csak bejelentkezve erheto el.
                        .requestMatchers(HttpMethod.GET, "/api/listings/my").authenticated()
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/listings",
                                "/api/listings/brands",
                                "/api/listings/*"
                        ).permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/favorites/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/listings/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/listings/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/listings/**").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "/api/listings/**").authenticated()
                        .requestMatchers("/api/images/**").authenticated()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}
