package com.ex.entity;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.io.Serializable;
/**
 * @author chaixuhong
 * @date 2019-08-12
 */
@ApiModel("用户实体类")
@Data
public class User implements Serializable {

    private static final long serialVersionUID = 5991756671057448329L;

    @ApiModelProperty(value = "用户id", example = "1", position = 1)
    private Long id;

    @ApiModelProperty(value = "账号", example = "13332452235", position = 2)
    private String account;

    @ApiModelProperty(value = "密码", example = "11ss33", position = 3)
    private String password;

    @ApiModelProperty(value = "昵称", example = "托克托", position = 4)
    private String nickName;

    @ApiModelProperty(value = "性别", example = "0 //0:女，1:男", position = 5)
    private Integer sex;

    @ApiModelProperty(value = "邮箱", example = "75918847@qq.com", position = 6)
    private String email;
}
