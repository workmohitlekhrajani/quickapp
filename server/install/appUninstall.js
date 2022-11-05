const appUninstall = async (shop) => {
  const db = require("../database.js");
  db.query(
    "UPDATE pins SET status, WHERE shop=(?)",
    ["CANCELED", shop],
    function (result, fields) {
      console.log("we got uninstall");
    }
  );
};

module.exports = appUninstall;
