package com.ex.exception;


import com.ex.enums.ResultEnum;
import lombok.Getter;
/**
 * @author chaixuhong
 * @date 2019-08-12
 */
@Getter
public class AuthException extends RuntimeException {
    private int code;

    public AuthException(ResultEnum resultEnum) {
        super(resultEnum.getMessage());
        this.code = resultEnum.getCode();
    }

}
