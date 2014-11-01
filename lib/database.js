/**
 * Created by ewang on 2014/10/31.
 */

var mysql = require('mysql');

var num_level = 4;
var num_pool = 3;
var pool_info = [
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

        var cageNum = pool_info[i].cage;
        for(var cageN=0; cageN<cageNum; cageN++){
            var cageName = poolName + '-cage' + (cageN+1);
            connection.query('INSERT INTO `store`.`level2` (`name`, `belong`) VALUES (\' '+ cageName +'\', \'' + poolName + '\')', function(err, result, fields) {
                if (err) throw err;
                //console.log('INSERT INTO `store`.`level2` (`name`, `belong`) VALUES (\' '+ cageName +'\', \'' + poolName + '\'): success');
            });
            console.log("Insert " + cageName + " successfully");

            var layerNum = pool_info[i].layer;
            for(var layerN=0; layerN<layerNum; layerN++){
                var layerName = cageName + '-layer' + (layerN+1);
                connection.query('INSERT INTO `store`.`level3` (`name`, `belong`) VALUES (\' '+ layerName +'\', \'' + cageName + '\')', function(err, result, fields) {
                    if (err) throw err;
                    //console.log('INSERT INTO `store`.`level2` (`name`, `belong`) VALUES (\' '+ layerName +'\', \'' + cageName + '\'): success');
                });
                console.log("Insert " + layerName + " successfully");

                var slotNum = pool_info[i].slot;
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
    init: init
};