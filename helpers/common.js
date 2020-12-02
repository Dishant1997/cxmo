const date = require('date-and-time');
const now = new Date();
//current date 
var todayDate = date.format(now, 'YYYY-MM-DD HH:mm:ss');
// module.exports.todayDate = todaydate;

const stringReplace = function(string) {
    // return string.replace("'s","&rsquo;s");
      return string.replace(/['"]+/g, '&rsquo;');
  };
module.exports = {
    todayDate,
    stringReplace
}