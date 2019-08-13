package com.ex.service;

import com.ex.entity.User;

import java.util.List;

/**
 * @author chaixuhong
 * @date 2019-08-12
 */
public interface UserService {
    /**
     * find user list
     *
     * @return
     */
    List<User> findAllUser();
}
