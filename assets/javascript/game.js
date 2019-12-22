// character database
var characters = {
    "swordsman": { id: 0, hp: 150, atk: 10, def: 10, img: "assets/images/swordsman.png" },
    "lancer": { id: 1, hp: 120, atk: 10, def: 10, img: "assets/images/lancer.png" },
    "archer": { id: 2, hp: 90, atk: 10, def: 20, img: "assets/images/archer.png" },
    "wizard": { id: 3, hp: 80, atk: 50, def: 50, img: "assets/images/wizard.png" },
};

//mc stat
var atkBase = 0;
var avaiableTarget = 1;

/* create the main character from the character database for user to select the main character(MC)*/
function newGame() {
    console.log("create new game...");
    
    // reset all panel
    $('.reset_panel').empty();
    $('.del').remove();
    $('#instruction').text("Select one character as your main character");
    $('.float_div').addClass('center_div').removeClass('float_div')

    // reset all parameters
    atkBase = 0;
    avaiableTarget = 1;

    // load characters from the List
    var keys = Object.keys(characters);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var character = $("<div>");
        character.addClass("character");
        // use attributes to keep track of the character states
        character.attr("id", key)
        character.attr("hp", characters[key].hp);
        character.attr("atk", characters[key].atk);
        character.attr("def", characters[key].def);

        var img = $("<img>");
        var stat = $("<div>");
        stat.addClass("stat");
        img.attr("src", characters[key].img);
        stat.html("<div class='hp'>HP:" + characters[key].hp + "</div>" +
            "<div class='atk'>ATK:" + characters[key].atk + "</div>" +
            "<div class='def'>DEF:" + characters[key].def + "</div>");
        character.append(img);
        character.append(stat);

        $(".character_panel").append(character);
    }

    $(".character").on("click", start); // all character add event listener
};



/* set the clicked character as mc(main character) class
   set the other character as enemy class and add event listener setTarget
   remove(turn off) the start event listener
   rearrange the page
*/
function start() {
    console.log("start...");
    // create all the div
    var wrap = $('<div>').addClass('del');
    $('#instruction').text("This is your main character");
    var enemyDiv = $('<div>').addClass('panel').append("<h1>You need to defeat them, click to set/switch your target to attck</h1>");
    var buttonDiv = $('<div>').addClass('panel action');
    var butAtk = $('<button>').addClass('attack').text('attack');
    var butCancel = $('<button>').addClass('cancel').text('cancel');
    var targetDiv = $('<div>').addClass('panel target_panel del');
    
    enemyDiv.append($('<div>').addClass('enemy_panel reset_panel'));
    buttonDiv.append(butAtk, butCancel);
    targetDiv.append("<h1>Your current target</h1>");

    wrap.append(enemyDiv, buttonDiv);
    $('.center_div').append(wrap);
    $('.center_div').addClass("float_div");
    $('.center_div').removeClass("center_div");
    $('.main').append(targetDiv);

    // add eventlistener
    $('.attack').on("click", attack);
    $('.cancel').on("click", cancel);

    $('.character').off('click', start);        //turn off start event listener

    // addjust class attribute
    $(this).addClass("mc");
    atkBase = parseInt($(this).attr("atk"));
    $(this).removeClass("character");
    $('.character').addClass("enemy");
    $('.character').removeClass("character");

    $(".enemy").on("click", setTarget);         // add event listener
    $('.enemy_panel').append($('.enemy'))       // rearrange
}


/* add the target class to the selected enemey or switch target
   move the target div to the target panel
*/
function setTarget() {
    console.log("set target...")
    //when there is target spot, add target
    if (avaiableTarget != 0) {
        $(this).addClass("target");
        $('.target_panel').append($('.target'));
        avaiableTarget--;
    }else{
        //cancel current target class
        $('.enemy_panel').append($('.target'));
        $('.target_panel').remove(".target");
        $('.target').removeClass('target');
        $(this).addClass("target");
        $('.target_panel').append($('.target'));
    }
}

/* process the battle between mc and target
   based on the result adjust the corresponding attributes (hp, atk)
   assum only one mc and one target (for this project)
   when mc hp<=0 -> game over
   when no more enemy -> win, start new game 
*/
function attack() {
    console.log("attack!");
    // if target exist
    if ($('.target').length != 0) {
        var mc_hp = parseInt($('.mc').attr("hp"));
        var mc_atk = parseInt($('.mc').attr("atk"));
        var tar_hp = parseInt($('.target').attr("hp"));
        var tar_def = parseInt($('.target').attr("def"));


        // mc attack: target hp - mc atk ,
        // target defend: mc hp - target def  
        tar_hp -= mc_atk;
        mc_hp -= tar_def;

        // mc atk increase
        mc_atk += atkBase;

        // update attributes
        $('.mc').attr("hp", mc_hp);
        $('.mc').attr("atk", mc_atk);
        $('.target').attr("hp", tar_hp);
        // update page
        update();

        // combat result
        // check mc hp, if less than 0, game over, start new game
        if (mc_hp <= 0) {
            setTimeout(function () { alert("GameOver!") }, 1)
            setTimeout(newGame, 1);
            return;
        }
        // check target hp, if less than 0, remove target, add target spot
        if (tar_hp <= 0) {
            $('.target').remove();
            avaiableTarget++;
        }

        // check remaining enemy, if 0 game win, start new game
        if ($('.enemy').length == 0) {
            setTimeout(function () { alert("You Win!") }, 1);
            setTimeout(newGame, 1);
            return;
        }
    }
}

/* cancel the current target
    move it back to the enemey panel
*/
function cancel() {
    console.log("cancel target");
    // if target exist
    if ($('.target').length != 0) {
        $('.enemy_panel').append($('.target'));
        $('.target').removeClass('target');
        avaiableTarget++;
    }
}

/* update mc, enemy, target current stat
*/
function update() {
    console.log("update...")
    var p = $('.stat').parent();
    // console.log(p);
    for (var i = 0; i < p.length; i++) {
        // console.log(p[i]);
        $($('.hp')[i]).html("HP:" + p[i].getAttribute("hp"));
        $($('.atk')[i]).html("ATK:" + p[i].getAttribute("atk"));
    }
}

$(document).ready(function () {
    newGame();
})


