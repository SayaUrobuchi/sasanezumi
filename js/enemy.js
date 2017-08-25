
var ENEMY = {
	MOVE_NONE: function (field, self)
	{
	}, 
	SHOT_NONE: function (field, self)
	{
	}, 
	DRAW_NORMAL: function (field, g, self)
	{
		g.drawImage(self.data.img, 
			self.data.sx, self.data.sy, self.data.sw, self.data.sh, 
			self.x-self.data.w/2, self.y-self.data.h/2, self.data.w, self.data.h);
	}, 
	DIE_DISAPPEAR: function (field, self)
	{
		self.disappear = true;
	}, 
};

var ENEMY_TEMPLATE = {
	hp: 512, 
	sw: 32, 
	sh: 32, 
	w: 32, 
	h: 32, 
	x: 250, 
	y: 80, 
	r: 20, 
	move: ENEMY.MOVE_NONE, 
	shot: ENEMY.SHOT_NONE, 
	draw: ENEMY.DRAW_NORMAL, 
	die: ENEMY.DIE_DISAPPEAR, 
};

function Enemy(data)
{
	var self = Chara();
	
	self.init = function ()
	{
		self.data = data;
		self.hp = data.hp;
		self.mhp = data.hp;
		self.x = data.x;
		self.y = data.y;
		self.r = data.r;
		self.lvl = 0;
		self.state = 0;
		self.hp_bar_rate = 0;
		//self.lvl = 3;
	};
	
	self.update = function (field)
	{
		if ((field.state == STG.BATTLE || field.state == STG.ENEMY_DEFEAT) && self.fid != field.fid)
		{
			self.fid = field.fid;
			self.data.move(field, self);
			self.data.shot(field, self);
			self.update_hp(field);
			self.update_defeat(field);
		}
	}
	
	self.update_hp = function (field)
	{
		self.real_hp_rate = self.hp / self.mhp;
		var dis = self.real_hp_rate - self.hp_bar_rate;
		var dir = (dis < 0 ? -1 : 1);
		dis = Math.abs(dis);
		if (dis > UI.ENEMY.HP_ANI_SPD)
		{
			dis = UI.ENEMY.HP_ANI_SPD;
		}
		self.hp_bar_rate += dis*dir;
	}
	
	self.update_defeat = function (field)
	{
		switch (self.state)
		{
		case 0:
			self.bomb = [];
			self.bf = 30;
			self.bc = 0;
			self.state = 1;
			field.state = STG.ENEMY_DEFEAT;
			field.ss = 0;
			break;
		case 1:
			if (self.bf-- <= 0)
			{
				self.bc++;
				if (self.bc <= 3)
				{
					var b = {
						cnt: 0, 
						fcnt: 48, 
						r: 64, 
						sy: -30, 
					};
					switch (self.bc)
					{
					case 1:
						b.x = 0;
						b.y = 18;
						break;
					case 2:
						b.x = -14;
						b.y = 0;
						break;
					case 3:
						b.x = 18;
						b.y = -12;
						break;
					}
					self.bomb.push(b);
				}
				else if (self.bc <= 4)
				{
					var b = {
						cnt: 0, 
						fcnt: 72, 
						r: 144, 
						x: 0, 
						y: -20, 
						sy: -52, 
					};
					self.bomb.push(b);
					self.hide = true;
				}
				else
				{
					if (self.bomb[3].cnt > self.bomb[3].fcnt)
					{
						self.disappear = true;
						if (field.state == STG.ENEMY_DEFEAT)
						{
							field.ss = 1;
						}
					}
				}
				self.bf = 24;
			}
			break;
		}
	}
	
	self.draw = function (field, g)
	{
		if (!self.hide)
		{
			self.data.draw(field, g, self);
		}
		self.draw_hp_bar(field, g);
		self.draw_lvl_name(field, g);
		self.draw_defeat(field, g);
	}
	
	self.draw_hp_bar = function (field, g)
	{
		var len = field.range_x-40;
		g.fillStyle = COLOR.GREEN;
		g.fillRect(20, 10, len*self.hp_bar_rate, 16);
		g.strokeStyle = COLOR.RED;
		g.lineWidth = 2;
		g.strokeRect(20, 10, len, 16);
	}
	
	self.draw_lvl_name = function (field, g)
	{
		if (self.lvl < self.data.lvl_name.length)
		{
			g.font = UI.ENEMY.LVL_NAME_FONT;
			g.textAlign = "center";
			g.textBaseline = "middle";
			g.fillStyle = COLOR.TEXT;
			g.fillText(self.data.lvl_name[self.lvl], field.range_x/2, 50);
			g.strokeStyle = COLOR.RED;
			g.lineWidth = 0.2;
			g.strokeText(self.data.lvl_name[self.lvl], field.range_x/2, 50);
		}
	}
	
	self.draw_defeat = function (field, g)
	{
		if (self.defeat)
		{
			for (var i=0; i<self.bomb.length; i++)
			{
				var data = self.bomb[i];
				data.cnt++;
				if (data.cnt <= data.fcnt)
				{
					var p = data.cnt / data.fcnt;
					var x = data.x + self.x;
					var y = data.y + self.y + sin_f(0, data.sy, p);
					var r = sin_f(0, data.r, p);
					var c = g.createRadialGradient(x, y, 0, x, y, r);
					c.addColorStop(0, "#FFFF66");
					c.addColorStop(0.4, "#FF6600");
					c.addColorStop(0.8, "#FF0000");
					c.addColorStop(1, "#000000");
					g.fillStyle = c;
					g.beginPath();
					g.arc(x, y, r, 0, PI2);
					var temp = g.globalAlpha;
					g.globalAlpha = cos_f(1, 0, p);
					g.fill();
					g.globalAlpha = temp;
				}
			}
		}
	}
	
	self.hit = function (field, target)
	{
		if (!target.mc)
		{
			self.take_damage(field, 1);
		}
	}
	
	self.take_damage = function (field, value)
	{
		self.hp -= value;
		if (self.hp <= 0)
		{
			self.hp = 0;
			self.die(field);
		}
	}
	
	self.die = function (field)
	{
		self.lvl++;
		self.state = 0;
		field.clear_shot(GROUP.MIKATA);
		if (self.lvl >= self.data.lvl_name.length)
		{
			self.hit_flag = false;
			self.defeat = true;
			self.bomb = [];
		}
		else
		{
			self.hp = self.mhp;
		}
	}
	
	self.init();
	
	return self;
}

