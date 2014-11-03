/**
 * Created by ewang on 2014/10/31.
 */

var mysql = require('mysql');

var num_level = 4;
var num_pool = 3;
var pool_infos = [
    {cage: 8, layer: 9, slot: 81},
    {cage: 8, layer: 9, slot: 81},
    {cage: 8, layer: 9, slot: 81}
];


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

function getPoolInfo(callback){
    connection.query('SELECT * FROM `store`.`slot`', function(err, result, fields){
        //console.log(result);
        callback(result);
    });
}

function updateSlotInfo(name, place, callback){
    connection.query('UPDATE `store`.`slot` SET name=\'' + name + '\' WHERE slotName=\'' + place + '\'', function(err, result, fields) {
        if (err) throw err;
        console.log('UPDATE `store`.`slot` SET name=`' + name + '` WHERE slotName=`' + place + '`: success');
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

            connection.query('CREATE TABLE `store`.`slot` (`name` VARCHAR(45), `slotName` VARCHAR(45) NOT NULL)', function(err, result, fields) {
                if (err) throw err;
                console.log('CREATE TABLE `store`.`slot`: success');

                insertDefaultSlotData(connection);
            });
        });
    });

}

function insertDefaultSlotData(connection){
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
                    var slotName = layerName + '-slot' + slotN;

                    connection.query('INSERT INTO `store`.`slot` (`name`, `slotName`) VALUES (\'\', \'' + slotName + '\')', function(err, result, fields) {
                        if (err) throw err;
                        //console.log('INSERT INTO `store`.`level2` (`name`, `belong`) VALUES (\' '+ layerName +'\', \'' + cageName + '\'): success');
                    });
                }
            }
        }
    }
}


function initialAllSchema(){
    //connection.connect();

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

    insertDefaultStructure(connection);

    connection.end();
}

function insertDefaultStructure(connection){
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
                    var slotName = layerName + '-slot' + (slotN+1);
                    connection.query('INSERT INTO `store`.`level4` (`name`, `belong`) VALUES (\'\', \'' + layerName + '\')', function(err, result, fields) {
                        if (err) throw err;
                        //console.log('INSERT INTO `store`.`level2` (`name`, `belong`) VALUES (\' '+ layerName +'\', \'' + cageName + '\'): success');
                    });
                }
                console.log("Insert " + slotName + " successfully");
            }

        }
    }
}




module.exports = {
    init: init,
    getPoolInfo: getPoolInfo,
    updateSlotInfo: updateSlotInfo
};