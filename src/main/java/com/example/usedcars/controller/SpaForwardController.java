package com.example.usedcars.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

    @GetMapping(value = {
            "/",
            "/listings",
            "/listings/**",
            "/login",
            "/register",
            "/dashboard",
            "/my-listings",
            "/my-listings/**",
            "/create-listing",
            "/edit-listing/**",
            "/profile",
            "/favorites",
            "/admin",
            "/admin/**"
    })
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}
