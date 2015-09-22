var express = require('express');
var _ = require('lodash');
var async = require('async');
var jsforce = require('jsforce');

var conf = {
  loginUrl: "https://test.salesforce.com",
  username: "gmoyer@candoris.com.tester",
  password: "RIe3s5LMwLRFteGnu4",
  token: "HBXWxKy0ONzDdGrEWtfr8u35C",
  PORT:8000
};
var conn = new jsforce.Connection(conf);
var express = require('express');
var app = express();

app.get('/sms', function(req, res) {
  console.log('Got it!');
  pushTimesheetToSalesforce();
  res.sendStatus(200)
});

function loginToSF(cb) {
  console.log('Logging into Salesforce');
  conn.login(conf.username, conf.password + conf.token, function(err, userInfo) {
    if (err) {
      console.log('Error logging into Salesforce');
    } else {
      console.log('Logged into Salesforce');
    }
    cb(err, userInfo);
  });
}

function createTimesheet(userInfo, cb) {
  conn.apex.get("/timesheets/", function(err, res) {
  if (err) { return console.error(err); }
  console.log("response: ", res);
});
}

function logOutOfSF(syncResults, cb) {
  console.log('Logging out of Salesforce');
  conn.logout(function(err) {
    if (err) {
      console.log('Error logging out of Salesforce');
    } else {
      console.log('Logged out of Salesforce');
    }
    cb(err);
  });
}

function pushTimesheetToSalesforce() {

  var tasks = [
    async.apply(loginToSF),
    async.apply(createTimesheet),
    async.apply(logOutOfSF)
  ];
  async.waterfall(tasks, function(err) {
    if (err) {
      console.error('Error in product sync job ', err);
      process.exit(1);
    } else {
      process.exit(0);
    }
  });
}

var server = app.listen(conf.PORT);
console.log("Express started on %s", conf.PORT);