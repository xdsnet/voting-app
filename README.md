# voting-app 任务 
完成voting-app 任务

服务演示地址[https://xdsvotingapp.herokuapp.com/](https://xdsvotingapp.herokuapp.com/)

## 任务需求
1. 作为一个已授权的用户，我可以保持我（发起）的投票，并可以在稍后访问它们。
1. 作为一个已授权的用户，我可以分享我的投票给好友。
1. 作为一个已授权的用户，我可以看到我投票的汇总结果。
1. 作为一个已授权的用户，我可以删除决定不想要的投票。
1. 作为一个已授权的用户，我可以创建（发起）一个包含任意数量选项的投票。
1. 无论是否授权，我都可以查看投票并参与任何人的投票。
1. 无论是否授权，我都可以在图表中查看投票结果。（可以通过使用 Chart.js 或 Google Charts 实现）
1. 作为一个已授权的用户，如果我不喜欢投票中的选项，我可以自己创建一个新的选项。

## 实现说明
1. 使用了`mongodb`数据库服务用于持久化数据,数据利用[https://mlab.com](https://mlab.com)提供的500MB免费数据空间部署，使用`mongoose`访问数据库服务，你也可以使用其他mongodb数据服务。
1. 使用`ejs`作为模版处理模块
1. 使用`stormpath`实现注册和认证处理(相关数据信息等存储在stormpath网站上，这样减轻了本地处理的繁琐。)

## 关于`.env`文件或者环境变量
  程序因为用到`mongodb`和`stormpath`需要用到一些环境变量，这些环境变量可以利用`.env`文件设置（程序中利用`dotenv`模块引入），也可以通过其他途径给出（只要保证程序运行前定义了，且能被程序以环境变量的形式访问即可）。用到的变量有:

环境变量名 | 变量值形式（缺省值）| 是否必须 
 ------- |-------------------- | -------
 `PORT` | 数字值，缺省80 | 否 
 `MONGODB_URI` | 字符串，形如`mongodb://<User>:<UserPassowrd>@<Host>/<Path>` | 是 
 `STORMPATH_CLIENT_APIKEY_ID` | 字符串值，由stormpath提供 | 是 
 `STORMPATH_CLIENT_APIKEY_SECRET` | 字符串值，由stormpath提供 | 是 
 `STORMPATH_APPLICATION_HREF` | `https://api.stormpath.com/v1/applications/<字符串>`，其中的字符串由stormpath提供 | 是 


