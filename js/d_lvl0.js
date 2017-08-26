
var level = {};

var LEVEL_TEMPLATE = {
	hole: [], 
	hole_x_shift: 100, 
	hole_y_shift: 140, 
	background_img_id: "BG0", 
	rat: [], 
	hit_miss_penalty: 32, 
};

var HOLE_TEMPLATE = {
	x: 0, 
	y: 0, 
	w: 300, 
	h: 256, 
	cx: 150, 
	cy: 168, 
	img_id: "HOLE", 
	key: 0, 
};

var RAT_TEMPLATE = {
	// display related
	x: 0, 
	y: 0, 
	scale: 1, 
	kizu_scale: 1, 
	img_id: "RAT1", 
	hit_down: 64, 
	// difficulty
	appear_time: 24, 
	stay_time: 48, 
	disappear_time: 16, 
	hit_time: 20, 
	hit_die_time: 28, 
	hit_extra_stay: 0, 
	// status
	hp: 100, 
	hit_heal: 0, 
	hit_die_heal: 32, 
	miss_damage: 64, 
};

LEVEL_TEMPLATE.init = function (self)
{
	var x_shift = self.hole_x_shift;
	var y_shift = self.hole_y_shift;
	for (var i=0; i<self.hole.length; i++)
	{
		var img_id = self.hole[i].img_id;
		var hole = self.hole[i];
		if (!image[img_id])
		{
			console.log("error: 未知的 hole id: ["+img_id+"]");
		}
		else
		{
			var img = image[img_id];
			hole.hole_img = img;
			hole.rat_x = hole.x+x_shift + hole.cx;
			hole.rat_y = hole.y+y_shift + hole.cy;
			hole.draw_x = hole.rat_x - img.width/2;
			hole.draw_y = hole.rat_y - img.height/2;
		}
	}
	self.bg_img = image[self.background_img_id];
	self.spawn = [];
	self.hole_pool = [];
	self.hole_occupied = [];
	self.key_to_hole = {};
	for (var i=0; i<self.hole.length; i++)
	{
		self.hole_pool.push(self.hole[i]);
		self.key_to_hole[self.hole[i].key] = self.hole[i];
	}
}

function hole_draw_order_compare(a, b)
{
	if (a.y < b.y)
	{
		return a.y - b.y;
	}
	return a.x - b.x;
}
