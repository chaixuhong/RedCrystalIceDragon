package com.ex.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * @author chaixuhong
 * @date 2019-08-12
 */
@Configuration
@EnableSwagger2
public class SwaggerConfig {

    @Value("${swagger.enable}")
    private boolean enableSwagger;


    @Bean
    public Docket customDocket(){
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .enable(enableSwagger)
                .useDefaultResponseMessages(false)
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.ex.controller"))
                .build();

    }

    public ApiInfo apiInfo(){
        return new ApiInfoBuilder()
                .title("灭火器项目")
                .version("1.0.0")
                .contact(new Contact("ChaiXuHong",null,"75918847@qq.com"))
                .description("RestApi接口文档")
                .build();
    }
}
