Some demos of Node
* chatrooms (基于node.js构建的具有多个房间的聊天室)
 + socket.IO
 + 将消息和昵称/房间变更请求传给服务器
 + 在用户界面显示中显示消息及可用房间
* simpleWebServer (用回调处理一次性事件)
 + 异步获取存放在JSON文件中的文章的标题和HTML模板
 + 把标题组装到HTML页面里
 + 把HTML页面发送给用户
* echo_server (用事件发射器处理重复性事件)
 + 事件发射器
 + 使用方法：在终端输入`telnet 127.0.0.1 8888`
* Watcher (扩展事件发射器的功能)
 + 效果：watch里的文件全部转移变成done里的小写文件
* random_story (在一个简单的程序中实现串行化流程控制)
 + 效果：随机选择的RSS预定源中获取一篇文章的标题和URL
* word_count (在一个简单的程序中实现并行化流程控制)
 + 效果：控制台中统计所有单词分别出现的总数
