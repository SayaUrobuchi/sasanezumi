
// global attr for game
var game = {
	stg_stage: 1, 
};

// global settings for game (changable)
var game_settings = {
};

// global saving data, should be able to export
var global_data = {
};

var image = {};
var audio = {};

var IMAGE = {
	HOLE: "p/hole.png", 
	BG0: "p/background0.jpg", 
	RAT1: "p/nezumi1.png", 
	KIZU: "p/damaged.png", 
};

var AUDIO = {
	//MASUPA: "a/masupa.mp3", 
};

function is_preload_complete()
{
	return image.__cnt >= image.__max_cnt && audio.__cnt >= audio.__max_cnt;
}

var enemy = {};

var KEY = {
	LEFT: 37, 
	UP: 38, 
	RIGHT: 39, 
	DOWN: 40, 
	Z: 90, 
	X: 88, 
	C: 67, 
	A: 65, 
	S: 83, 
	D: 68, 
	Q: 81, 
	W: 87, 
	E: 69, 
	R: 82, 
	A1: 49, 
	A2: 50, 
	A3: 51, 
	SHIFT: 16, 
};

KEY.ACCEPT = {};
KEY.ACCEPT[KEY.MOVE_LEFT = KEY.LEFT] = true;
KEY.ACCEPT[KEY.MOVE_UP = KEY.UP] = true;
KEY.ACCEPT[KEY.MOVE_RIGHT = KEY.RIGHT] = true;
KEY.ACCEPT[KEY.MOVE_DOWN = KEY.DOWN] = true;
KEY.ACCEPT[KEY.FIRE = KEY.Z] = true;
KEY.ACCEPT[KEY.BOMB = KEY.X] = true;
KEY.ACCEPT[KEY.MODE = KEY.SHIFT] = true;
KEY.ACCEPT[KEY.RE = KEY.R] = true;
KEY.ACCEPT[KEY.Z] = true;
KEY.ACCEPT[KEY.X] = true;
KEY.ACCEPT[KEY.C] = true;
KEY.ACCEPT[KEY.A] = true;
KEY.ACCEPT[KEY.S] = true;
KEY.ACCEPT[KEY.D] = true;
KEY.ACCEPT[KEY.Q] = true;
KEY.ACCEPT[KEY.W] = true;
KEY.ACCEPT[KEY.E] = true;
KEY.ACCEPT[KEY.A1] = true;
KEY.ACCEPT[KEY.A2] = true;
KEY.ACCEPT[KEY.A3] = true;

var COLOR = {
	WHITE: "white", 
	GRAY: "#CCCCCC", 
	BLACK: "#000", 
	RED: "#FF0000", 
	GREEN: "#00FF00", 
	BLUE: "#0000FF", 
	DARK_RED: "#AA0000", 
	DARK_RED2: "#440000", 
	PURPLE: "#FF00FF", 
	YELLOW: "#FFFF66", 
	TRANSPARENT: rgba(0, 0, 0, 0), 
};

COLOR.TEXT = COLOR.GRAY;
COLOR.TALK_BACK = COLOR.DARK_RED;
COLOR.TALK_BACK_INACTIVE = COLOR.DARK_RED2;

var UI = {
	DEFAULT_FONT: "Microsoft JhengHei", 
	DEFAULT_ASCII_FONT: "monospace", 
	UI_FONT: "monospace", 
	STAGE: {}, 
};

UI.SCREEN = {
	WIDTH: 1280, 
	HEIGHT: 720, 
};

UI.LOADING = {
	TEXT: "少女熱身中", 
	TEXT_COLOR: COLOR.TEXT, 
	FONT: "60px "+UI.DEFAULT_FONT, 
	ANI_IN_FCNT: 24, 
	ANI_OUT_FCNT: 8, 
};

UI.STAGE.TIME = {
	TITLE_TEXT: "時間：", 
	TEXT_COLOR: COLOR.TEXT, 
	BORDER_COLOR: COLOR.BLACK, 
	TITLE_FONT: "48px "+UI.DEFAULT_FONT, 
	FONT: "48px "+UI.UI_FONT, 
};

UI.STAGE.HP = {
	TITLE_TEXT: "耐心：", 
	TEXT_COLOR: COLOR.TEXT, 
	BORDER_COLOR: COLOR.BLACK, 
	TITLE_FONT: "48px "+UI.DEFAULT_FONT, 
	FONT: "48px "+UI.UI_FONT, 
};

UI.STAGE.MP = {
	TITLE_TEXT: "怒氣：", 
	TEXT_COLOR: COLOR.TEXT, 
	BORDER_COLOR: COLOR.BLACK, 
	TITLE_FONT: "48px "+UI.DEFAULT_FONT, 
	FONT: "48px "+UI.UI_FONT, 
};

UI.SUB = {
	OFFSET_X: 500, 
	OFFSET_Y: 0, 
	WIDTH: 300, 
	HEIGHT: UI.SCREEN.HEIGHT, 
	BACKGROUND_COLOR: rgb(0x44, 0x44, 0xAA), 
	FONT: "24px "+UI.DEFAULT_FONT, 
	COLOR: COLOR.TEXT, 
	ZANKI_TEXT: "殘機", 
	ZANKI_X: 10, 
	ZANKI_Y: 10, 
	MANA_TEXT: "魔力", 
	MANA_X: 10, 
	MANA_Y: 44, 
	MANA_BAR_WIDTH: 128, 
	MANA_BAR_HEIGHT: 20, 
	MANA_COLOR: [COLOR.DARK_RED, COLOR.YELLOW, COLOR.GREEN], 
	CTRL_TEXT: [
		"閃避：←↓↑→", 
		"回絕：Z", 
		"威嚇：X", 
		"謹慎：SHIFT", 
	], 
	CTRL_X: 10, 
	CTRL_Y: 470, 
	CTRL_H: 30, 
};

UI.MIKATA = {
	MESS_FONT: "14px "+UI.DEFAULT_ASCII_FONT, 
	MESS_SX: 0, 
	MESS_SY: 0, 
	MESS_EX: 0, 
	MESS_EY: -20, 
	MESS_COLOR: COLOR.RED, 
	MESS_DEAD: "RECEIVED!", 
	MESS_BOMB: "REJECT!", 
	MESS_FSPD: 0.04, 
	MESS_SFCNT: 48, 
	MESS_ASPD: 0.03, 
};

UI.ENEMY = {
	LVL_NAME_FONT: "20px "+UI.DEFAULT_FONT, 
	HP_ANI_SPD: 0.01, 
};

UI.TALK = {
	X: 16, 
	TOP_Y: 16, 
	MID_Y: 232, 
	BOT_Y: 452, 
	CORN_SIZE: 16, 
	WIDTH: 436, 
	HEIGHT: 100, 
	FROM_X0: 240, 
	FROM_X1: 264, 
	FROM_OX: 64, 
	FROM_OY: 64, 
	TACHIE_LEFT_X: 120, 
	TACHIE_RIGHT_X: 380, 
	TACHIE_Y: 300, 
	FONT: "20px "+UI.DEFAULT_FONT, 
	NAME_X: 20, 
	NAME_Y: 20, 
	TEXT_X: 40, 
	TEXT_Y: 50, 
	TEXT_HEIGHT: 24, 
};

UI.GAMEOVER = {
	FONT: "80px "+UI.DEFAULT_FONT, 
	COLOR: COLOR.TEXT, 
	X: UI.SCREEN.WIDTH/2, 
	Y: UI.SCREEN.HEIGHT/2, 
	TEXT: "那傢伙不開心惹", 
	FONT2: "24px "+UI.DEFAULT_FONT, 
	COLOR2: COLOR.RED, 
	X2: UI.SCREEN.WIDTH/2, 
	Y2: UI.SCREEN.HEIGHT/2+60, 
	TEXT2: "按R投幣重試", 
};

UI.CLEAR = {
	FONT: "80px "+UI.DEFAULT_ASCII_FONT, 
	COLOR: COLOR.TEXT, 
	X: UI.SCREEN.WIDTH/2, 
	Y: UI.SCREEN.HEIGHT/2, 
	TEXT: "CONGRATULATIONS!!", 
	FONT2: "24px "+UI.DEFAULT_ASCII_FONT, 
	COLOR2: COLOR.RED, 
	X2: UI.SCREEN.WIDTH/2, 
	Y2: UI.SCREEN.HEIGHT/2+60, 
	TEXT2: "PRESS X TO CONTINUE", 
};

