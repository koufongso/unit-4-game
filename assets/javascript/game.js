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
    $('.reset_panel').empty(); //clear all panel content

    console.log("create new game...");
    atkBase = 0;
    avaiableTarget = 1;
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
    console.log("start...")
    $('.character').off('click', start);        //turn off click event listener

    // addjust class attribute
    $(this).addClass("mc");
    atkBase = parseInt($(this).attr("atk"));
    $(this).removeClass("character");
    $('.character').addClass("enemy");
    $('.character').removeClass("character");

    $(".enemy").on("click", setTarget);         // add event listener
    $('.enemy_panel').append($('.enemy'))       // rearrange 
}


/* add the target class to the selected enemey
   move the target div to the target panel
*/
function setTarget() {
    // only add target when there are avaible spot for target
    if (avaiableTarget != 0) {
        $(this).addClass("target");
        $('.target_panel').append($('.target'));
        avaiableTarget--;
    }
}

/* process the battle between mc and target
   based on the result adjust the corresponding attributes (hp, atk)
   assum only one mc and one target (for this project)
   when mc hp<=0 -> game over
   when no more enemy -> win, start new game 
*/
function attack() {
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

        // update page
        update();

        // console.log(mc_hp);
        // combat result
        if (mc_hp <= 0) {
            // lose
            mc_hp = 0;
            setTimeout(function(){alert("GameOver!")}, 100)
            newGame();
            return;
        }

        if (tar_hp <= 0) {
            // target defeated
            // remove current target
            tar_hp = 0;
            $('.target').remove();
            //reset 
            avaiableTarget++;
        }

        // update attributes
        $('.mc').attr("hp", mc_hp);
        $('.mc').attr("atk", mc_atk);
        $('.target').attr("hp", tar_hp);

        if ($('.enemy').length == 0) {
            setTimeout(function(){alert("You Win!")},100);
            newGame();
            return;
        }
    }
}

/* cancel the current target
    move it back to the enemey panel
*/
function cancel() {
    // if target exist
    if ($('.target').length != 0) {
        $('.enemy_panel').append($('.target'));
        $('.target').removeClass('target')
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

window.onload = function () {
    /* eventlistener*/
    $('#attack').on("click", attack);
    $('#cancel').on("click", cancel);
}



$(document).ready(function () {
    newGame();
})


