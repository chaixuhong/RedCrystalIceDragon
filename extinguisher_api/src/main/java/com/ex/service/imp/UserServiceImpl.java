package com.ex.service.imp;

import com.ex.entity.User;
import com.ex.mapper.UserMapper;
import com.ex.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

/**
 * @author chaixuhong
 * @date 2019-08-12
 */
@Service
public class UserServiceImpl implements UserService {

    @Resource
    private UserMapper userMapper;

    /**
     * 查询所有用户
     *
     * @return
     */
    @Override
    public List<User> findAllUser() {
        return userMapper.findAllUser();
    }
}
