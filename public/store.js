/**
 * Created by Ewang on 2014/11/2.
 */

/**
 * Module for store system.
 */
var storeModule = (function (storeModule) {

    storeModule.storeStruc = {'level1': []};
    storeModule.currentPullObj;
    storeModule.currentCageObj;
    storeModule.currentLayerObj;

    var buildPoolsLevel = function(data){
        //console.log(data);
        compilePoolData(data);

        var h = [];
        _.each(storeModule.storeStruc.level1, function(level1){
            var poolName = level1.name;
            h.push('<li role="presentation"><a role="menuitem" tabindex="-1" href="#">' + poolName + '</a></li>');
        });

        $('div.level1 ul.dropdown-menu').html(h.join(''));

        setTimeout(function(){
            bindLeve1Event();
        }, 0);

    };

    var bindLeve1Event = function(){
        $('div.level1 .dropdown-menu li').click(function( event ) {
            var $target = $( event.currentTarget );
            $('div.level2 button').prop('disabled', false);
            var poolName = $target.find('a').html();

            var poolObj = _.find(storeModule.storeStruc.level1, function(level){
                return level.name == poolName;
            });

            storeModule.currentPullObj = poolObj;

            var h = [];
            _.each(poolObj.level2, function(level2){
                var cageName = level2.name;
                h.push('<li role="presentation"><a role="menuitem" tabindex="-1" href="#">' + cageName + '</a></li>');
            });

            $('div.level2 ul.dropdown-menu').html(h.join(''));

            setTimeout(function(){
                bindLeve2Event(poolObj);
            }, 0);
        });
    };

    var bindLeve2Event = function(poolObj){
        $('div.level2 .dropdown-menu li').click(function( event ) {
            var $target = $( event.currentTarget );
            $('div.level3 button').prop('disabled', false);
            var cageName = $target.find('a').html();

            var cageObj = _.find(storeModule.currentPullObj.level2, function(level){
                return level.name == cageName;
            });

            storeModule.currentCageObj = cageObj;

            var h = [];
            _.each(cageObj.level3, function(level2){
                var cageName = level2.name;
                h.push('<li role="presentation"><a role="menuitem" tabindex="-1" href="#">' + cageName + '</a></li>');
            });

            $('div.level3 ul.dropdown-menu').html(h.join(''));

            setTimeout(function(){
                bindLeve3Event();
            }, 0);
        });
    };

    var bindLeve3Event = function(poolObj){
        $('div.level3 .dropdown-menu li').click(function( event ) {
            var $target = $( event.currentTarget );
            $('form.level4').show();
            var layerName = $target.find('a').html();

            var layerObj = _.find(storeModule.currentCageObj.level3, function(level){
                return level.name == layerName;
            });

            storeModule.currentLayerObj = layerObj;

            var h = [];
            _.each(layerObj.level4, function(level3){
                var slotName = level3.name;
                h.push('<div class="input-group">');
                h.push('<span class="input-group-addon">' + slotName + '</span>');
                h.push('<input type="text" class="form-control">');
                h.push('</div>');
            });
            $('form.level4').html(h.join(''));

            setTimeout(function(){
                //bindLeve4Event();
            }, 0);
        });
    };

    var compilePoolData = function(data){
        _.each(data, function(slot){
            var levels = slot.slotName.split('-');
            var productName = slot.name;

            //handle level1
            var level1Obj = _.find(storeModule.storeStruc.level1, function(level){
                return level.name === levels[0];
            });
            if(!level1Obj){
                storeModule.storeStruc.level1.push({'name': levels[0], 'level2':[]});
                level1Obj = _.find(storeModule.storeStruc.level1, function(level){
                    return level.name === levels[0];
                });
            }

            //handle level2
            var level2Obj = _.find(level1Obj.level2, function(level){
                return level.name === levels[1];
            });
            if(!level2Obj){
                level1Obj.level2.push({'name': levels[1], 'level3':[]});
                level2Obj = _.find(level1Obj.level2, function(level){
                    return level.name === levels[1];
                });
            }

            //handle level3
            var level3Obj = _.find(level2Obj.level3, function(level){
                return level.name === levels[2];
            });
            if(!level3Obj){
                level2Obj.level3.push({'name': levels[2], 'level4':[]});
                level3Obj = _.find(level2Obj.level3, function(level){
                    return level.name === levels[2];
                });
            }

            //handle level4
            var level4Obj = _.find(level3Obj.level4, function(level){
                return level.name === levels[3];
            });
            if(!level4Obj){
                level3Obj.level4.push({'name': levels[3], 'productName':productName});
                level4Obj = _.find(level3Obj.level4, function(level){
                    return level.name === levels[2];
                });
            }
        });
    };

    storeModule.getPools = function(){
        $.ajax({
            dataType:'json',
            url: '/data/pools',
            success: function(data){
                //console.log(data);
                buildPoolsLevel(data);
            },
            error: function(){
                $.dr.alert('There was an error loading the pools.');
            }
        });
    };





    return storeModule;
}(storeModule || {}));