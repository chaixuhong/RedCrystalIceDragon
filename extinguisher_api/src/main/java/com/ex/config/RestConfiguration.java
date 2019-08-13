package com.ex.config;

import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpEntityEnclosingRequest;
import org.apache.http.HttpRequest;
import org.apache.http.NoHttpResponseException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.HttpRequestRetryHandler;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.protocol.HttpClientContext;
import org.apache.http.config.Registry;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.conn.ConnectTimeoutException;
import org.apache.http.conn.socket.ConnectionSocketFactory;
import org.apache.http.conn.socket.PlainConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.protocol.HttpContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import javax.net.ssl.SSLException;
import javax.net.ssl.SSLHandshakeException;
import java.io.IOException;
import java.io.InterruptedIOException;
import java.net.SocketException;
import java.net.SocketTimeoutException;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;

/**
 * @author chaixuhong
 * @apiNote restTemplate配置类
 * @date 2019-08-12
 * 修改底层组件, 增加重试机制
 */
@Configuration
@Slf4j
public class RestConfiguration {
    @Autowired
    private HttpPoolProperties httpPoolProperties;

    @Bean
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate(httpRequestFactory());
        restTemplate.getMessageConverters().add(new WxMappingJackson2HttpMessageConverter());
        return restTemplate;
    }

    @Bean
    public ClientHttpRequestFactory httpRequestFactory() {
        return new HttpComponentsClientHttpRequestFactory(httpClient());
    }

    @Bean
    public HttpClient httpClient() {
        Registry<ConnectionSocketFactory> registry = RegistryBuilder.<ConnectionSocketFactory>create()
                .register("http", PlainConnectionSocketFactory.getSocketFactory())
                .register("https", SSLConnectionSocketFactory.getSocketFactory())
                .build();
        PoolingHttpClientConnectionManager connectionManager = new PoolingHttpClientConnectionManager(registry);
        connectionManager.setMaxTotal(httpPoolProperties.getMaxTotal());
        connectionManager.setDefaultMaxPerRoute(httpPoolProperties.getDefaultMaxPerRoute());
        connectionManager.setValidateAfterInactivity(httpPoolProperties.getValidateAfterInactivity());
        RequestConfig requestConfig = RequestConfig.custom()
                .setSocketTimeout(httpPoolProperties.getSocketTimeout()) //服务器返回数据(response)的时间，超过抛出read timeout
                .setConnectTimeout(httpPoolProperties.getConnectTimeout()) //连接上服务器(握手成功)的时间，超出抛出connect timeout
                .setConnectionRequestTimeout(httpPoolProperties.getConnectionRequestTimeout())//从连接池中获取连接的超时时间，超时间未拿到可用连接，会抛出org.apache.http.conn.ConnectionPoolTimeoutException: Timeout waiting for connection from pool
                .build();
        return HttpClientBuilder.create()
                .setDefaultRequestConfig(requestConfig)
                .setConnectionManager(connectionManager)
                .setRetryHandler(new HttpRequestRetryHandler() {
                    @Override
                    public boolean retryRequest(IOException exception, int executionCount, HttpContext context) {
                        log.error("请求错误，开始重试，重试次数：{}", executionCount);
                        if (executionCount > 3) { //超过重试次数，就放弃
                            return false;
                        }
                        if (exception instanceof NoHttpResponseException) {//没有响应，重试
                            return true;
                        } else if (exception instanceof ConnectTimeoutException) {//连接超时，重试
                            return true;
                        } else if (exception instanceof SocketTimeoutException) {//连接或读取超时，重试
                            return true;
                        } else if (exception instanceof SocketException) {//Socket异常，重试
                            log.error("Socket异常，重试");
                            return true;
                        } else if (exception instanceof SSLHandshakeException) {//本地证书异常
                            return false;
                        } else if (exception instanceof InterruptedIOException) {//被中断
                            return false;
                        } else if (exception instanceof UnknownHostException) {//找不到服务器
                            return false;
                        } else if (exception instanceof SSLException) {//SSL异常
                            return false;
                        } else {
                            log.error("未记录的请求异常：" + exception.getClass());
                        }
                        HttpClientContext clientContext = HttpClientContext.adapt(context);
                        HttpRequest request = clientContext.getRequest();
                        // 如果请求是幂等的，则重试
                        if (!(request instanceof HttpEntityEnclosingRequest)) return true;
                        return false;
                    }
                })
                .build();
    }

    class WxMappingJackson2HttpMessageConverter extends MappingJackson2HttpMessageConverter {
        public WxMappingJackson2HttpMessageConverter() {
            List<MediaType> mediaTypes = new ArrayList<>();
            mediaTypes.add(MediaType.TEXT_PLAIN);
            mediaTypes.add(MediaType.TEXT_HTML);  //加入text/html类型的支持
            setSupportedMediaTypes(mediaTypes);// tag6
        }
    }

}
