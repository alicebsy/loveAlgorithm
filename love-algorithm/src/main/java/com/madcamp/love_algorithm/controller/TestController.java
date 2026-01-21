package com.madcamp.love_algorithm.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

// @RestController: 이 클래스가 API 요청을 받는 곳이라고 알려줌
@RestController
public class TestController {

    // 브라우저에서 'http://localhost:8080/test'로 접속하면 실행됨
    @GetMapping("/test")
    public String hello() {
        return "몰입캠프 미연시 서버가 정상 작동 중입니다!";
    }
}