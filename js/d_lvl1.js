
var LEVEL1 = "LEVEL_1";

var RAT_BASE = extend(RAT_TEMPLATE, {
	scale: .8, 
	kizu_scale: 1, 
	// difficulty
	appear_time: 24, 
	stay_time: 80, 
	disappear_time: 16, 
	hit_time: 20, 
	hit_die_time: 28, 
});

var L1_YS = 120;
var L1_YS2 = 50;
level[LEVEL1] = extend(LEVEL_TEMPLATE, {
	hole: [
		extend(HOLE_TEMPLATE, {
			x: 0, 
			y: 0, 
			key: KEY.Q, 
		}), 
		extend(HOLE_TEMPLATE, {
			x: 300, 
			y: 0, 
			key: KEY.W, 
		}), 
		extend(HOLE_TEMPLATE, {
			x: 600, 
			y: 0, 
			key: KEY.E, 
		}), 
		extend(HOLE_TEMPLATE, {
			x: 0, 
			y: L1_YS, 
			key: KEY.A, 
		}), 
		extend(HOLE_TEMPLATE, {
			x: 300, 
			y: L1_YS, 
			key: KEY.S, 
		}), 
		extend(HOLE_TEMPLATE, {
			x: 600, 
			y: L1_YS, 
			key: KEY.D, 
		}), 
		extend(HOLE_TEMPLATE, {
			x: 0, 
			y: L1_YS*2+L1_YS2, 
			key: KEY.Z, 
		}), 
		extend(HOLE_TEMPLATE, {
			x: 300, 
			y: L1_YS*2+L1_YS2, 
			key: KEY.X, 
		}), 
		extend(HOLE_TEMPLATE, {
			x: 600, 
			y: L1_YS*2+L1_YS2, 
			key: KEY.C, 
		}), 
	], 
	background_img_id: "BG0", 
	rat: [
		RAT_BASE, 
	], 
});