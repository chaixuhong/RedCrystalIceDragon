package com.ex.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

/**
 * @author chaixuhong
 * @apiNote 【AOP】接口请求url、参数、请求时间记录日志
 * @date 2019-08-12
 */
@Component
@Aspect
@Slf4j
public class AuthorizeAspect {

    @Value("${spring.profiles.active}")
    private String environment;

    private static final long SLOW_SQL_TIME = 3000;

    @Pointcut("execution(public * com.ex.controller.*.*(..))")
    public void verify() {
    }

    /**
     * 【切点】请求前拦截与记录
     */
    @Before("verify()")
    public void doVerify() {
        log.info(String.format("当前启动环境:%s", environment));
        System.out.println("方法执行前");
        System.out.println("此处进行身份校验");
        long requestTime = System.currentTimeMillis();
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();
        request.setAttribute("requestTime", requestTime);
    }

    /**
     * 【切点】请求后拦截与记录
     */
    @After("verify()")
    public void afterVerify() {
        System.out.println("方法执行后");
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();
        Long requestTime = (Long) request.getAttribute("requestTime");
        long responseTime = System.currentTimeMillis() - requestTime;
        if (responseTime > SLOW_SQL_TIME) {
            log.warn(String.format("接口返回较慢-耗时:%s毫秒", responseTime));
        } else {
            log.info(String.format("接口请求耗时:%s毫秒", responseTime));
        }
    }
}
