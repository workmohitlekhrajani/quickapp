const updateSubscription = async (shopid,status,date) => {
  const config = require('../config/httpConfig.js');
  const id = config.ExtractId(shopid);
  const db = require('../database.js');
  db.query('UPDATE pins SET status=(?), update_date=(?) WHERE id=(?)',[status,date,id], function(result,fields){
      console.log('updated');
  });

};

module.exports = updateSubscription;
