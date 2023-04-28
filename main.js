var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

var img1 = new Image();
img1.src = 'cat_m1.png';

var img2 = new Image();
img2.src = 'cat_m2.png';


// 캐릭터 등장 좌표, 사이즈, 속성
var cat = {
    x: 10,
    y: 200,
    width: 100,
    height: 50,
    move : img1, // 기본 cat 이미지
    draw() {
        // ctx.fillStyle = 'green';
        // ctx.fillRect(this.x,this.y,this.width,this.height);
        ctx.drawImage(this.move, this.x, this.y)
    },
    changeImg() { // cat 움직이는 애니메이션 추가
        if (this.move == img1) {
            this.move = img2;
        }else {
            this.move = img1;
        }
    }
}

// 캐릭터 그리기
cat.draw();



// 장애물 이미지 불러오기
var img3 = new Image();
img3.src = 'wave.png';

var img4 = new Image();
img4.src = 'wave2.png';

var img5 = new Image();
img5.src = 'wave3.png';

// 장애물 속성
class Wave {
    constructor() {
        // 장애물 등장 좌표
        this.x = 500;
        this.y = 200;
        this.width = 50;
        this.height = 50;
        this.animation = [img3, img4, img5]; // 이미지 배열 넣기
        this.animationIndex = 0; // 기본 이미지
        this.animationDelay = 7; // 애니메이션 속도
        this.animationDelayCount = 0; // 애니메이션 속도 카운트
    }
    draw() {
        // 이미지를 var로 선언 후 밑의 코드처럼 사용
        ctx.drawImage(this.animation[this.animationIndex], this.x, this.y);
    
        this.animationDelayCount++;
        if(this.animationDelayCount >= this.animationDelay) {
            this.animationDelayCount = 0;
            this.animationIndex++;
            if (this.animationIndex >= this.animation.length) {
                this.animationIndex = 0;
            }
        }
    }
}

// 장애물 그리기
var wave = new Wave();
wave.draw();


var score = 0; // 점수

function drawScore() { // 점수 그리기
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("기록: " + score, canvas.width - 150, 50);
}



var timer = 0;
var wave2 = [];
var jumpTimer = 0;
var jumpHeight = 100;
var animation;
var jumping = false; // 점프 중인가?


// 1초에 60번 코드 실행하기
function frame() {
 animation = requestAnimationFrame(frame) // 웹 브라우저 기본 기능 requestAnimationFrame() 사용
 timer ++;

 if (timer % 15 === 0) { // 15프레임 중 한 번(cat 애니메이션 구현)
        cat.changeImg();
        wave.animationIndex++;
 }

 // canvas 초기화 (캐릭터 이동 잔상 지우기)
 ctx.clearRect(0,0,canvas.width,canvas.height);

 // 1초에 한 번 wave 그리기
 if (timer % 200 === 0 ){ // 120프레임 중 한 번
     var wave = new Wave();
     
     // wave2 배열 생성 후 catcus 계속 생성해서 보관
     wave2.push(wave);
     score++;
     }

    wave2.forEach((a, i, o)=> { // cacuts2 배열에 있는 거 다 그리기
        // a.x --; // x좌표 1씩 감소하기 때문에 캐릭터 쪽으로 이동

        // x좌표가 0미만이면 제거하기
        if (a.x < 0 ) {
            o.splice(i,1);
        }
        a.x -= 2;

        // 충돌 체크는 여기서
        충돌(cat, a);

        a.draw();

        if (timer % 15 === 0) {
            cat.changeImg();
            wave.changeImg();
        }
    })

    // 스페이스바 누를 시 캐릭터 점프 기능
    // if (jump == true) {
    //     cat.y -= 2;
    //     jumpTimer++;
    // }
    // if (jump == false) { // 200px 이상으로 올라가지 않도록
    //     if(cat.y < 200)
    //     cat.y++;
    // }
    // if(jumpTimer > 50) {
    //     jump = false;
    //     jumpTimer = 0;
    // }

    if (jump == true) {
        if (cat.y > jumpHeight) {
            cat.y -= 2; // 점프 속도
            jumpTimer++;
            cat.move = img1; // 점프 중 애니메이션 정지
        } else {
            jump = false;
            jumpTimer = 0;
            jumping = true; // 점프 중
        }
    } else {
        if(cat.y < 200) {
            cat.y++;
            cat.move = img1;
        } else {
            jumping = false; // 점프 끝

        }
    }

    cat.draw();
    drawScore();

}

frame();

// 충돌 체크
function 충돌(cat, wave) {
    var x축차이 = wave.x - (cat.x + cat.width);
    var y축차이 = wave.y - (cat.y + cat.height);
    if (x축차이 < 0 && y축차이 < 0) {
        ctx.clearRect(0,0, canvas.width, canvas.height); // 캔버스 초기화
        cancelAnimationFrame(animation) // 애니메이션 정지
    } else {
    score ++;
    }
}


var jump = false;

document.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && jump == false && jumping == false) {
        jump = true;
    }
})