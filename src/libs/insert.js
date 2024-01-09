const connection = require("./../config/server");

async function Insert(params) {
  console.log("Function Insert");

  const table = params.table;
  const data = params.data;

  if (table !== undefined && data !== undefined) {
    const columnsData = Object.keys(data);
    const valuesData = Object.values(data);

    const query = "INSERT INTO " + table + " (" + columnsData.join(",") + ") VALUES ('" + valuesData.join("','") + "') RETURNING id";

    console.log(query);

    return new Promise(function (resolve, reject) {
      connection.query(query, function (error, results, fields) {
        if (error) {
          console.log(`Error Insert Equipament: ${error}`);
          return reject(error);
        }
        return resolve(results);
      });
    });
    return {};
  } else {
    return "No Data Received!";
  }
}

module.exports = Insert;
