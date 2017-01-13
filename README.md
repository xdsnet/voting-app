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
1. 使用了`mongodb`数据库服务用于持久化数据,数据利用[https://mlab.com](https://mlab.com)提供的500MB免费数据空间部署(因为herokuapp上直接使用mongodb需要付费！这里是免费的，用着任务展示已经足够)，使用`mongodb`模块访问数据库服务，你也可以使用其他mongodb数据服务。
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

## 待完善或补充（不一定实施）

1. mongodb切换为postgresql进行数据存储的版本设计（herokuapp提供免费的postgresql），
1. 对stormpath的相关页面定制（因为strompath上相关文档缺少，它文档中关于相关页面定制以ejs举例，但其实际实现模板又是jade，再有jade最近还闹了更名为pug的事情，搞不懂啦。）
1. 处理逻辑的优化，按理说一些逻辑应该放在后端处理，但现在是放在前端的，比如投票，投票数量的增加应该放在后端数据存储时处理，现在是在前端，这样有可能数据覆盖问题（例如不同的人对同一项投票的相关选项进行投票，统计的结果可能不是预期的）


