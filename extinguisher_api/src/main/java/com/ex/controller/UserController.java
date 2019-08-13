package com.ex.controller;

import com.ex.entity.User;
import com.ex.service.UserService;
import com.ex.vo.ResultVO;
import io.swagger.annotations.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import static com.ex.utils.ResponseUtils.*;
import javax.annotation.Resource;
import java.util.List;

/**
 * @author chaixuhong
 * @date 2019-08-12
 */
@RestController
@RequestMapping("/user")
@Api(tags = {"用户中心接口"}, value = "涉及用户行为相关接口部分")
public class UserController {

    @Resource
    private UserService userService;

    @ApiOperation(value = "获取用户列表")
    @ApiResponses({
            @ApiResponse(code = 200, message = "Http请求成功状态码，Http状态码不用于与业务相关，无论对错均为200，除非出现网络状况，或者服务器无响应"),
            @ApiResponse(code = 500, message = "{\"code\":500,\"errMsg\":\"服务器内部错误\",\"data\":null}"),
            @ApiResponse(code = 1000, message = "{\"code\":1000,\"errMsg\":\"token缺失或错误\",\"data\":null}"),
    })
    @ApiImplicitParams({
            @ApiImplicitParam(paramType = "query", dataType = "string", name = "token", value = "用户令牌", required = true, example = "6968AF83AAFEB30C9B3F32CD2FB86C83F45CD4078A615DA86620FF25BC061418"),
            @ApiImplicitParam(paramType = "query", dataType = "string", name = "version", value = "用户版本", required = true, example = "0.0.1")
    })
    @GetMapping("")
    public ResultVO<List<User>> getAllUser(){
        return success(userService.findAllUser());
    }
}
