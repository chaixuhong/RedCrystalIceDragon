/**
 * Created by pangshunlong on 2017/3/31.
 */
/**
 * 设置未来(全局)的AJAX请求默认选项
 * 主要设置了AJAX请求遇到Session过期的情况
 */

$.ajaxSetup({
    complete: function (data) {
        if (data.responseJSON && data.responseJSON.ret_code && data.responseJSON.ret_code == 99) {
            layer.msg(data.responseJSON.ret_msg, {icon: 5});
            var top = getTopWinow();
            setTimeout('top.location.href = "/login";', 1500);
        }
    }
});

// 所有ajax请求的通用前置filter
$.ajaxPrefilter(function (options, originalOptions, jqXhr) {
    if (options.url.includes('http')) {
        console.log("带有http: " + options.url)
    } else {
        options.url = '/admin' + options.url
    }
})

/**
 * 在页面中任何嵌套层次的窗口中获取顶层窗口
 * @return 当前页面的顶层窗口对象
 */
function getTopWinow() {
    var p = window;
    while (p != p.parent) {
        p = p.parent;
    }
    return p;
}

