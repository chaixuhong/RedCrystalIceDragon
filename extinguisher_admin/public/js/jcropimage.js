/** 
   公用的jcrop裁剪方法，主要用于裁剪弹出页面
   1、页面引入 <script src="/admin/js/jquery.form.js"></script>
   
   2、页面初始化选择图片的按钮事件
        $(function () {
            $("#btnaddfile").click(function () {
                $("input[type=file]").click();
            });
        });

   3、添加html模块代码
        <form class="form-horizontal" role="form" action='/admin/jcrop/add_local_file' method="post" id="localfileform" enctype="application/x-www-form-urlencoded">
            <input type="hidden" id="PortalBannerUrl" name="PortalBannerUrl" value="" />
            <div id="div_image" style="float: left;"></div>
            <input type="file" id="ImageUrl" name="ImageUrl" accept="image/png,image/jpg" onchange="OpenJcropImage(this,'0_0_150_150','150_150','1_1')" value="" style="width: 0px; display: none" />
            <a id="btnaddfile" href="javascript:;">更改头像</a>
        </form>

   4、参数说明 OpenJcropImage(this,'0_0_150_150','150_150','1_1')
      0_0_150_150 开始x坐标_开始y坐标_宽度px_高度px
      150_150 最小宽高
      1_1 宽高比
   
   5、页面增加，用于存储url地址和展示裁剪后的图片
        function setImageUrl(url) {
            $("#sys_photo").val(url); //存储url地址
            $("#img_sys_photo").html('<img src="' + url + '"/>'); //展示裁剪后的图片
        }

 */

//选择图片后，上传到本地后再进行crop
function OpenJcropImage(file, setSelect, minSize, aspectRatio) {
    var options = {
        dataType: "json",
        success: function (d) {
            switch (d.ret_code) {
                case 0:
                    layer.open({
                        title: '选择裁剪图片',
                        type: 2,
                        area: ['720px', '650px'],
                        content: '/admin/jcrop/add_file?' +
                            'path=' + d.path +
                            "&showpath=" + d.showpath +
                            "&ratio=" + d.ratio +
                            "&wh=" + d.wh +
                            '&setSelect=' + setSelect +
                            '&minSize=' + minSize +
                            '&aspectRatio=' + aspectRatio,
                        shade: 0.5,
                        end: function () {
                            delLocalImg(d.path);
                        }
                    });
                    break;
                case 1:
                    layer.msg('请选择png类型图片', {
                        icon: 5
                    });
                    delLocalImg(d.path);
                    break;
                case 2:
                    layer.msg('请选择长宽尺寸大于300px的图片', {
                        icon: 5
                    });
                    delLocalImg(d.path);
                    break;
                case 3:
                    layer.msg('请选择小于3M的图片', {
                        icon: 5
                    });
                    delLocalImg(d.path);
                    break;
            }
        },
        error: function (err) {

        }
    };
    $('#localfileform').ajaxSubmit(options);
}

function delLocalImg(path) {
    $.ajax({
        url: '/jcrop/del_add_localfile?path=' + path,
        type: 'get',
        dataType: 'json',
        data: '',
        success: function (data) {}
    });
}