var sql = require("mssql");

async function recHit(database, consultaSQL) {
    var config =
    {
        user: 'sa',
        password: 'LOperas93786',
        server: 'silema.hiterp.com',
        database: database
    };
	
	let pool = await new sql.connect(config);
    let devolver = await pool.request().query(consultaSQL);
	sql.close();
	
    return devolver;
}

async function recHitOld(database, consultaSQL) {
    var config =
    {
        user: 'sa',
        password: 'LOperas93786',
        server: 'silema.hiterp.com',
        database: database
    };
    var devolver = new Promise((dev, rej) => {
        new sql.ConnectionPool(config).connect().then(pool => {
            return pool.request().query(consultaSQL);
        }).then(result => {
            dev(result);
            sql.close();
        }).catch(err => {
            console.log(err);
            console.log("SQL: ", consultaSQL)
            sql.close();
        });
    });
    return devolver;
}

module.exports.recHit = recHit;

async function estatGet(Cli_Emp,Cli_Codi,estat) {

}
module.exports.estatGet = estatGet;
	
async function estatPut(Cli_Emp,Cli_Codi,estat) {

}
module.exports.estatPut = estatPut;



function Rs(database, consultaSQL) {
    var config =
    {
        user: 'sa',
        password: 'LOperas93786',
        server: 'silema.hiterp.com',
        database: database
    };
	
    var pool = new sql.ConnectionPool(config).connect();
    var result = pool.query(consultaSQL);

    return pool.request().query(consultaSQL);
}
module.exports.Rs = Rs;