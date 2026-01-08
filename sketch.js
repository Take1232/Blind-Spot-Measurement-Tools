let posx0,
  x0 = 300,
  posx,
  referenceX,
  count,
  migi = true;
let clickCount = 0;
let pixelSize, observationDistance;
let distances = [];

function setup() {
  createCanvas(windowWidth, 250);
  angleMode(DEGREES);

  //リセットボタン
  button2 = createButton("リセット (r)");
  button2.size(150, 40);
  button2.position(width / 2, 202);
  button2.mousePressed(reset);
  //左右切り替えボタン
  button3 = createButton("左右切り替え (c)");
  button3.size(150, 40);
  button3.position(width / 2 - 150, 202);
  button3.mousePressed(change);
  //ピクセルサイズ入力フォーム
  pixelSize = select('#input_pixelSize');
  //観察距離の入力フォーム
  observationDistance = select('#input_obsDist');
  //初期値の設定
  referenceX = width / 2 - x0;
  posx0 = referenceX + x0;
  posx = referenceX + x0;
  count = 0;
  //描写速度の設定
  frameRate(10);
}

function draw() {
  background(230);
  grid();
  //注視点の表示
  push();
  strokeWeight(6);
  line(referenceX - 15, 100, referenceX + 15, 100);
  line(referenceX, 100 - 15, referenceX, 100 + 15);
  pop(); // 刺激の表示
  fill(255, 0, 0);
  ellipse(posx, 100, 15, 15);
  posx += count;
  
  //盲点距離の表示
  let distance = dist(referenceX, 100, posx, 100);
  fill(0);
  textSize(24);
 
 // 残像の表示
  if (migi) {
    ellipse(referenceX + distances[0], 100, 15, 15);
    ellipse(referenceX + distances[1], 100, 15, 15);
  } else {
    ellipse(referenceX - distances[0], 100, 15, 15);
    ellipse(referenceX - distances[1], 100, 15, 15);
  }
  
  //データ表の表示
  updateTable();
}

function stop() {
  if (migi == true) {
    if (count == 0) {
      count = 1;
    } else {
      count = 0;
    }
  }
  if (migi == false) {
    if (count == 0) {
      count = -1;
    } else {
      count = 0;
    }
  }
}

function reset() {
  posx = posx0;
  count = 0;
  distances = [];
  clickCount = 0;
}

function change() {
  if (migi == true) {
    migi = false;
    //初期値変更
    referenceX = width / 2 + x0;
    reset();
  } else {
    migi = true;
    //初期値変更
    referenceX = width / 2 - x0;
    reset();
  }
}

function rec_distance() {
  let d = dist(referenceX, (1 / 2) * height, posx, (1 / 2) * height);
  distances.push(d);
}

function grid() {
  push();
  translate(width / 2, 0);
  strokeWeight(0.5);
  for (let i = 0; i < width / 2 + 50; i += 50) line(i, 0, i, 200);
  for (let i = 0; i < 200 + 50; i += 50) line(0, i, width / 2, i);
  for (let i = -50; i > -width / 2 - 50; i -= 50) line(i, 0, i, 200);
  for (let i = 0; i < 200 + 50; i += 50) line(0, i, -width / 2, i);
  pop();
}

function updateTable() {
    let data1 = distances[0];
    let data2 = distances[1];
    let Average = (data1 + data2) / 2;
    
    // HTMLの入力フォームから値を取得
    let px = int(pixelSize.value());
    let L = int(observationDistance.value());
    
    let l = (L * 10 * 100) / px;
    let mouten = atan2(Average, l);
    let moutenFormatted = mouten.toFixed(2);
    
    // ---------------------------------------------------
    // HTMLのセルにデータを挿入
    // ---------------------------------------------------
    
    // 消失点/出現点/平均値
    document.getElementById('data_d1').textContent = data1 ? data1.toFixed(2) : "-";
    document.getElementById('data_d2').textContent = data2 ? data2.toFixed(2) : "-";
    document.getElementById('data_avg').textContent = Average ? Average.toFixed(2) : "-";
    
    // 角度
    document.getElementById('data_angle').textContent = isNaN(mouten) ? "-" : moutenFormatted;
}

function keyTyped() {
  if (keyCode == ENTER) {
    if (clickCount == 0) {
      stop();
      clickCount++;
    } else if (clickCount == 1) {
      rec_distance();
      clickCount++;
    } else if (clickCount == 2) {
      rec_distance();
      clickCount++;
    } else if (clickCount == 3) {
      stop();
      clickCount++;
    }
    
  }
  if (key == "r") {
    reset();
  }
  if (key == "c") {
    change();
  }
}
