package com.ex.utils;

import com.ex.enums.ResultEnum;
import com.ex.vo.ResultVO;

/**
 * @author chaixuhong
 * @apiNote 数据返回标准化工具类
 * @date 2019-08-12
 */
public class ResponseUtils {
    public static ResultVO success() {
        ResultVO result = new ResultVO();
        result.setCode(ResultEnum
                .SUCCESS.getCode());
        result.setErrMsg(ResultEnum.SUCCESS.getMessage());
        return result;
    }

    public static ResultVO success(Object object) {
        ResultVO result = new ResultVO();
        result.setCode(ResultEnum.SUCCESS.getCode());
        result.setErrMsg(ResultEnum.SUCCESS.getMessage());
        result.setData(object);
        return result;
    }

    public static ResultVO error(ResultEnum error) {
        ResultVO result = new ResultVO();
        result.setCode(error.getCode());
        result.setErrMsg(error.getMessage());
        return result;
    }

    public static ResultVO error(Integer code, String message) {
        ResultVO result = new ResultVO();
        result.setCode(code);
        result.setErrMsg(message);
        return result;
    }

}
