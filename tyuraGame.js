//デバッグの表示
const dbagflag = true;

//ゲームの終了判定
let finish = false;

const gamespeed = 1000/60;

let hitnum = false;

//スクリーンで切り取っている部分がキャンバスに反映される
const SCREEN_W = 320;
const SCREEN_H = 330;

//キャンバスのサイズを決める(スクリーンを切り取るのでアスペクト比は同じほうがいい)
const canvas_W = SCREEN_W*2;
const canvas_H = SCREEN_H*2;

//フィールドの範囲を決める(スクリーンの動ける範囲)
const FIELD_W = SCREEN_W*2;
const FIELD_H = SCREEN_H*2;

const starnum = 300;
//キャンバスの作成
let can = document.getElementById("can");
let con = can.getContext("2d");
can.width = canvas_W;
can.height = canvas_H;

//フィールド(仮想画面)の作成
let vcan = document.createElement("canvas");
let vcon = vcan.getContext("2d");
vcan.width = FIELD_W;
vcan.height = FIELD_H;

//仮想画面で切り取る部分
let camera_x=0;
let camera_y=0;

//たまの格納場所
let tama =[];

//也寸志のはっしゃするえさ
let yakiimo = [];

//大きいうんこの格納場所
let bigunko = [];

//爆発を格納する配列
let expo =[];

//キーボードの状態保存
let key =[];

//キーボードの状態切り替え
document.onkeydown=function(e){
    key[e.keyCode] = true;
}

//Rボタンで初期化
document.onkeydown = function(e)
{
    key[e.keyCode] = true;
    if(finish && e.keyCode == 82)
    {
        delete yasushi;
        yasushi = new Yasushi();
        finish = false;
    }
}

document.onkeyup=function(e){
    key[e.keyCode] = false;
}
//ちゅらの移動
class Tyura{
    constructor(){
        this.x = (SCREEN_W)<<8;
        this.y = (SCREEN_H+60)<<8;

        this.speed = 512;
        this.reload =0;
        this.sn =0;
        this.r = 10;
        this.count =0;
        this.bigunkocount =0;
        this.bigunkoflag =false;
    }

    update(){
        this.count++;
        if(this.reload > 0){
            this.reload--;
        }
        
        if(key[13] && this.reload == 0){
            tama.push( new Tama(this.x-(20<<8),this.y+(60<<8),0,0));
            this.reload += 50;
            
        }

        if(key[37] && this.x>this.speed)
        {
            this.x -= this.speed;
            
        }else if(key[39] && this.x<= (FIELD_W<<8)-this.speed)
        {
            this.x += this.speed;
            
        }else{
            if(this.anime>0)this.anime--;
            if(this.anime<0)this.anime++;
        }
        
        if(key[38] && this.y>this.speed){
            this.y -= this.speed;
        }

        if(key[40] && this.y<= (FIELD_H<<8)-this.speed){
            this.y += this.speed;
        }

        if(key[49]){
            this.sn =0;
        }

        if(key[50]){
            this.sn =1;
        }

        if(key[51]){
            this.sn =2;
        }

        if(key[52]){
            this.sn =3;
        }

        if(key[53]){
            this.sn =4;
        }

        if(key[54]){
            this.sn =5;
        }
        
        for(let i=0; i < yakiimo.length; i++){
            if(checkHit(this.x,this.y,this.r,yakiimo[i].x,yakiimo[i].y,yakiimo[i].r)){
                yakiimo[i].kill = true;
                tama.push( new Tama(this.x-(20<<8),this.y+(60<<8),0,0));
            }
        }

        if(tama.length > 9){
            this.bigunkoflag = true;
            for(let i = 0; i < tama.length-1; i++){
                let angle,dx,dy;
                angle = Math.atan2(tama[tama.length-1].y - tama[i].y, tama[tama.length-1].x-tama[i].x);
                        
                dx = Math.cos(angle)*2000;
                dy = Math.sin(angle)*2000;
                tama[i].vx = dx;
                tama[i].vy = dy;
            }
        }
        if(this.bigunkoflag){
            for(let i = tama.length-2; i >=0; i--){
                if(checkHit(tama[tama.length-1].x,tama[tama.length-1].y,tama[tama.length-1].r,tama[i].x,tama[i].y,tama[i].r)){
                    tama[i].kill = true;
                    this.bigunkocount ++;
                    /*tama.push( new Tama(this.x-(20<<8),this.y+(60<<8),0,0));*/
                }
            
            }
        }
        if(this.bigunkocount == 9){
            tama[tama.length-1].kill = true;
            this.bigunkocount = 0;
            this.bigunkoflag = false;
            bigunko.push(new BigUnko(tama[tama.length-1].x,tama[tama.length-1].y,0,0));
        }
        
    }

    draw(){
        drawTyura(this.sn,this.x, this.y);
    }
}

let tyura = new Tyura();

//也寸志の動きを出す
class Yasushi{
    constructor(){
        this.x = (SCREEN_W)<<8;
        this.y = 80<<8;
        this.vy = 200;
        this.r = 50;
        this.mhp = 3000;
        this.count = 0;
        this.hp = 3000;
        this.yasushiflag = false;
        this.yasushicount = 0;
        this.imoflag = false;
        this.imocount = 0;
    }

    update(){
        this.count++;
        if(this.imocount > 0){
            this.imocount--;
        }
        if(this.imocount > 0){
            this.imoflag = true;
        }else{
            this.imoflag = false;
        }

        if(this.yasushicount > 0){
            this.yasushicount--;
        }
        if(this.yasushicount > 0){
            this.yasushiflag = true;
        }else{
            this.yasushiflag = false;
        }
        if(this.count < 185){
            this.y += this.vy;
        }
        /*if(this.count ==60){
            yakiimo.push(new Yakiimo());
        }*/

        if(this.count%420 ==0 && !finish){
            let angle = 0;
            let dx,dy;
            for(let i =0; i < 4; i++){
                angle += 36;
                let angle1 = angle * Math.PI/180;   
                dx = Math.cos(angle1)*200;
                dy = Math.sin(angle1)*200;
                let x2 = (Math.cos(angle1)*65)<<8;
                let y2 = (Math.sin(angle1)*65)<<8;
                yakiimo.push(new Yakiimo(this.x+x2,this.y+y2,dx,dy));
            }
        this.imocount =120;  
        
        }
        
    }

    draw(){
        drawYasushi(this.x, this.y);
    }
}

let yasushi = new Yasushi();

//也寸志の発射するえさの動き
class Yakiimo{
    constructor(x,y,vx,vy){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.kill = false;
        this.count =0;
        this.r = 8;
    }
    update(){
        this.x += this.vx;
        this.y += this.vy;

        if(this.x < 0 || this.x > (FIELD_W<<8) || this.y < 0 || this.y > (FIELD_H<<8)){
            this.kill = true;
        }

    }
    draw(){
        drawYakiimo(this.x, this.y);
    }
}

//爆発のエフェクト
class Expo{
    constructor(x,y,vx,vy){
        this.x =x;
        this.y =y;
        this.vx =vx;
        this.vy =vy;
        this.sn =0;
        this.count =0;
        this.kill = false;
    }
    update(){
        this.count++;
    }
    draw(){
        this.sn = 0 + (this.count>>2);
        if(this.sn == 11)
        {
            this.kill = true;
            return;
        }
        drawSprite(this.sn,this.x,this.y);
    }
}

//ファイルの読み込み
let spriteImage = new Image();
spriteImage.src="sprite.png";

//ちゅらが発射するたま
class Tama{
    constructor(x,y,vx,vy){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.kill =false;
        this.r =4;
        this.power = 100;
    }
    update(){

        if(tama.length > 0 && key[32] && bigunko.length == 0){
            let angle,dx,dy;
            angle = Math.atan2(yasushi.y - tama[0].y, yasushi.x-tama[0].x);
                    
            dx = Math.cos(angle)*1000;
            dy = Math.sin(angle)*1000;
            tama[0].vx = dx;
            tama[0].vy = dy;
            hitnum = true;
        }

        if(tama.length > 4 && key[32] && bigunko.length == 0){
            for(let i =0; i < tama.length; i++){
                let angle,dx,dy;
                angle = Math.atan2(yasushi.y - tama[i].y, yasushi.x-tama[i].x);
                        
                dx = Math.cos(angle)*1000;
                dy = Math.sin(angle)*1000;
                tama[i].vx = dx;
                tama[i].vy = dy;
                hitnum = true;
            }
            
        }
        
        this.x += this.vx;
        this.y += this.vy;

        for(let i=0; i < tama.length; i++){
            if(checkHit(this.x,this.y,this.r,yasushi.x,yasushi.y,yasushi.r) && !finish){
                this.kill = true;
                yasushi.hp -= this.power;
                expo.push(new Expo(this.x,this.y,this.vx,this.vy));
                yasushi.yasushicount = 80;
            }
        }

        if(this.x < 0 || this.x > (FIELD_W<<8) || this.y < 0 || this.y > (FIELD_H<<8)){
            this.kill = true;
        }
    }
    draw(){
        drawUnko(0,this.x,this.y);
    }
}

//おおきなうんこの動き
class BigUnko{
    constructor(x,y,vx,vy){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.kill =false;
        this.r =4;
        this.power = 1000;
    }
    update(){

        if(bigunko.length > 0 && key[32]){
            let angle,dx,dy;
            angle = Math.atan2(yasushi.y - bigunko[0].y, yasushi.x-bigunko[0].x);
                    
            dx = Math.cos(angle)*1000;
            dy = Math.sin(angle)*1000;
            bigunko[0].vx = dx;
            bigunko[0].vy = dy;
            hitnum = true;
        }
        
        this.x += this.vx;
        this.y += this.vy;

        for(let i=0; i < bigunko.length; i++){
            if(checkHit(this.x,this.y,this.r,yasushi.x,yasushi.y,yasushi.r) && !finish){
                this.kill = true;
                yasushi.hp -= this.power;
                expo.push(new Expo(this.x,this.y,this.vx,this.vy));
                expo.push(new Expo(this.x + (rand(-10,10)<<8),this.y +(rand(-10,10)<<8),this.vx,this.vy));
                expo.push(new Expo(this.x +(rand(-10,10)<<8),this.y +(rand(-10,10)<<8),this.vx,this.vy));
                expo.push(new Expo(this.x +(rand(-20,20)<<8),this.y +(rand(-20,20)<<8),this.vx,this.vy));
                expo.push(new Expo(this.x+(rand(-20,20)<<8),this.y+(rand(-20,20)<<8),this.vx,this.vy));
                expo.push(new Expo(this.x+(rand(-30,30)<<8),this.y+(rand(-30,30)<<8),this.vx,this.vy));
                expo.push(new Expo(this.x+(rand(-30,30)<<8),this.y+(rand(-30,30)<<8),this.vx,this.vy));
                expo.push(new Expo(this.x+(rand(-40,40)<<8),this.y+(rand(-40,40)<<8),this.vx,this.vy));
                expo.push(new Expo(this.x+(rand(-40,40)<<8),this.y+(rand(-40,40)<<8),this.vx,this.vy));
                expo.push(new Expo(this.x+(rand(-50,50)<<8),this.y+(rand(-50,50)<<8),this.vx,this.vy));
                expo.push(new Expo(this.x+(rand(-50,50)<<8),this.y+(rand(-50,50)<<8),this.vx,this.vy));

                yasushi.yasushicount = 80;
            }
        }

        if(this.x < 0 || this.x > (FIELD_W<<8) || this.y < 0 || this.y > (FIELD_H<<8)){
            this.kill = true;
        }
    }
    draw(){
        drawBigunko(0,this.x,this.y);
    }
}

//やすしの読み込み
let yasushiImage = new Image();
yasushiImage.src="Yasushi.jpg";

//やすしクラス
class Yasu{
    constructor(x,y,w,h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

let yasu =[
    new Yasu(40,20,360,440)
];

//ちゅらの読み込み
let tyuraImage = new Image();
tyuraImage.src="tyuraset.png";

//ちゅらクラス
class Tyu{
    constructor(x,y,w,h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

let tyu =[
    new Tyu(25,25,350,500),
    new Tyu(380,20,320,500),
    new Tyu(775,25,320,500),
    new Tyu(29,600,353,1100),
    new Tyu(401,600,353,1100),
    new Tyu(771,600,353,1100)
];

//やきいもの読み込み
let esaImage = new Image();
esaImage.src="sweets_yakiimo.png";

//やきいもくらす
class Esa{
    constructor(x,y,w,h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

let esa =[
    new Esa(19,17,761,767)
]


//うんこの読み込み
let unkoImage = new Image();
unkoImage.src="unichi-makimaki.png";

//うんこクラス
class Unko{
    constructor(x,y,w,h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

let unko =[
    new Unko(0,20,590,580)
];

function rand(min,max)
{
    return Math.floor(Math.random() * Math.floor(max-min+1))+min;
}

//当たり判定のファンクション
function checkHit(x1,y1,r1,x2,y2,r2)
{
    //円同士のあたり判定
    let a = (x1-x2)>>8;
    let b = (y1-y2)>>8;
    let r = r1+r2;

    return ( r*r >= a*a + b*b);
}


//爆発エフェクトのくらす
class Sprite{
    constructor(x,y,w,h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}
//爆発の切り取り情報
let sprite = [
	new Sprite(  5,351, 9, 9),//0 16  ,爆発1
	new Sprite( 21,346,20,20),//1 17  ,爆発2
	new Sprite( 46,343,29,27),//2 18  ,爆発3
	new Sprite( 80,343,33,30),//3 19  ,爆発4
	new Sprite(117,340,36,33),//4 20  ,爆発5
	new Sprite(153,340,37,33),//5 21  ,爆発6
	new Sprite(191,341,25,31),//6 22  ,爆発7
	new Sprite(216,349,19,16),//7 23  ,爆発8
	new Sprite(241,350,15,14),//8 24  ,爆発9
	new Sprite(259,350,14,13),//9 25  ,爆発10
	new Sprite(276,351,13,12),//10 26  ,爆発11
];
//爆発を描画をするメソッド
function drawSprite(snum,x,y){
    let sx = sprite[snum].x;
    let sy = sprite[snum].y;
    let sw = sprite[snum].w;
    let sh = sprite[snum].h;

    let px = (x>>8)-sw/2;
    let py = y>>8;
    if(px+sw/2 < camera_x || px > camera_x + SCREEN_W || py+sh/2 < camera_y || py > camera_y + SCREEN_H){
        return;
    }else{
        vcon.drawImage(spriteImage,sx,sy,sw,sh,px,py,sw,sh);
    }   
}

//ちゅらを描画をするメソッド
function drawTyura(snum,x,y){
    let sx = tyu[snum].x;
    let sy = tyu[snum].y;
    let sw = tyu[snum].w;
    let sh = tyu[snum].h;

    let px = (x>>8)-sw/14;
    let py = y>>8;
    if(px+sw/10 < camera_x || px > camera_x + SCREEN_W || py+sh/10 < camera_y || py > camera_y + SCREEN_H){
        return;
    }else{
        vcon.drawImage(tyuraImage,sx,sy,sw,sh,px,py,sw/7,sh/7);
    }   
}

//うんこを描画をするメソッド
function drawUnko(snum,x,y){
    let sx = unko[snum].x;
    let sy = unko[snum].y;
    let sw = unko[snum].w;
    let sh = unko[snum].h;

    let px = (x>>8)-sw/40;
    let py = y>>8;
    if(px+sw/20 < camera_x || px > camera_x + SCREEN_W || py+sh/20 < camera_y || py > camera_y + SCREEN_H){
        return;
    }else{
        vcon.drawImage(unkoImage,sx,sy,sw,sh,px,py,sw/20,sh/20);
    }   
}

//おおきなうんこを描画するメソッド
function drawBigunko(snum,x,y){
    let sx = unko[snum].x;
    let sy = unko[snum].y;
    let sw = unko[snum].w;
    let sh = unko[snum].h;

    let px = (x>>8)-sw/14;
    let py = y>>8;
    if(px+sw/7 < camera_x || px > camera_x + SCREEN_W || py+sh/7 < camera_y || py > camera_y + SCREEN_H){
        return;
    }else{
        vcon.drawImage(unkoImage,sx,sy,sw,sh,px,py,sw/7,sh/7);
    }   
}

//やすしを描画するメソッド
function drawYasushi(x,y){
    let sx = yasu[0].x;
    let sy = yasu[0].y;
    let sw = yasu[0].w;
    let sh = yasu[0].h;

    let px = (x>>8);
    let py = y>>8;
    /*if(px+sw/2 < camera_x || px >= camera_x + SCREEN_W || py+sh/2 < camera_y || py > camera_y + SCREEN_H){
        return;
    }else{*/
        vcon.drawImage(yasushiImage,sx,sy,sw,sh,px-sw/8,py,sw/4,sh/4);
    /*}*/   
}

//やきいもを描画するメソッド
function drawYakiimo(x,y){
    let sx = esa[0].x;
    let sy = esa[0].y;
    let sw = esa[0].w;
    let sh = esa[0].h;

    let px = (x>>8)-sw/36;
    let py = y>>8;
    if(px+sw/18 < camera_x || px > camera_x + SCREEN_W || py+sh/18 < camera_y || py > camera_y + SCREEN_H){
        return;
    }else{
        vcon.drawImage(esaImage,sx,sy,sw,sh,px,py,sw/18,sh/18);
    }   
}



//初期化設定
function gameinit(){
    
    setInterval(gameLoop,gamespeed);
}


function gameLoop(){

    hitnum = false;

    tyura.update();
    for(let i=tama.length-1; i>=0; i--){
        tama[i].update();
        if(tama[i].kill){
            tama.splice(i,1);
        }
    }
    for(let i=0; i<expo.length; i++){
        expo[i].update();
        if(expo[i].kill){
            expo.splice(i,1);
        }
    }
    yasushi.update();
    for(let i=yakiimo.length-1; i>=0; i--){
        yakiimo[i].update();
        if(yakiimo[i].kill){
            yakiimo.splice(i,1);
        }
    }
    
    for(let i=bigunko.length-1; i>=0; i--){
        bigunko[i].update();
        if(bigunko[i].kill){
            bigunko.splice(i,1);
        }
    }
    
    

    

    //星の描画
    vcon.fillStyle="green";
    vcon.fillRect(camera_x,camera_y,SCREEN_W,SCREEN_H);

    //也寸志の描画
    if(yasushi.hp > 0){
        yasushi.draw();
    }
    
    tyura.draw();

    for(let i =0; i < tama.length; i++){
        tama[i].draw();
    }
    for(let i=0; i<expo.length; i++){
        expo[i].draw();
    }

    for(let i=0; i<yakiimo.length; i++){
        yakiimo[i].draw();
    }

    for(let i=0; i<bigunko.length; i++){
        bigunko[i].draw();
    }

    
    
    
    camera_x = (tyura.x>>8)/FIELD_W*(FIELD_W-SCREEN_W);
    camera_y = (tyura.y>>8)/FIELD_H*(FIELD_H-SCREEN_H);

    if(yasushi.hp>0)
    {
        let sz = (SCREEN_W-20)*yasushi.hp/yasushi.mhp;
        let sz2 = SCREEN_W-20;
        //fillは中身の色、strokeは枠の色
        vcon.fillStyle="rgba(255,0,0,0.5)";
        vcon.fillRect(camera_x+10,camera_y+12,sz,10);
        vcon.strokeStyle="rgba(255,0,0,0.9)";
        vcon.strokeRect(camera_x+10,camera_y+12,sz2,10);

    }
    if(yasushi.count >= 185 && yasushi.count <= 305){
        vcon.font="10px 'Impact'";
        vcon.fillStyle="white";
        vcon.fillText("ちゅらおいで～💛",280,345);
    }
    if(yasushi.yasushiflag){
        vcon.font="10px 'Impact'";
        vcon.fillStyle="white";
        vcon.fillText("くさっ！！",300,345);
    }
    if(yasushi.imoflag){
        vcon.font="10px 'Impact'";
        vcon.fillStyle="white";
        vcon.fillText("ちゅら！おいも～",280,345);
    }
    
    

    /*if(hitnum){
        vcon.font="20px 'Impact'";
        vcon.fillStyle="white";
        vcon.fillText("ワンッ！！",a,b);
    }*/
        
    //仮想画面から実際のキャンバスにコピー
    con.drawImage(vcan,camera_x,camera_y,SCREEN_W,SCREEN_H,0,0,canvas_W,canvas_H);
    if(dbagflag){
        con.font="20px 'Impact'";
        con.fillStyle="white";
        con.fillText("うんちの数:" + tama.length,20,20);
        con.font="20px 'Impact'";
        con.fillStyle="white";
        con.fillText("やきいもの数:" + yakiimo.length,20,40);
    }
    con.font="20px 'Impact'";
    con.fillStyle="white";
    if(yasushi.hp <=0){
        finish = true;
    }
    if(finish)
    {
        let s = "Push 'R' key to restart!!";
        let w = con.measureText(s).width;
        let x = canvas_W/2 - w/2;
        let y = canvas_H/2 - 20;
        con.fillText(s,x,y);
        s = "やすしを倒した";
        w = con.measureText(s).width;
        x = canvas_W/2 - w/2;
        y = canvas_H/2 - 40;
        con.fillText(s,x,y);

    }
}
    

window.onload=function(){
    gameinit();
}