
var GROUP = {
};

GROUP.LIST = [
	GROUP.ENEMY = 0, 
	GROUP.MIKATA = 1, 
];

function Chara()
{
	var self = Drawable();
	
	self.init = function ()
	{
		self.img = [];
		self.disappear = false;
		self.hp = 1;
		self.hit_flag = true;
		self.fid = -1;
	}
	
	self.draw = function (field, g)
	{
		for (var i=0; i<self.img.length; i++)
		{
			var img = self.img[i];
			g.drawImage(img.img, img.sx, img.sy, img.sw, img.sh, self.x-img.ox, self.y-img.oy, self.w, self.h);
		}
	};
	
	self.move = function (field, dx, dy, spd, out_screen)
	{
		self.x += dx * spd;
		self.y += dy * spd;
		if (!out_screen)
		{
			if (self.x < 0)
			{
				self.x = 0;
			}
			if (self.x > field.range_x)
			{
				self.x = field.range_x;
			}
			if (self.y < 0)
			{
				self.y = 0;
			}
			if (self.y > field.range_y)
			{
				self.y = field.range_y;
			}
		}
	}
	
	self.fire = function (field, attack)
	{
		if (!(attack instanceof Array))
		{
			attack = [attack];
		}
		for (var i=0; i<attack.length; i++)
		{
			var data = attack[i];
			data.x = self.x + data.ox;
			data.y = self.y + data.oy;
			var shot = Shot(data);
			field.add_attack(shot, shot.target);
		}
	}
	
	self.hit = function (field, target)
	{
		self.hp--;
		if (self.hp <= 0)
		{
			self.die(field);
		}
	}
	
	self.die = function (field)
	{
		self.disappear = true;
	}
	
	self.is_disappear = function (field)
	{
		return self.disappear;
	}
	
	self.can_hit = function ()
	{
		return self.hit_flag;
	}
	
	self.clear_shot = function (field)
	{
	}
	
	self.get_collider = function ()
	{
		return {
			x: self.x, 
			y: self.y, 
			r: self.r
		};
	}
	
	self.angle_to = function (target)
	{
		return Math.atan2(target.y-self.y, target.x-self.x);
	}
	
	self.init();
	
	return self;
}
