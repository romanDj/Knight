

//таймеры
var mapRolling = true;
//минуты и секунды
var mm = 0 , ss = 0;
//xp и энергия
var xp = 100, mp = 100;
//количество убитых монстров
var kill = 0;

var statusGame = false;

var pause = false;


$(".screen-ranking").css({'display':'none'});


//проверка при вводе имени
$("#username").on('keyup', function(){

    if( $("#username").val() == '' ){

        $("#startGame").removeClass("enabled");
        $("#startGame").addClass("disabled");

    }else{

        $("#startGame").removeClass("disabled");
        $("#startGame").addClass("enabled");

    }

});

//действие по нажатию кнопки next
$("#startGame").click(function (e) {

    e.preventDefault();

    if($(this).hasClass("enabled")){
        //скрытие начального экрана
        $(".screen-start").fadeOut(1000);
        //задаем имя игрока
        $(".user-info").html( $("#username").val() );
        man.add();
        statusGame = true;
        init();
    }

});

//начать игру занаво
$('.startAgain').click(function(){
    location.reload();
});

/////////////////////////////////////////////////

function init() {
    loop();
    timer();
}

//цикл игры для действий в каждую мили секунду
function loop(){

    return setTimeout(function(){
        //прокрутка карты
        scrollingMap();

        //анимация летящих мечей
        man.attack3Animation();

        //анимация монстров
        enemiesAnimation();

        if(pause == false){
            loop();
        }
    },1);

}

//таймер для отображения времени и изменение характеристик раз в секунду
function timer(){

   return setTimeout(function () {
       if(statusGame==true){
           ss++;
           if(ss==60){
               mm++;
               ss = 0;
           }
           $(".timer").text("Time: "+( mm < 10? '0' + mm: mm)+':'+( ss < 10? '0'+ ss: ss));

           setXp();
           man.blockMP();

           //добавление монстров
           enemiesAdd();

           enemiesDamage();
       }


        if(pause == false){
            timer();
        }

    }, 1000);

}

//таймер регенирации жизни и энергии
function setXp() {

    if(xp <= 0){
        xp = 0;
        man.die();
        finish();

    }else{

        if(xp!=100){
            xp += 2;
            if(xp > 100){
                xp = 100;
            }
        }
        if(mp != 100){
            mp += 5;
            if(mp > 100){
                mp = 100;
            }
        }

    }

    $(".panel-xp >.score-value").css({ 'width': xp + '%' });
    $(".panel-mp >.score-value").css({ 'width': mp + '%' });

    $(".panel-xp >.score-value>span").html(xp);
    $(".panel-mp >.score-value>span").html(mp);


}

//анимация карты
function scrollingMap(){

    //позиция на сколько картинка смещена
    var x =  $(".screen-game").css('background-position-x').replace('px','');

    //сколько промотано
    var put = Math.abs(x) + $(".screen-game").width();

    //длина карты
    var length = $(".screen-game").height()* 8.85;

    //проверяем закончилась ли карта
    if(length <= put){
        mapRolling = false;
    }else if(man.position == 'center' && man.status == 'run'){
        mapRolling = true;
        $(".screen-game").css({'background-position-x' : '-=4px'} );
        $('.game-zone').children().each(function () {
            $(this).css({'left': '-=4px'});
        });
    }

}

//изменение количество убийств
function killed() {
    kill++;
    $(".kills").html("Killed: " + kill);

}

//отправление в базу и заполнение таблицы
function raiting(){

    $.ajax({
        type:'POST',
        url:'assets/php/register.php',
        data: {
            'username': $("#username").val(),
            'score': kill,
            'time': (mm*60) + ss,
        },
        success:function(data){

            var players = JSON.parse(data);

            players.sort(function(a,b){
                return b['score'] - a['score'] || a['time'] - b['time'];

            });

            $.each(players, function (key, value) {

                var m = Math.floor(value['time']/60);
                var s = value['time'] - (m*60);

                var haveName = false;

                if(key + 1 == 10){

                    $('.name').each(function () {
                        if($(this).html() == $("#username").val()){
                            haveName = true;
                        }
                    });

                    if(haveName==true){
                        
                        var row = "<tr><td>" + (key + 1) + "</td><td class='name'>"+value['username']+"</td><td>"+value['score']+"</td><td>"+(m<10?'0'+m: m )+':'+(s<10?'0'+ s: s )+"</td></tr>";
                        $('#ranking>tbody').append(row);
                        
                    }else{
                        
                        var rowYou = null;
                        
                        $.each(players, function (keyTh, valueTh) {
                            if(valueTh['username'] == $('#username').val()){
                                rowYou = valueTh;
                            }
                        });

                        var mu = Math.floor(rowYou['time']/60);
                        var su = rowYou['time'] - (mu*60);

                        var rowAppend = "<tr><td>" + (key + 1) + "</td><td class='name'>"+rowYou['username']+"</td><td>"+rowYou['score']+"</td><td>"+(mu<10?'0'+mu: mu )+':'+(su<10?'0'+ su: su )+"</td></tr>";
                        $('#ranking>tbody').append(rowAppend);
                    }

                }else if(key + 1 < 10){
                    var row = "<tr><td>" + (key + 1) + "</td><td class='name'>"+value['username']+"</td><td>"+value['score']+"</td><td>"+(m<10?'0'+m: m )+':'+(s<10?'0'+ s: s )+"</td></tr>";
                    $('#ranking>tbody').append(row);
                }



            });



        }
    });

    return false;

}

//завершение игры
function finish() {
    statusGame = false;
    pause = true;
    raiting();
    $('.screen-ranking').css({ 'display': 'block'});
    $('.screen-ranking').addClass('show');

}



/////////////////////////////////////////////////

//действия при отпускании клавиш
$("body").on('keyup', function (e) {

    if(pause==false){

        //стоит на месте
        if((e.keyCode == 39 || e.keyCode == 37) && man.status != 'attack'){
            man.idle();
        }

        //убрать щит
        if(e.keyCode == 50){
            man.block();
        }

    }
});


$("body").on('keydown', function (e) {

    //кнопка esc
    if(e.keyCode == 27){
        if(pause == true){
            pause = false;
            init();
        }else{
            pause = true;
        }
    }

    if(pause == false){

        //совершение атаки
        if(e.keyCode == 49 && man.status != 'attack'){
            man.attack();
        }

        //поставить щит
        if(e.keyCode == 50 && man.status !='block'){
            man.block();
        }

        if(e.keyCode == 51 && man.attack3Status == true){
            man.attack3();
        }

        if(e.keyCode == 52 && man.attack4Status == true){
            man.attack4();
        }


        //вправо
        if(e.keyCode==39 && man.status != 'run' && man.status != 'attack'){
            man.motion('right');
        }

        //влево
        if(e.keyCode==37 && man.status != 'run' && man.status != 'attack'){
            man.motion('left');
        }
    }


});

var man = {
    add: () =>{
        $('.screen-game').append(' <img class="man" alt="" src="assets/animation/idle.gif">');
    },
    //текущая задача рыцаря
    status: 'idle',

    //в какой части экрана находится рыцарь
    position: null,

    attack3Status: true,

    attack4Status: true,

    //получение текущего положения рыцаря
    getPosition : () => { return Number($(".man").css('left').replace('px','')) },

    x1: () => {

        if($('.man').hasClass('back')){
            return Math.floor(man.getPosition() + ($('.man').width()/2) - 3);
        }else{
            return Math.floor(man.getPosition());
        }

    },

    x2: () => {

        if($('.man').hasClass('back')){
            return  Math.floor(man.getPosition() + $('.man').width());
        }else{
            return Math.floor(man.getPosition() + ($('.man').width()/2) + 3);
        }

    },

    //анимация бегущего рыцаря
    run: () => {

        if( man.status != 'run'){
            man.status = 'run';
            $(".man").attr('src', 'assets/animation/run.gif');
        }
    },

    die : () => {
        man.status = 'die';
        $(".man").attr('src', 'assets/animation/death.gif');
    },

    //анимация стоящего рыцаря
    idle: () => {
        man.status = 'idle';
        $(".man").attr({'src' : 'assets/animation/idle.gif'});
    },

    //анимация атаки
    attack: () => {
        man.status = 'attack';

        if($('.man').hasClass('back')){
            $('.man').css({'left': '-=76px'});
        }else{
            $('.man').css({'left': '-=22px'});
        }
        
        $(".man").attr('src', 'assets/animation/attack1.gif');
        
        //урон монстрам
        
        $('.enemies').each(function () {

            var x1 = Math.floor(Number( $(this).css('left').replace('px', '')));
            var x2 = Math.floor( x1 + $(this).width());

            if(($('.man').hasClass('back') && $(this).hasClass('back') && $(this).attr('data-status')=='attack')
                ||(!$('.man').hasClass('back') && !$(this).hasClass('back') && $(this).attr('data-status')=='attack')){

                var liveNow = $(this).attr('data-live');
                $(this).attr('data-live', liveNow - 15);
            }

        });

        $('#attack1').removeClass('enabled').addClass('disabled');
        setTimeout( function(){
            man.idle();
            if($('.man').hasClass('back')){
                $('.man').css({'left': '+=76px'});
            }else{
                $('.man').css({'left': '+=22px'});
            }

            $('#attack1').removeClass('disabled').addClass('enabled');

        } , 900);
    },

    attack3: () => {
        if(mp - 10 >= 0 ) {
            mp -= 15;
            man.status = 'attack3';
            man.attack3Status = false;
            $('.screen-game').append('<div class="attack3 ' + ($('.man').hasClass('back') ? 'back' : '') + '"  style="left: '
                + ($('.man').hasClass('back') ? man.getPosition() - 100 : man.getPosition() + 50) + 'px"></div>');
            $('#attack3').removeClass('enabled').addClass('disabled');

            //урон монстрам
            $('.enemies').each(function () {

                var x1 = Math.floor(Number( $(this).css('left').replace('px', '')));
                var x2 = Math.floor( x1 + $(this).width());

                if(($('.man').hasClass('back') && x2 <= man.x1() )
                    ||(!$('.man').hasClass('back') && x1 >= man.x2())){
                    var liveNow = $(this).attr('data-live');
                        $(this).attr('data-live', liveNow - 40);
                }

            });

            man.attack3Recharge();
        }
    },

    attack3Animation: () => {
        $('.attack3').each(function () {
            if($(this).hasClass('back')){

                $(this).css({ 'left' : '-=4px' });
            }else{

                $(this).css({ 'left' : '+=4px' });
            }

            var x = Number($(this).css('left').replace('px', ''));

            if( x <= 0 || (x + $(this).width()) >= ($('.screen-game').width() - 10)){
                $(this).remove();
            }

        });
    },

    //перезарядка
    attack3Recharge: () => {
        setTimeout(function(){

            $('#attack3').removeClass('disabled').addClass('enabled');
            man.attack3Status = true;

        }, 3000);
    },

    attack4: () => {

        if(mp - 30 >= 0){

            man.status = 'attack4';
            $('.attack4').attr('src', 'assets/animation/aoe1.gif');
            man.attack4Status = false;
            $('#attack4').removeClass('enabled').addClass('disabled');
            //трата энергии
            mp -= 35;

            if($('.man').hasClass('back')){
                $('.attack4').css({ 'left' : man.getPosition() - $('.attack4').width() });
            }else{
                $('.attack4').css({ 'left' : man.getPosition() + $('.man').width() });
            }

            //урон монстрам

            $('.enemies').each(function () {
                var x1 = Math.floor(Number( $(this).css('left').replace('px', '')));
                var x2 = Math.floor( x1 + $(this).width());

                var attX1= Number($('.attack4').css('left').replace( 'px', ''));
                var attX2 = attX1 + $('.attack4').width();

                if((attX1 < x1 && attX2> x1) || (attX1 < x2 && attX2> x2)){

                    var liveNow = $(this).attr('data-live');
                    $(this).attr('data-live', liveNow - 100);
                }

            });

            setTimeout(function () {
                $('.attack4').attr('src', '');
            },4000);

            setTimeout(function () {
                man.attack4Status = true;
                $('#attack4').removeClass('disabled').addClass('enabled');
            }, 15000);

        }


    },

    //анимация щита
    block: () =>{
        if(man.status != 'block'){
            man.status = 'block';
            $(".man").attr('src', 'assets/animation/block_st.gif');
            $('#attack2').removeClass('enabled').addClass('disabled');
        }else{
            $(".man").attr('src', 'assets/animation/block_fn.gif');
            man.status = "idle";
            $('#attack2').removeClass('disabled').addClass('enabled');
        }
    },

    //трата mp при блоке
    blockMP: () => {

        if(man.status == 'block'){

            if(mp - 5 >= 0){
                mp -= 10;

                if(mp <= 0){
                    man.block();
                }

            }
        }

    },

    //движение рыцаря
    motion: function(direction){
        //в какую сторону смотрит
        if(direction == 'right' ){
            $(".man").removeClass('back');
        }else if(direction == 'left'){
            $(".man").addClass('back');
        }

        man.run();

        setTimeout(function(){

            //если по середине экрана и карта должна двигаться
            if( man.getPosition() >= Math.round(($('.screen-game').width() / 2 )) && mapRolling == true){

                if(direction == 'left'){
                    $('.man').css({ 'left': '-=4px' });
                }

                man.position = 'center';

            } else {

                if(man.getPosition(man.getPosition() + $('.man').width()) - 1 > 0 && direction == 'left'){
                    $('.man').css({ 'left':  '-=4px' });

                }else if((man.getPosition() + $('.man').width()) + 10 < $('.screen-game').width() && direction == 'right'){

                    $('.man').css({ 'left':  '+=4px' });

                    //если добежал до конца
                    if((man.getPosition() + $('.man').width()) + 10 > $('.screen-game').width() && direction == 'right'){
                        finish();
                    }
                }

                man.position = 'default';
            }

            //перезапуск движения
            if(man.status == 'run'){
                man.motion(direction);
            }

        }, 1);



    }

};



function enemiesAdd(){

        var b = Math.floor((Math.random() * 4) + 1);

        if(b == 4){
            if($('.game-zone').children('.enemies').length < 10){

                var a = Math.floor((Math.random() * 10) + 1);

                if( a <= 4 && a >= 1){
                    $('.game-zone').append('<img class="dog enemies"  data-damage="4" data-speed="3" data-live="15" data-status="run" src="assets/animation/dog/run.gif">');
                }else if(a <= 9 && a >= 5){
                    $('.game-zone').append('<img class="elf enemies" data-damage="7" data-speed="2" data-live="30" data-status="run" src="assets/animation/elf/Run_000.gif">');
                }else if(a == 10){
                    $('.game-zone').append('<img class="greench enemies" data-damage="12" data-speed="1" data-live="60" data-status="run" src="assets/animation/greench/Run_loop.gif">');
                }


            }
        }
    }

    function enemiesAnimation(){

        $('.enemies').each(function () {

            var x1 = Math.floor(Number( $(this).css('left').replace('px', '')));
            var x2 = Math.floor( x1 + $(this).width());
            var speed = $(this).attr('data-speed');
            
            var live = $(this).attr('data-live');



           // console.log('положение рыцаря '+man.x1()+':'+man.x2());
          //  console.log('положение монстра '+x1+':'+x2);


            // если жизни у монстра закончились
            if(live <= 0){
                enemiesGifDie(this);
            }else{
                //атака справа
                if(x1 ==man.x2()){

                    //чтобы смотрел влево
                    if($(this).hasClass('back')){
                        $(this).removeClass('back');
                    }

                    enemiesGifAttack(this);
                }
                //атака слева
                else if(x2 == man.x1()){

                    //чтобы смотрел вправо
                    if(!$(this).hasClass('back')){
                        $(this).addClass('back');
                    }

                    enemiesGifAttack(this);
                }

                //монстр бежит влево
                else if(x1 > man.x2()){
                    enemiesGifRun(this);
                    //чтобы смотрел влево
                    if($(this).hasClass('back')){
                        $(this).removeClass('back');
                    }

                    $(this).css({'left': '-='+speed+'px'});
                }
                //монстр бежит вправо
                else if(x2 < man.x1()){
                    enemiesGifRun(this);
                    //чтобы смотрел вправо
                    if(!$(this).hasClass('back')){
                        $(this).addClass('back');
                    }

                    $(this).css({'left': '+='+speed+'px'});


                } else{
                    // console.log('когда делать нечего');

                    enemiesGifRun(this);
                    if($(this).hasClass('back')){
                        $(this).css({'left': '-=1px'});
                    }else{
                        $(this).css({'left': '+=1px'});
                    }

                }

            }


        });
    }
    
    function enemiesDamage() {

        $('.enemies').each(function () {

          if( ($(this).attr('data-status') == 'attack' && man.status != 'block') ||
              ($(this).attr('data-status') == 'attack' && man.status == 'block' &&
                  ((  $('.man').hasClass('back') &&  !$(this).hasClass('back') )||( !$('.man').hasClass('back') &&  $(this).hasClass('back')  )) )){
              var damage = Number($(this).attr('data-damage'));
              xp -= damage;
          }

        });


    }

    function enemiesGifAttack(obj){

        if($(obj).attr('data-status') != 'attack'){

            $(obj).attr('data-status', 'attack');

            if($(obj).hasClass('elf')){
                $(obj).attr('src', 'assets/animation/elf/Attack2_loop.gif');
            }else if($(obj).hasClass('greench')){
                $(obj).attr('src', 'assets/animation/greench/Attack2_loop.gif');
            }
        }
    }

    function enemiesGifRun(obj){
        if($(obj).attr('data-status') != 'run'){

            $(obj).attr('data-status', 'run');

            if($(obj).hasClass('elf')){
                $(obj).attr('src', 'assets/animation/elf/Run_000.gif');
            }else if($(obj).hasClass('greench')){
                $(obj).attr('src', 'assets/animation/greench/Run_loop.gif');
            }
        }
    }

    function enemiesGifDie(obj){
        if($(obj).attr('data-status') != 'die'){

            $(obj).attr('data-status', 'die');

            if($(obj).hasClass('elf')){


                setTimeout(function(){

                    $(obj).attr('src', 'assets/animation/elf/Die_000.gif');
                    $(obj).css({'width': '205px', 'left': ($(obj).hasClass('back')? '-=120px':'+=1px') });
                    setTimeout(function(){
                        killed();
                        $(obj).remove();
                    }, 2200);

                },900);



            }else if($(obj).hasClass('greench')){



                setTimeout(function(){

                    $(obj).attr('src', 'assets/animation/greench/Die.gif');
                    $(obj).css({'width': '192px', 'left': ($(obj).hasClass('back')? '-=100px':'+=1px') });
                    setTimeout(function(){
                        killed();
                        $(obj).remove();
                    }, 2200);

                },900);


            }else{
                setTimeout(function(){
                    killed();
                    $(obj).remove();
                }, 900);

            }



        }
    }




