package com.ex.exception.handler;


import com.ex.enums.ResultEnum;
import com.ex.exception.AuthException;
import com.ex.exception.GlobalException;
import com.ex.utils.ResponseUtils;
import com.ex.utils.UrlUtil;
import com.ex.vo.ResultVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.servlet.http.HttpServletRequest;
/**
 * @author chaixuhong
 * @date 2019-08-12
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResultVO handler(HttpServletRequest request, Exception e) {
        if (e instanceof AuthException) {
            AuthException authException = (AuthException) e;
            log.error("【认证异常】: err = {} url = {}", e.getMessage(), UrlUtil.getRequestUrl(request));
            return ResponseUtils.error(authException.getCode(), e.getMessage());
        } else if (e instanceof GlobalException) {
            GlobalException globalException = (GlobalException) e;
            log.error("【全局自定义异常】: err = {} url = {}", e.getMessage(), UrlUtil.getRequestUrl(request));
            return ResponseUtils.error(globalException.getCode(), e.getMessage());
        } else {
            e.printStackTrace();
            log.error("【未捕获异常】: err = {} url = {}", e.getMessage(), UrlUtil.getRequestUrl(request));
            return ResponseUtils.error(ResultEnum.SERVER_ERROR);
        }
    }
}
