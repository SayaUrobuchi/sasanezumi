
var scene;
var canvas;
var c_context;

function preload()
{
	var cnt = 0;
	image.__cnt = 0;
	for (var key in IMAGE)
	{
		cnt++;
		if (!image[key])
		{
			var img = new Image();
			img.addEventListener("load", preload_image_callback, true);
			img.src = IMAGE[key];
			image[key] = img;
		}
	}
	image.__max_cnt = cnt;
	
	cnt = 0;
	audio.__cnt = 0;
	for (var key in AUDIO)
	{
		cnt++;
		if (!audio[key])
		{
			var sound = new Audio();
			sound.addEventListener("canplaythrough", preload_audio_callback, true);
			sound.preload = 'auto';
			sound.src = AUDIO[key];
			audio[key] = sound;
		}
	}
	audio.__max_cnt = cnt;
}

function preload_image_callback()
{
	image.__cnt++;
}

function preload_audio_callback()
{
	audio.__cnt++;
}

function keydown(e)
{
	return scene.keydown(e);
}

function keyup(e)
{
	return scene.keyup(e);
}

function init()
{
	scene = SceneManager();
	
	canvas = document.getElementById("canvas");
	canvas.width = UI.SCREEN.WIDTH;
	canvas.height = UI.SCREEN.HEIGHT;
	c_context = canvas.getContext("2d");
	
	document.addEventListener("keydown", keydown);
	document.addEventListener("keyup", keyup);
}

function update()
{
	c_context.fillStyle = COLOR.BLACK;
	c_context.fillRect(0, 0, canvas.width, canvas.height);
	scene.update(c_context);
}

function main()
{
	init();
	scene.push(StageScene());
	setInterval(update, 16);
	//update();
}

preload();
window.onload = main;

