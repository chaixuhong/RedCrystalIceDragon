package com.ex.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * @author chaixuhong
 * @apiNote http请求配置类
 * @date 2019-08-12
 */
@Component
@ConfigurationProperties(prefix = "http-config")
@Data
public class HttpPoolProperties {
 
    private Integer maxTotal;
    private Integer defaultMaxPerRoute;
    private Integer connectTimeout;
    private Integer connectionRequestTimeout;
    private Integer socketTimeout;
    private Integer validateAfterInactivity;
 
}