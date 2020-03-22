var settings = {
	//mask层初始rgb值
	initR : 133,
	initG : 53,
	initB : 3,
	//rgb值每次变化值
	delta : 1,

	isDrawingSpectrum : false,
	isChangingMaskColor : false,

	rectNum : 16,
	rectWidth : 14,
	divide : 6,
	rectBottomY : 300,
	rectBottomX : 90,

	activeColor : '#ffffff6b',
	stillColor : '#ffffff44',
	bottomRectColor : '#ffffff29',
	timeColor : '#ffffff6b',

	circleRadius : 5,
	circleColor : '#ff7575a1',
	circleDropSpeed : 0.55

};

var mask = document.getElementsByClassName('mask')[0];
var controlMask = document.getElementsByClassName('control-mask')[0];
var controlSpectrum = document.getElementsByClassName('control-spectrum')[0];
var flag;
var averageArray = new Array();
var circleY = new Array();
var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext('2d');

var audioContext = new AudioContext();
var source = audioContext.createMediaElementSource(audio);
var analyser = audioContext.createAnalyser();


//通过改变mask层的rgb值来达到渐变颜色的效果
function changeMaskColor() {
	flag = setInterval(function () {
		if(settings.initR < 133 && settings.initB == 53){
			settings.initR += settings.delta;
		}else if(settings.initB > 3 && settings.initR == 133){
			settings.initB -= settings.delta;
		}else if(settings.initR > 3 && settings.initB == 3){
			settings.initR -= settings.delta;
		}else if(settings.initB < 53 && settings.initR == 3){
			settings.initB += settings.delta;
		}
		mask.style.backgroundColor = 'rgb(' + settings.initR +',' + settings.initG +',' + settings.initB +')';
	},200);	
}

function changeMaskMode() {
	if(settings.isChangingMaskColor){
		controlMask.innerHTML = '开启动态背景';
		settings.isChangingMaskColor = false;
		clearInterval(flag);
	}else{
		controlMask.innerHTML = '关闭动态背景';
		settings.isChangingMaskColor = true;
		changeMaskColor();
	}
}

function initAudio() {
	source.connect(analyser);
	analyser.connect(audioContext.destination);

	initCircleY();

	drawSpectrum(analyser);
}

function analyseFrequency(analyser) {
	var frequencyArray = new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(frequencyArray);
	averageArray.length = 0;

	for(var i = 0; i < frequencyArray.length; i += frequencyArray.length / settings.rectNum){
		var sum = 0;
		for(var j = i; j < i + settings.rectNum; j++){
			sum += frequencyArray[j];
		}
		var average = Math.round(sum / settings.rectNum);
		averageArray.push(average);

		//console.log(average);
	}
}

function drawSpectrum(analyser) {
	analyseFrequency(analyser);
	ctx.clearRect(0,0,500,400);
	if(settings.isDrawingSpectrum){
		
		//console.log('drawing');
		for(var i = 0; i < settings.rectNum; i++){
			//小球纵坐标处理
			if(settings.rectBottomY - averageArray[i] < circleY[i] + settings.circleRadius){
				circleY[i] = settings.rectBottomY - averageArray[i] - settings.circleRadius;
			}else{
				circleY[i] += settings.circleDropSpeed;
			}
			//绘制进度条上方
			//console.log(averageArray[i]);
			ctx.fillStyle = settings.activeColor;
			ctx.fillRect(settings.rectBottomX + (settings.rectWidth + settings.divide) * i, 
				settings.rectBottomY - averageArray[i], settings.rectWidth, averageArray[i]);

			//ctx.fillRect(50, 50,50, 50);
			//绘制进度条下方
			ctx.fillStyle = settings.bottomRectColor;
			ctx.fillRect(settings.rectBottomX + (settings.rectWidth + settings.divide) * i,
				settings.rectBottomY + 6, settings.rectWidth, averageArray[i] / 5);
			//绘制小球
			ctx.fillStyle = settings.circleColor;
			ctx.beginPath();
			ctx.arc(settings.rectBottomX + (settings.rectWidth + settings.divide) * i + settings.rectWidth / 2,
				circleY[i], settings.circleRadius, 0, Math.PI*2, true);
			ctx.fill();
			ctx.closePath();
			//绘制小球之间连线
			
			if(i < settings.rectNum - 1) {
				ctx.strokeStyle = settings.circleColor;
				ctx.beginPath();
				ctx.moveTo(settings.rectBottomX + (settings.rectWidth + settings.divide) * i + settings.rectWidth / 2,
					circleY[i]);
				ctx.lineTo(settings.rectBottomX + (settings.rectWidth + settings.divide) * (i + 1) + settings.rectWidth / 2,
					circleY[i+1]);
				ctx.stroke();
			}
		}
		//绘制进度条
		ctx.fillStyle = settings.stillColor;
		ctx.fillRect(settings.rectBottomX -6, settings.rectBottomY + 2,
			(settings.rectWidth + settings.divide) * settings.rectNum + 2, 2);
		ctx.fillStyle = settings.circleColor;
		ctx.fillRect(settings.rectBottomX -6, settings.rectBottomY + 2, 
			Math.round((audio.currentTime/ 
				audio.duration) * (settings.rectWidth + settings.divide) * settings.rectNum + 2), 2);

		ctx.fillStyle = settings.timeColor;
		ctx.font = '14px Helvetica';
		if(audio.duration && audio.currentTime){
			ctx.fillText(Math.round(audio.currentTime) % audio.duration, 50,307);
			ctx.fillText(Math.round(audio.duration), 420 ,307);
		}

	}
	window.requestAnimationFrame(function () {
		drawSpectrum(analyser);
	});
	
}

function startDrawSpectrum() {
	if(!settings.isDrawingSpectrum) {
		settings.isDrawingSpectrum = true;
		controlSpectrum.innerHTML = '关闭频谱';
	}
	else{
		settings.isDrawingSpectrum = false;
		controlSpectrum.innerHTML = '开启频谱';
	}
	
}

function initCircleY() {
	for(var i = 0; i < settings.rectNum; i++){
		circleY.push(settings.rectBottomY - settings.circleRadius);
	}
}