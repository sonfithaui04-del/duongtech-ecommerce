package com.duongtech.auth.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * CORS Configuration for Service Auth
 * Allows requests from API Gateway and Frontend
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow Cookie
        config.setAllowCredentials(true);
        
        // Allowed Origins (Gateway & Frontends)
        config.addAllowedOrigin("http://localhost:9080"); // API Gateway (DuongTech)
        config.addAllowedOrigin("http://localhost:3001"); // Frontend khách (DuongTech)
        config.addAllowedOrigin("http://localhost:3003"); // Admin Panel (DuongTech)
        
        // Allowed Headers
        config.addAllowedHeader("*");
        
        // Allowed Methods
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("OPTIONS");
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
