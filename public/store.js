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

    var currentFunc = '';

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

        $('div.level1 button.btn').prop('disabled', false);
        $('div.level2 button.btn').prop('disabled', true);
        $('div.level3 button.btn').prop('disabled', true);
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

            renderSlotTable();

        });
    };

    var renderSlotTable = function(){

        if(storeModule.currentPullObj && storeModule.currentLayerObj && storeModule.currentCageObj){

            var poolName = storeModule.currentPullObj.name;
            var cageName = storeModule.currentCageObj.name;
            var layerName = storeModule.currentLayerObj.name;

            var poolObj = _.find(storeModule.storeStruc.level1, function(level1){return level1.name===poolName;});
            var cageObj = _.find(poolObj.level2, function(level2){return level2.name===cageName;});
            var layerObj = _.find(cageObj.level3, function(level3){return level3.name===layerName;});


            var h = [];

            h.push('<div class="input-group">');
            h.push('<span class="input-group-addon" style="font-size:16px;">位置&nbsp;</span>');
            h.push('<input type="text" class="form-control" value="批次編碼" disabled=""/>');
            h.push('<input type="text" class="form-control" value="代數" disabled=""/>');
            h.push('<input type="text" class="form-control" value="細胞數" disabled=""/>');
            h.push('</div>');

            _.each(layerObj.level4, function(level3){
                var slotName = level3.name;
                var disabledStr = level3.productName === "" ? 'disabled="disabled"': '';
                h.push('<div class="input-group">');
                h.push('<span class="input-group-addon">' + slotName + '</span>');
                h.push('<input type="text" class="form-control batch" value="' + level3.batch + '"/>');
                h.push('<input type="text" class="form-control sub" value="' + level3.sub + '"/>');
                h.push('<input type="text" class="form-control cell" value="' + level3.cell + '"/>');
                h.push('<span class="input-group-btn save"><button class="btn btn-default save" type="button" ' + disabledStr + '>入庫</button></span>');
                h.push('<span class="input-group-btn delete"><button class="btn btn-default delete" type="button" ' + disabledStr + '>出庫</button></span>');
                h.push('</div>');
            });
            $('form.level4').html(h.join(''));

            setTimeout(function(){
                bindSlotTableEvent();
            }, 0);
        }
    };

    var bindSlotTableEvent = function(){
        var $slotForm = $('form.level4');
        $slotForm.find('span.input-group-btn button.btn.save').click(function(){
            saveSlot($(this).closest('div.input-group'));
        });
        $slotForm.find('span.input-group-btn button.btn.delete').click(function(){
            var oSelf = $(this);
            var $inputGroup = oSelf.closest('div.input-group');
            $inputGroup.find('input.batch').val('');
            $inputGroup.find('input.sub').val('');
            $inputGroup.find('input.cell').val('');
            saveSlot(oSelf.closest('div.input-group'), '', function(){
                //oSelf.prop("disabled", true);
                //oSelf.parent().siblings('span.input-group-btn.save').find('button').prop("disabled", true);
            });
        });
        $slotForm.find('input').keyup(function(){
            var oSelf = $(this);
            if(oSelf.val()===""){
                oSelf.siblings('span.save').find('button').prop('disabled', true);
                oSelf.siblings('span.delete').find('button').prop('disabled', true);
            }else{
                oSelf.siblings('span.save').find('button').prop('disabled', false);
                oSelf.siblings('span.delete').find('button').prop('disabled', false);
            }
        });

    };

    var collectPostData = function($slotGroup){
        var slotPlace = [];
        slotPlace.push($('#dropdownMenu1').find('span[data-bind=label]').html().trim());
        slotPlace.push($('#dropdownMenu2').find('span[data-bind=label]').html().trim());
        slotPlace.push($('#dropdownMenu3').find('span[data-bind=label]').html().trim());
        slotPlace.push($slotGroup.find('span.input-group-addon').html().trim());

        var batch = $slotGroup.find('input.batch').val().trim();
        var sub = $slotGroup.find('input.sub').val().trim();
        var cell = $slotGroup.find('input.cell').val().trim();

        return {"slotPlace": slotPlace.join('-'), "batch": batch, "sub": sub, "cell": cell};
    };

    var saveSlot = function($slotGroup, callback){

        var postData = collectPostData($slotGroup);

        $.ajax({
            dataType:'json',
            type: 'POST',
            contentType: 'application/json',
            url: '/data/slot/update',
            data: JSON.stringify(postData),
            success: function(data){
                console.log(data);
                if(typeof callback === 'function'){
                    callback(data);
                }
            },
            error: function(){
                $.dr.alert('There was an error loading the pools.');
            }
        });
    };

    var compilePoolData = function(data){
        _.each(data, function(slot){
            var levels = slot.slotName.split('-');
            var batch = slot.batch;
            var sub = slot.sub;
            var cell = slot.cell;

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
                level3Obj.level4.push({'name': levels[3], 'batch': batch, 'sub':sub, 'cell': cell});
                level4Obj = _.find(level3Obj.level4, function(level){
                    return level.name === levels[2];
                });
            }
        });
    };

    storeModule.changeFunction = function(func){
        console.log(func);
        if(currentFunc === func){
            return ;
        }
        currentFunc = func;
        initialState();

        storeModule.getPools(function(){
            $('div.dropdown.level1 button.btn').prop('disabled', false);
        });
    };

    var initialState = function(){


        $('div.dropdown span[data-bind=label]').html('Select One');
        $('div.dropdown ul').html('');
        $('div.level4').html('');
        $('div.dropdown button.btn').prop('disabled', true);

    };

    storeModule.getPools = function(callback){
        $.ajax({
            data: { 'rndnum': new Date().getTime() },
            dataType:'json',
            url: '/data/pools',
            success: function(data){
                //console.log(data);
                buildPoolsLevel(data);
                if(typeof callback === 'function'){
                    callback(data);
                }
            },
            error: function(){
                $.dr.alert('There was an error loading the pools.');
            }
        });
    };





    return storeModule;
}(storeModule || {}));