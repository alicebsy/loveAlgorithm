package com.madcamp.love_algorithm.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 API 경로에 대해
                .allowedOrigins(
                    "http://localhost:5174",  // 리액트 개발 서버 주소
                    "http://localhost:5175",  // Vite 기본 포트
                    "http://localhost:5176",  // 추가 개발 포트
                    "http://15.165.158.127",  // 서버 IP (HTTP)
                    "http://15.165.158.127:8081",  // 서버 IP (포트 포함)
                    "https://15.165.158.127",  // 서버 IP (HTTPS)
                    "http://lovealgorithmgame.site",  // 도메인 (HTTP)
                    "http://lovealgorithmgame.site:8081",  // 도메인 (포트 포함)
                    "https://lovealgorithmgame.site",  // 도메인 (HTTPS)
                    "https://love-algorithm-seven.vercel.app"  // Vercel 배포 URL (HTTPS)
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 허용할 HTTP 메서드
                .allowedHeaders("*") // 모든 헤더 허용
                .allowCredentials(true); // 쿠키나 인증 정보를 포함한 요청 허용
    }
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/api/images/**")
                .addResourceLocations("file:///path/to/your/images/");
    }
}
