# Apitest
基于HTML5、Angularjs、Ajax创建的一个用于测试restful api的页面，有点类似postman的功能，支持POST、GET、PUT、DELETE方法，支持添加请求参数、支持添加请求头，支持application/x-www-form-urlencoded和application/json编码格式，支持将历史请求记录保存到本地存储。 

注意，由于该测试工具基于页面请求的，最好将其放到项目中一起部署，如果单独使用有可能浏览器报出跨域问题而无法测试接口（如果你们服务端没设置Access-Control-Allow-Origin: * 允许跨域的话会出现此问题）。

### 请求参数
![image](https://github.com/hqq518/Apitest/blob/master/images/1.jpg)

### 响应结果
![image](https://github.com/hqq518/Apitest/blob/master/images/2.jpg)
