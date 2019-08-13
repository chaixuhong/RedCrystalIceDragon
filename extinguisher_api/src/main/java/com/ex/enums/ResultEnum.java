package com.ex.enums;

import lombok.Getter;

/**
 * @author chaixuhong
 * @date 2019-08-12
 */
@Getter
public enum ResultEnum {
    /**
     * SUCCESS
     */
    SUCCESS(1, "SUCCESS"),
    /**
     * 服务器异常
     */
    SERVER_ERROR(500, "服务器异常");

    private Integer code;

    private String message;

    ResultEnum(Integer code, String message) {
        this.code = code;
        this.message = message;
    }
}
