var _ = require('lodash');
var async = require('async');
var jsforce = require('jsforce');

var conf = {
  loginUrl:"https://test.salesforce.com",
  username:"gmoyer@candoris.com.tester",
  password:"RIe3s5LMwLRFteGnu4"
};
var conn = new jsforce.Connection(config.sf.oauth2);

function loginToSF(cb) {
  logger.info('Logging into Salesforce');
  conn.login(config.sf.user, config.sf.password, function(err, userInfo) {
    if (err) {
      logger.error('Error logging into Salesforce');
    } else {
      logger.info('Logged into Salesforce');
    }
    cb(err, userInfo);
  });
}

function saveTimesheetSubmission(userInfo, cb) {
  conn.sobject("Account").create(message, function(err, ret) {
    if (err || !ret.success) {
      return console.error(err, ret);
    }
    console.log("Created record id : " + ret.id);
    cb(err, ret);
  });
});
}

function logOutOfSF(syncResults, cb) {
  logger.info('Logging out of Salesforce');
  conn.logout(function(err) {
    if (err) {
      logger.error('Error logging out of Salesforce');
    } else {
      logger.info('Logged out of Salesforce');
    }
    cb(err);
  });
}

var tasks = [
  async.apply(loginToSF),
  async.apply(saveTimesheetSubmission),
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