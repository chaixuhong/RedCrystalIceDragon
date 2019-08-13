package com.ex.config;

import com.alibaba.druid.support.http.StatViewServlet;
import com.alibaba.druid.support.http.WebStatFilter;
import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

/**
 * @author chaixuhong
 * @apiNote druid连接池web监控配置类
 * @date 2019-08-12
 */
@Component
@ConfigurationProperties(prefix = "spring.datasource.druid")
@Data
public class DruidConfig {
    private final Logger logger = LoggerFactory.getLogger(DruidConfig.class);
    /**
     *   Druid 监控 Servlet 配置参数
     */
    private String druidRegistrationUrl;
    private boolean resetEnable;
    private String loginUsername;
    private String loginPassword;
    /**
     *  Filters 配置参数
     */
    private String filtersUrlPatterns;
    private String exclusions;
    private int sessionStatMaxCount;
    private boolean sessionStatEnable;
    private String principalSessionName;
    private boolean profileEnable;

    /**
     * 配置druid监控
     *
     * @return
     */
    @Bean
    public ServletRegistrationBean druidServlet() {
        ServletRegistrationBean servletBean = new ServletRegistrationBean(new StatViewServlet(), druidRegistrationUrl);
        servletBean.addInitParameter("resetEnable", String.valueOf(resetEnable));
        servletBean.addInitParameter("loginUsername", loginUsername);
        servletBean.addInitParameter("loginPassword", loginPassword);
        return servletBean;
    }

    /**
     * 配置druid监听过滤
     *
     * @return
     */
    @Bean
    public FilterRegistrationBean filterRegistration() {
        FilterRegistrationBean filterRegistrationBean = new FilterRegistrationBean(new WebStatFilter());
        filterRegistrationBean.addUrlPatterns(filtersUrlPatterns);
        filterRegistrationBean.addInitParameter("exclusions", exclusions);
        filterRegistrationBean.addInitParameter("sessionStatMaxCount", String.valueOf(sessionStatMaxCount));
        filterRegistrationBean.addInitParameter("sessionStatEnable", String.valueOf(sessionStatEnable));
        filterRegistrationBean.addInitParameter("principalSessionName", principalSessionName);
        filterRegistrationBean.addInitParameter("profileEnable", String.valueOf(profileEnable));
        return filterRegistrationBean;
    }

}