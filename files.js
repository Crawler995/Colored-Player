var uploadMusic = document.getElementById('upload-music');
var ul = document.getElementsByTagName('ul')[0];
var audio = document.getElementsByTagName('audio')[0];
var li = document.getElementsByTagName('li');
var cycleMode = document.getElementsByClassName('cycle-mode')[0];
//音乐文件路径，音乐文件名字
var musicURL = new Array();
var musicName = new Array();

//为后面的添加音乐准备
//previousMusicNum
var preMusicNum = 0;
//为后面的，当前播放音乐的li元素背景颜色改变做准备
//有时候指present，有时候指previous...
var preMusicIndex, times = 0;

var isSingleCycle = false;

var win = nw.Window.get();


uploadMusic.onchange = function () {
	//遍历上传文件数组，将URL和名字存入数组
	for (var i = 0; i < uploadMusic.files.length; i++) {
		musicURL.push(URL.createObjectURL(uploadMusic.files[i]));
		musicName.push(uploadMusic.files[i].name);
	}

	updateMusicList();
}

audio.addEventListener('ended',function () {
	if(!isSingleCycle){
		nextMusic();
	}
	audio.play();
});


//更新音乐列表GUI
function updateMusicList() {
	for (var i = preMusicNum; i < musicName.length; i++) {
		var newLi = document.createElement('li');
		newLi.innerHTML = musicName[i];
		//双击列表播放
		newLi.addEventListener('dblclick',play);
		//记录li元素的索引
		newLi.index = i;

		ul.appendChild(newLi);
	}
	preMusicNum = musicName.length;
}

function play() {
	audio.src = musicURL[this.index];
	audio.play();

	initAudio();
	//将之前播放的音乐对应li背景颜色归为默认
	//将正在播放的音乐对应li背景颜色改变
	if(times++){
		li[preMusicIndex].style.backgroundColor = 'inherit';
	}
	li[this.index].style.backgroundColor = '#ffffff6b';
	preMusicIndex = this.index;
}

function pause() {
	if(audio.paused){
		audio.play();
		document.getElementsByClassName('play-pause')[0].innerHTML = '暂 停';
	}else{
		audio.pause();
		document.getElementsByClassName('play-pause')[0].innerHTML = '播 放';
	}
}

//上一首
function preMusic() {
	li[preMusicIndex].style.backgroundColor = 'inherit';
	if(preMusicIndex == 0){
		audio.src = musicURL[musicURL.length - 1];
		preMusicIndex = musicURL.length - 1;
	}else{
		audio.src = musicURL[--preMusicIndex];
	}
	li[preMusicIndex].style.backgroundColor = '#ffffff6b';
}

//下一首
function nextMusic() {
	li[preMusicIndex].style.backgroundColor = 'inherit';
	if(preMusicIndex == musicURL.length - 1){
		audio.src = musicURL[0];
		preMusicIndex = 0;
	}else{
		audio.src = musicURL[++preMusicIndex];
	}
	li[preMusicIndex].style.backgroundColor = '#ffffff6b';
}

//改变循环模式
function changeCycleMode() {
	if(isSingleCycle){
		cycleMode.innerHTML = '顺序播放';
		isSingleCycle = false;
	}else{
		cycleMode.innerHTML = '单曲循环';
		isSingleCycle = true;
	}
}

//窗口操作
function minimize() {
	win.minimize();
}
function closed() {
	win.hide();
	win.close(true);
}

function cleanAll() {
	musicURL.length = 0;
	musicName.length = 0;

	for(var i = li.length - 1; i >= 0; i--){
		ul.removeChild(li[i]);
	}

	preMusicNum = 0;
	times = 0;
	audio.pause();
}
