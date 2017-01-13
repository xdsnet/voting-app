var express = require('express');
var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var stormpath = require('express-stormpath');
var app = express();
var bodyParser = require('body-parser');
var _ = require('lodash');
require('dotenv').load();

var mongoURL = process.env.MONGODB_URI;

// 配置 stormpath 
app.use(stormpath.init(app, {
    website: true,
    apiKey: {
      id: process.env.STORMPATH_CLIENT_APIKEY_ID, 
      secret: process.env.STORMPATH_CLIENT_APIKEY_SECRET
    },
    application: {
      href: process.env.STORMPATH_APPLICATION_HREF
   }
   //*
   ,
   web:{
     login:{
       title:"登录",
       form:{
         fields:{
           login:{
             label:"用户名(邮件格式)",
             placeholder:"email@XXXX.com"
           }
         },
         password:{
           label:"登录密码"
         }
       }
     },
     register:{
       title:"注册用户",
       form:{
         fields:{
            givenName: {
            enabled: false
          },
          surname: {
            enabled: false
          },
          email:{
             label:"用户名(邮件格式)",
             placeholder:"email@XXXX.com"
           }
         },
         password:{
           label:"登录密码"
         }
       }
     }
   }
   //*/
}));

app.set('port', (process.env.PORT || 80));

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 设置模板目录和处理技术
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', stormpath.getUser, function(request, response) {
  if (request.user) {
		response.render('pages/index', { user : request.user.email });
	}
	else {
		response.render('pages/index', { user :"_null_@"+request.ip  });
	}
});

app.get('/singlePoll', stormpath.getUser, function(request, response) {
  if (request.user) {
		response.render('pages/singlePoll', { user : request.user.email });
	}
	else {
		response.render('pages/singlePoll', { user : "_null_@"+request.ip });
	}
});

app.get('/createPoll', stormpath.loginRequired, function(request, response) {
  response.render('pages/createPoll',{ user : request.user.email });
});

app.get('/deletePoll', stormpath.loginRequired, function(req, res) {
      var id = req.query.id;
    MongoClient.connect(mongoURL, function(err, db) {
        assert.equal(null, err);
        deletePoll(db, function() {
            db.close();
            res.redirect("/");
        }, id);
    });
});

app.get('/myPolls', stormpath.loginRequired, function(request, response) {
  response.render('pages/myPolls',{ user : request.user.email });
});

// 为认证用户获得投票项目
app.get('/getMyPolls', stormpath.getUser, function(req, res){
  MongoClient.connect(mongoURL, function(err, db) {
    assert.equal(null, err);
    findUserPolls(db, function(polls) {
        db.close();
        res.json({"polls":polls});
    }, req.user.email);
  });
});

// 获取所有的投票项目
app.get('/getPolls', function(req, res){
  MongoClient.connect(mongoURL, function(err, db) {
    assert.equal(null, err);
    findPolls(db, function(polls) {
        db.close();
        res.json({"polls":polls});
    });
  });
});

// 更新投票结果
app.post('/updatePoll', function(req, res){
    MongoClient.connect(mongoURL, function(err, db) {
    assert.equal(null, err);
    updateTotals(db, function() {
        db.close();
        res.json({"updated":"true"});
    }, req.body);
  });
});

// 获得单个投票项目信息
app.get('/getSinglePoll', function(req, res){
  MongoClient.connect(mongoURL, function(err, db) {
    assert.equal(null, err);
    findSinglePoll(db, function(poll) {
        db.close();
        res.json({"poll":poll});
    }, req.query.id);
  });
});

// 建立一个新的投票项目
app.get('/newPoll', stormpath.loginRequired, function(req, res){
  MongoClient.connect(mongoURL, function(err, db) {
    assert.equal(null, err);
    insertDocument(db, function() {
        db.close();
        res.redirect('/');
    }, req.query.question, req.query.answers, req.user.email);
  });
});

app.on('stormpath.ready', function() {
  app.listen(app.get('port'), function() {
    console.log('程序监听端口为', app.get('port'));
  });
});

// query the database to pull all of the polls
var findPolls = function(db, callback) {
   var polls = [];
   var cursor = db.collection('votingdb').find( );
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         polls.push(doc);
      } else {
         callback(polls);
      }
   });
};

// 查询一个具体的投票项目数据信息
var findSinglePoll = function(db, callback, id) {
  var cursor = db.collection('votingdb').findOne({"_id":new ObjectId(id)}, function(err, doc) {
       callback(doc);
    });
  };
  
// 插入投票信息到具体项目
var insertDocument = function(db, callback, question, answers, username) {
  var tempAnswers = answers.split(';');
  var answers=[];
  var userlist=[];
  for(var i = 0; i < tempAnswers.length; i++){
    var tmp=_.trim(tempAnswers[i]);
    if(tmp!=""){
      answers.push( {"answer":tmp, "total":0});
    }
  }
   db.collection('votingdb').insertOne( {
     "question" : question,
     "answers" : answers,
     "user" : username,
     "userlist":userlist
   }, function(err, result) {
    assert.equal(err, null);
    callback();
  });
};

// 搜索某用户创建的投票项目
var findUserPolls = function(db, callback, username) {
  var polls = [];
   var cursor =db.collection('votingdb').find( { "user": username } );
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         polls.push(doc);
      } else {
         callback(polls);
      }
   });
};

// 删除投票项目
var deletePoll = function(db, callback, id) {
   db.collection('votingdb').deleteMany(
      {_id: new ObjectId(id)},
      function(err, results) {
         //console.log(results);
         callback();
      }
   );
};

// 更新记录
var updateTotals = function(db, callback, pollData) {
   db.collection('votingdb').updateOne(
      {_id: new ObjectId(pollData.poll._id)},
      {
        $set: {"answers" : pollData.poll.answers,"userlist":pollData.poll.userlist}
      }, {upsert:true}, function(err, results) {
      //console.log(results);
      callback();
   });
};