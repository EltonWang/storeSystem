/**
 * Created by ewang on 2014/10/31.
 */

var mysql = require('mysql');
var async = require('async');

var num_level = 4;
var num_pool = 3;
var pool_infos = [
    {cage: 8, layer: 9, slot: 81},
    {cage: 8, layer: 9, slot: 81},
    {cage: 8, layer: 9, slot: 81}
];

var db_config = {
    host: 'localhost',
    user: 'root',
    password: 'mangosong'
};

var connection;

/*
function handleDisconnect() {
    connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                    // the old one cannot be reused.

    connection.connect(function(err) {              // The server is either down
        if(err) {                                     // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
        console.log('db error', err);
        console.log('Error timestamp: ', (new Date).toUTCString());
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

handleDisconnect();
*/
/*

var connection  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : 'mangosong'
});
*/
/*
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'mangosong',
    transactionLimit: 50,
    useTransaction: {
        transactionLimit: 50
    }
});

connection.connect();
*/

function createConnection(){
    connection = mysql.createConnection(db_config);
    return connection;
}

function endConnection(connection){
    connection.end();
}

function init(){
    /*


    connection.query('DROP SCHEMA `testnode`', function(err, rows, fields) {
        if (err) throw err;

        console.log('The solution is: ', rows);
    });

    connection.end();
    */
    //initialAllSchema();
    //initialAllSlots();
}

function getPoolInfo(connection, callback){


    connection.query('SELECT * FROM `store`.`slot`', function(err, result, fields){
        //console.log(result);
        console.log("Get Slot data!");
        endConnection(connection);
        callback(result);
    });

}

function updateSlotInfo(place, batch, sub, cell, callback){
    connection.query('UPDATE `store`.`slot` SET batch=\'' + batch + '\', sub=\'' + sub + '\', cell=\'' + cell + '\' WHERE slotName=\'' + place + '\'', function(err, result, fields) {
        if (err) throw err;
        console.log('UPDATE `store`.`slot` SET batch=\'' + batch + '\', sub=\'' + sub + '\', cell=\'' + cell + '\' WHERE slotName=\'' + place + '\': success');
        callback(result);
    });
}

function initialAllSlots(){
    connection.query('DROP SCHEMA `store`', function(err, result, fields) {
        if(err && !err.code == 'ER_DB_DROP_EXISTS'){
            throw err;
        };
        console.log('DROP SCHEMA `store`: success');

        connection.query('CREATE SCHEMA `store`', function(err, result, fields) {
            if (err) throw err;
            console.log('CREATE SCHEMA `store`: success');

            connection.query('CREATE TABLE `store`.`slot` (`slotName` VARCHAR(45) NOT NULL, `batch` VARCHAR(45), `sub` VARCHAR(45), `cell` VARCHAR(45))', function(err, result, fields) {
                if (err) throw err;
                console.log('CREATE TABLE `store`.`slot`: success');

                insertDefaultSlotData(connection, function(){
                    console.log('All slot inserted!');
                });
            });
        });
    });
}

function insertDefaultSlotData(connection, callback){

    var asyncFuncs = [];

    for(var poolN = 1; poolN<=num_pool; poolN++){
        var poolName = 'pool' + poolN;

        var num_cage = pool_infos[poolN-1].cage;
        var num_layer = pool_infos[poolN-1].layer;
        var num_slot = pool_infos[poolN-1].slot;
        for(var cageN=1; cageN<=num_cage; cageN++){
            var cageName = poolName + '-cage' + cageN;

            for(var layerN=1; layerN<=num_layer; layerN++){
                var layerName = cageName + '-layer' + layerN;

                for(var slotN=1; slotN<=num_slot; slotN++){
                    (function(layerName, slotN){
                        asyncFuncs.push(function(taskCallback){
                            var slotName = layerName + '-slot' + (slotN < 10 ? '0'+slotN : slotN);

                            connection.query('INSERT INTO `store`.`slot` (`slotName`, `batch`, `sub`, `cell`) VALUES (\'' + slotName + '\', \'\', \'\', \'\')', function(err, result, fields) {
                                if (err) throw err;
                                //console.log('INSERT INTO `store`.`level2` (`name`, `belong`) VALUES (\' '+ layerName +'\', \'' + cageName + '\'): success');
                                taskCallback();
                            });
                        });
                    })(layerName, slotN);
                }
            }
        }
    }

    async.parallel(asyncFuncs, function(){
        if(typeof callback === 'function'){
            callback();
        }
    });
}


function initialAllSchema(){
    connection.connect();

    connection.query('DROP SCHEMA `store`', function(err, result, fields) {
        if (err) throw err;
        console.log('DROP SCHEMA `store`: success');
    });

    connection.query('CREATE SCHEMA `store`', function(err, result, fields) {
        if (err) throw err;
        console.log('CREATE SCHEMA `store`: success');
    });

    connection.query('CREATE TABLE `store`.`level1` (`id` INT NOT NULL AUTO_INCREMENT, `name` VARCHAR(45) NOT NULL, PRIMARY KEY (`id`))', function(err, result, fields) {
        if (err) throw err;
        console.log('CREATE TABLE `store`.`level1`: success');
    });

    for(var i=2; i<=num_level; i++){
        (function(index){
            var nameNullStr = index == num_level ? '' : 'NOT NULL';
            connection.query('CREATE TABLE `store`.`level' + index + '` (`name` VARCHAR(45) ' + nameNullStr + ',`belong` VARCHAR(45) NOT NULL)', function(err, result, fields) {
                if (err) throw err;
                console.log('CREATE TABLE `store`.`level' + index + '`: success');
            });
        })(i);

    }

    insertDefaultStructure(connection, function(){
        console.log('All slot inserted!');
        connection.end();
    });


}

function insertDefaultStructure(connection, callback){

    var asyncFuncs = [];

    for(var i=0; i<num_pool; i++){
        var poolName = 'pool' + (i+1);
        console.log('INSERT INTO `store`.`level' + 1 + '` (`name`) VALUES (\'' + poolName + '\')');
        connection.query('INSERT INTO `store`.`level1` (`name`) VALUES (\'' + poolName + '\')', function(err, result, fields) {
            if (err) throw err;
            console.log('INSERT INTO `store`.`level1` (`name`) VALUES (\'' + poolName + '\'): success');
        });
        console.log("Insert " + poolName + " successfully");

        var cageNum = pool_infos[i].cage;
        for(var cageN=0; cageN<cageNum; cageN++){
            var cageName = poolName + '-cage' + (cageN+1);
            connection.query('INSERT INTO `store`.`level2` (`name`, `belong`) VALUES (\' '+ cageName +'\', \'' + poolName + '\')', function(err, result, fields) {
                if (err) throw err;
                //console.log('INSERT INTO `store`.`level2` (`name`, `belong`) VALUES (\' '+ cageName +'\', \'' + poolName + '\'): success');
            });
            console.log("Insert " + cageName + " successfully");

            var layerNum = pool_infos[i].layer;
            for(var layerN=0; layerN<layerNum; layerN++){
                var layerName = cageName + '-layer' + (layerN+1);
                connection.query('INSERT INTO `store`.`level3` (`name`, `belong`) VALUES (\' '+ layerName +'\', \'' + cageName + '\')', function(err, result, fields) {
                    if (err) throw err;
                    //console.log('INSERT INTO `store`.`level2` (`name`, `belong`) VALUES (\' '+ layerName +'\', \'' + cageName + '\'): success');
                });
                console.log("Insert " + layerName + " successfully");

                var slotNum = pool_infos[i].slot;
                for(var slotN=0; slotN<slotNum; slotN++){
                    asyncFuncs.push(function(taskCallback){
                        var slotName = layerName + '-slot' + (slotN+1);
                        connection.query('INSERT INTO `store`.`level4` (`name`, `belong`) VALUES (\'\', \'' + layerName + '\')', function(err, result, fields) {
                            if (err) throw err;
                            //console.log('INSERT INTO `store`.`level2` (`name`, `belong`) VALUES (\' '+ layerName +'\', \'' + cageName + '\'): success');
                            taskCallback();
                        });
                    });

                }

            }

        }
    }

    async.parallel(asyncFuncs, function(){
        if(typeof callback === 'function'){
            callback();
        }
    });
}




module.exports = {
    init: init,
    getPoolInfo: getPoolInfo,
    updateSlotInfo: updateSlotInfo,
    initialAllSlots: initialAllSlots,
    createConnection: createConnection,
    endConnection: endConnection
};