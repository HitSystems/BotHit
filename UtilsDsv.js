
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