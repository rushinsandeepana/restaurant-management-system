package com.rms.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@ConfigurationProperties(prefix = "rms.cors")
public record CorsProperties(List<String> allowedOrigins) {}
