package com.ex.mapper;

import com.ex.entity.User;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * @author chaixuhong
 * @date 2019-08-12
 */
@Mapper
public interface UserMapper {
    /**
     * 查询用户列表
     *
     * @return
     */
    List<User> findAllUser();
}
