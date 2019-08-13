# 灭火器项目Api接口层
基于Spring Boot 2.0 搭建的Restful规范的接口服务
## 项目架构：
    |aspect: aop负责处理用户权限校验
    |   
    |config: 项目依赖定制化配置
    |
    |controller: 路由层
    |
    |entity: 实体类
    |
    |enums: 错误类型枚举类
    |
    |exception: 自定义异常
    |
    |mapper: mybatis映射类
    |
    |service: 接口类
    |
    |utils: 工具类
    |
    |vo: 输出包装类
    

## 约定    

数据库层面: mybatis+druid连接池+mysql ， 由于甲方未提供redis服务，故暂时不做缓存考虑

httpClient: 请使用springboot自带restTemplate,已定制化修改优化，无漏洞

接口输出: 请统一使用VO包装类进行包装，由ResponseUtil类进行封装输出统一标准化json   

异常处理: 请统一使用自定义异常进行抛出，错误码与错误信息在枚举类中进行枚举；在抛出异常时，请同时写入日志文件

接口文档: 统一使用swagger进行api与entity类注解，以生成标准接口文档

## 文档与监控

接口文档url: http://ip:port/swagger-ui.html

数据库监控url: http://ip:port/druid/    用户名密码在配置文件中 ，可在此处监控sql执行情况，慢sql问题

## 备注

此项目最终会已jar的方式运行，所以请不要与服务器的tomcat端口一致，tomcat已单独封装于jar内，如需定制化配置，请在config层增加