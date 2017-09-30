
var RAT_STATE = {
	NONE: 0, 
	APPEAR: 1, 
	STAY: 2, 
	LEAVE: 3, 
	HIT: 4, 
	DIED: 8, 
};

function Rat(data)
{
	var self = {};
	
	self.init = function ()
	{
		self.state = RAT_STATE.NONE;
		self.fid = 0;
		self.img = image[data.img_id];
		self.progress = 0;
		self.hit_pos = [];
		
		// status
		self.mhp = self.hp = data.hp;
	}
	
	self.update = function (stage)
	{
		if (is_ndef(self.stay_time))
		{
			self.stay_time = data.stay_time / ((stage.stay_level+1)/8);
		}
		if (stage.state == STAGE.PLAY)
		{
			self.fid++;
		}
		switch (self.state)
		{
		case RAT_STATE.NONE:
			self.change_state(RAT_STATE.APPEAR);
			break;
		case RAT_STATE.APPEAR:
			self.progress = Math.min(1, self.fid/data.appear_time);
			if (self.fid > data.appear_time)
			{
				self.change_state(RAT_STATE.STAY);
			}
			break;
		case RAT_STATE.STAY: 
			self.progress = Math.min(1, self.fid/data.stay_time);
			if (self.fid > data.stay_time)
			{
				self.change_state(RAT_STATE.LEAVE);
				// miss damage apply
				stage.master.hp -= data.miss_damage;
			}
			break;
		case RAT_STATE.LEAVE:
			self.progress = Math.min(1, self.fid/data.disappear_time);
			if (self.fid > data.disappear_time)
			{
				self.change_state(RAT_STATE.DIED);
				self.died = true;
			}
			break;
		case RAT_STATE.HIT:
			var t = (self.hp > 0 ? data.hit_time : data.hit_die_time);
			self.progress = Math.min(1, self.fid/t);
			if (self.fid > t)
			{
				if (self.hp > 0)
				{
					self.change_state(self.state_before_hit);
					self.hit_pos = [];
					self.fid = self.temp_fid;
				}
				else
				{
					self.change_state(RAT_STATE.DIED);
					self.died = true;
				}
			}
			break;
		}
	}
	
	self.draw = function (stage, g)
	{
		if (self.hole)
		{
			var draw_width = self.img.width * data.scale;
			var draw_height = self.img.height * data.scale;
			g.save();
			{
				g.translate(self.hole.rat_x, self.hole.rat_y);
				// draw rat
				switch (self.state)
				{
				case RAT_STATE.APPEAR:
					var p = self.progress;
					var atemp = g.globalAlpha;
					g.globalAlpha = p;
					var h_rate = (0.4 + 0.6*p);
					var h = draw_height * h_rate;
					var sh = self.img.height * h_rate;
					g.drawImage(self.img, 0, 0, self.img.width, sh, -draw_width/2, -h, draw_width, h);
					g.globalAlpha = atemp;
					break;
				case RAT_STATE.STAY:
					g.drawImage(self.img, -draw_width/2, -draw_height, draw_width, draw_height);
					break;
				case RAT_STATE.LEAVE:
					var p = 1-self.progress;
					var atemp = g.globalAlpha;
					g.globalAlpha = p;
					var h_rate = (0.4 + 0.6*p);
					var h = draw_height * h_rate;
					var sh = self.img.height * h_rate;
					g.drawImage(self.img, 0, 0, self.img.width, sh, -draw_width/2, -h, draw_width, h);
					g.globalAlpha = atemp;
					break;
				case RAT_STATE.HIT:
					// hit not died
					if (self.hp > 0)
					{
					}
					// hit and died
					else
					{
						g.save();
						g.rotate(deg(30));
						{
							var p = (self.progress > .5 ? 1-(self.progress-.5)/.5 : 1);
							var atemp = g.globalAlpha;
							g.globalAlpha = p;
							var h_rate = (0.4 + 0.6*p);
							var h = (draw_height-data.hit_down) * h_rate;
							var sh = (self.img.height-data.hit_down/data.scale) * h_rate;
							g.drawImage(self.img, 0, 0, self.img.width, sh, -draw_width/2, -h, draw_width, h);
							self.draw_hit_pos(g, data.kizu_scale, draw_height-h);
							g.globalAlpha = atemp;
						}
						g.restore();
					}
					break;
				}
			}
			g.restore();
		}
	}
	
	self.draw_hit_pos = function (g, kizu_scale, y_shift)
	{
		var img = image.KIZU;
		var draw_width = 80 * kizu_scale;
		var draw_height = 80 * kizu_scale;
		for (var i=0; i<self.hit_pos.length; i++)
		{
			g.drawImage(img, self.hit_pos[i].x, self.hit_pos[i].y+y_shift, draw_width, draw_height);
		}
	}
	
	self.is_finished = function ()
	{
		return self.died;
	}
	
	self.change_state = function (next_state)
	{
		self.fid = 0;
		self.progress = 0;
		self.state = next_state;
	}
	
	self.set_hole = function (hole)
	{
		self.hole = hole;
	}
	
	self.hit = function (stage)
	{
		var hit = false;
		var master = stage.master;
		// only hit after NONE and before LEAVE
		if (self.state == RAT_STATE.HIT || (self.state > RAT_STATE.NONE && self.state < RAT_STATE.LEAVE))
		{
			if (self.hp > 0)
			{
				self.hp -= stage.master.pow;
				// master affect
				master.hp += (self.hp > 0 ? data.hit_heal : data.hit_die_heal);
				if (master.hp > 2048)
				{
					master.hp = 2048;
				}
				// rat state
				if (self.state != RAT_STATE.HIT)
				{
					self.state_before_hit = self.state;
					self.temp_fid = self.fid + data.hit_time;
				}
				self.temp_fid -= data.hit_extra_stay;
				self.gain_hit_kizu();
				self.change_state(RAT_STATE.HIT);
				hit = true;
			}
		}
		return hit;
	}
	
	self.gain_hit_kizu = function ()
	{
		var draw_width = self.img.width * data.scale;
		var draw_height = self.img.height * data.scale;
		var res = {
			x: -draw_width/2+draw_width*frand(0.1, 0.9), 
			y: -draw_height+draw_height*frand(0, 0.3), 
		};
		self.hit_pos.push(res);
	}
	
	self.init();
	
	return self;
}

