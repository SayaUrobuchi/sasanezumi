
var STAGE = {
	NONE: -1, 
	LOADING: 0, 
	READY: 1, 
	PLAY: 2, 
	GAME_OVER: 8, 
	DONE: 9, 
	END: 35, 
};

function StageScene()
{
	var self = Scene();
	
	self.init = function ()
	{
		// init state
		self.fid = 0;
		self.state = STAGE.NONE;
		
		// init level
		self.level_id = LEVEL1;
		self.load_level();
		self.time = 0;
		self.spawn_timer = 64;
		self.stay_level = 0;
		
		// init master (fake now)
		self.master = {
			pow: 150, 
			hp: 1024, 
		};
		
		// clear table
		self.clear_input();
		self.nikukyuu_list = [];
	}
	
	self.deinit = function ()
	{
	}
	
	self.load_level = function ()
	{
		if (level[self.level_id])
		{
			self.level = level[self.level_id];
			self.level.init(self.level);
		}
		else
		{
			console.log("error: 未知的 level_id: ["+self.level_id+"]");
		}
	}
	
	self.update = function (g)
	{
		if (self.state == STAGE.NONE)
		{
			self.state = STAGE.PLAY;
		}
		self.fid++;
		self.update_level(g);
	}
	
	self.update_level = function (g)
	{
		if (self.state == STAGE.PLAY)
		{
			self.time++;
			self.spawn_timer++;
			if (self.master.hp < 0)
			{
				self.state = STAGE.GAME_OVER;
				self.fid = 0;
			}
		}
		var level = self.level;
		// update rat/cat spawn/disappear
		{
			// spawn new rats
			var spawn_needed = Math.max(16, Math.floor((128 - Math.floor(self.time/60/8*4) - (self.master.hp/128+1)*4)));
			self.stay_level = Math.max(32, Math.floor(self.time/60/16+self.master.hp/256));
			if (self.state == STAGE.PLAY && self.spawn_timer >= spawn_needed)
			{
				self.spawn_timer -= spawn_needed;
				// if able to spawn
				if (level.hole_pool.length > 0)
				{
					// find an empty hole
					var dice = rand(level.hole_pool.length);
					var hole = level.hole_pool[dice];
					level.hole_pool[dice] = level.hole_pool[level.hole_pool.length-1];
					level.hole_pool.pop();
					level.hole_occupied.push(hole);
					// need to guarantee sorted for draw order
					for (var i=level.hole_occupied.length-1; i>0; i--)
					{
						if (hole_draw_order_compare(level.hole_occupied[i], level.hole_occupied[i-1]) < 0)
						{
							var temp = level.hole_occupied[i];
							level.hole_occupied[i] = level.hole_occupied[i-1];
							level.hole_occupied[i-1] = temp;
						}
						else
						{
							break;
						}
					}
					
					// decide what to put in the hole
					var rat = level.rat[0];
					
					// spawn into hole
					var spawn = Rat(rat);
					hole.rat = spawn;
					spawn.set_hole(hole);
				}
			}
			
			// update and release hole
			var jj = 0;
			for (var i=0; i<level.hole_occupied.length; i++)
			{
				var rat = level.hole_occupied[i].rat;
				rat.update(self);
				if (!rat.is_finished())
				{
					level.hole_occupied[jj++] = level.hole_occupied[i];
				}
				else
				{
					level.hole_occupied[i].rat = null;
					level.hole_pool.push(level.hole_occupied[i]);
				}
			}
			while (jj < level.hole_occupied.length)
			{
				level.hole_occupied.pop();
			}
		}
		// draw background
		{
			var img = self.level.bg_img;
			g.drawImage(img, 0, 0, UI.SCREEN.WIDTH, UI.SCREEN.HEIGHT);
		}
		// draw hole
		{
			var hole_list = level.hole;
			for (var i=0; i<hole_list.length; i++)
			{
				var hole = hole_list[i];
				var img = hole.hole_img;
				g.drawImage(img, hole.draw_x, hole.draw_y);
			}
		}
		// draw rat/cat
		{
			for (var i=0; i<level.hole_occupied.length; i++)
			{
				level.hole_occupied[i].rat.draw(self, g);
			}
		}
		// draw nikukyuu
		{
			var draw_width = 128;
			var draw_height = 128;
			var img = image.NIKUKYUU;
			var jj = 0;
			var lim_t = 24;
			var disappear_t = 20;
			var sub_t = 16;
			var shadow_scale = 1.2;
			for (var i=0; i<self.nikukyuu_list.length; i++)
			{
				var item = self.nikukyuu_list[i];
				item.t++;
				var ga_temp = g.globalAlpha;
				// sub
				if (item.hit && item.t <= sub_t)
				{
					var p = item.t / sub_t;
					var alpha = 0.6 * (1-p);
					var scale = 1 + shadow_scale*p;
					var subw = draw_width*scale;
					var subh = draw_height*scale;
					g.globalAlpha = ga_temp * alpha;
					g.drawImage(img, item.x-(subw)/2, item.y-(subh)/2, subw, subh);
				}
				// master
				if (item.t >= disappear_t)
				{
					g.globalAlpha = ga_temp * (1-Math.min(1, (item.t-disappear_t) / (lim_t-disappear_t)));
				}
				else
				{
					g.globalAlpha = ga_temp;
				}
				g.drawImage(img, item.x-draw_width/2, item.y-draw_height/2, draw_width, draw_height);
				g.globalAlpha = ga_temp;
				if (item.t <= lim_t)
				{
					self.nikukyuu_list[jj++] = self.nikukyuu_list[i];
				}
			}
			while (self.nikukyuu_list.length > jj)
			{
				self.nikukyuu_list.pop();
			}
		}
		// draw ui
		{
			var left_shift = 8;
			var top_shift = 8;
			var top_int = 56;
			var top_alb_extra = 0;
			// draw time
			{
				var text = Math.floor(self.time / game.fps);
				g.font = UI.STAGE.TIME.TITLE_FONT;
				g.textAlign = "left";
				g.textBaseline = "top";
				var color = UI.STAGE.TIME.TEXT_COLOR;
				g.fillStyle = color;
				g.fillText(UI.STAGE.TIME.TITLE_TEXT, left_shift, top_shift+top_int*0);
				g.font = UI.STAGE.TIME.FONT;
				g.textAlign = "right";
				g.fillText(text, left_shift+260, top_shift+top_alb_extra);
			}
			// draw hp
			{
				g.font = UI.STAGE.HP.TITLE_FONT;
				g.textAlign = "left";
				g.textBaseline = "top";
				var color = UI.STAGE.HP.TEXT_COLOR;
				g.fillStyle = color;
				g.fillText(UI.STAGE.HP.TITLE_TEXT, left_shift, top_shift+top_int*1);
				var hp = self.master.hp;
				var life_shift = left_shift+140;
				var life_top_shift = top_shift + top_int*1;
				var life_int = -16;
				var life_width = 64;
				var life_height = 64;
				var life_full = 256;
				var life_half = 128;
				var life_full_img = image.LIFE;
				var life_half_img = image.LIFE_DAMAGED;
				for (var i=0; i<8&&hp>0; i++)
				{
					var img;
					if (hp >= life_half)
					{
						img = life_full_img;
					}
					else
					{
						img = life_half_img;
					}
					g.drawImage(img, life_shift+(life_width+life_int)*i, life_top_shift, life_width, life_height);
					hp -= life_full;
				}
			}
			// draw mp
			{
				g.font = UI.STAGE.MP.TITLE_FONT;
				g.textAlign = "left";
				g.textBaseline = "top";
				var color = UI.STAGE.MP.TEXT_COLOR;
				g.fillStyle = color;
				g.fillText(UI.STAGE.MP.TITLE_TEXT, left_shift, top_shift+top_int*2);
			}
		}
		// draw game over
		if (self.state == STAGE.GAME_OVER)
		{
			// set scene to dark
			var text_fade_t = 96;
			var ga_temp = g.globalAlpha;
			g.globalAlpha = .6;
			{
				g.fillStyle = COLOR.BLACK;
				g.fillRect(0, 0, UI.SCREEN.WIDTH, UI.SCREEN.HEIGHT);
			}
			g.globalAlpha = ga_temp;
			// draw gameover text
			{
				var wait = 48;
				if (self.fid > wait)
				{
					var t = 30;
					var y = out_bounce_f(128, UI.SCREEN.HEIGHT/2, Math.min(1, (self.fid-wait)/t));
					g.font = UI.STAGE.GAMEOVER.FONT;
					g.textAlign = "center";
					g.textBaseline = "middle";
					g.fillStyle = UI.STAGE.GAMEOVER.TEXT_COLOR;
					g.fillText(UI.STAGE.GAMEOVER.TEXT, UI.SCREEN.WIDTH/2, y);
				}
			}
			// draw cat cry
			{
				var cry_width = 168;
				var cry_height = 168;
				var scale = 1.2;
				var first_t = 16;
				var second_t = 6;
				var real_scale = 1;
				if (self.fid <= first_t)
				{
					real_scale = swing_f(0, scale, Math.min(1, self.fid/first_t));
				}
				else
				{
					real_scale = sin_f(scale, 1, Math.min(1, (self.fid-first_t)/(second_t)));
				}
				var w_shift = cry_width - cry_width*real_scale;
				var h_shift = cry_height - cry_height*real_scale;
				g.drawImage(image.NEKO_CRY, UI.SCREEN.WIDTH-192+w_shift/2, UI.SCREEN.HEIGHT/2+h_shift/2, cry_width*real_scale, cry_height*real_scale);
			}
			// re-start input
			if (self.input[KEY.RE])
			{
				scene.pop();
				scene.push(STGScene());
			}
		}
	}
	
	self.update_loading = function (g)
	{
		if (self.state != STG.LOADING)
		{
			return;
		}
		switch (self.ss)
		{
		case STG.READY:
			self.ss = STG.ANI_IN;
			self.l_fcnt = 0;
			break;
		case STG.ANI_IN:
			self.l_fcnt++;
			g.font = UI.LOADING.FONT;
			g.textAlign = "center";
			g.textBaseline = "middle";
			var text_width = g.measureText(UI.LOADING.TEXT).width;
			var color_width = pow2_f(0, text_width*20, self.l_fcnt/UI.LOADING.ANI_IN_FCNT);
			var color = g.createLinearGradient(0, 0, color_width, 0);
			color.addColorStop(0, UI.LOADING.TEXT_COLOR);
			color.addColorStop(1, COLOR.TRANSPARENT);
			g.fillStyle = color;
			g.fillText(UI.LOADING.TEXT, canvas.width/2, canvas.height/2);
			if (self.l_fcnt >= UI.LOADING.ANI_IN_FCNT)
			{
				self.ss = STG.WAITING;
			}
			break;
		case STG.WAITING:
			g.font = UI.LOADING.FONT;
			g.textAlign = "center";
			g.textBaseline = "middle";
			g.fillStyle = UI.LOADING.TEXT_COLOR;
			g.fillText(UI.LOADING.TEXT, canvas.width/2, canvas.height/2);
			if (is_preload_complete())
			{
				self.ss = STG.ANI_OUT;
				self.l_fcnt = 0;
			}
			break;
		case STG.ANI_OUT:
			self.l_fcnt++;
			g.font = UI.LOADING.FONT;
			g.textAlign = "center";
			g.textBaseline = "middle";
			g.fillStyle = UI.LOADING.TEXT_COLOR;
			var temp = g.globalAlpha;
			g.globalAlpha = 1 - (self.l_fcnt/UI.LOADING.ANI_OUT_FCNT);
			g.fillText(UI.LOADING.TEXT, canvas.width/2, canvas.height/2);
			g.globalAlpha = temp;
			if (self.l_fcnt >= UI.LOADING.ANI_OUT_FCNT)
			{
				self.ss = STG.END;
			}
			break;
		case STG.END:
			self.state = STG.READY;
			break;
		}
	}
	
	self.update_clear = function (g)
	{
		if (self.state != STG.CLEAR || self.ss == STG.READY)
		{
			return;
		}
		self.fcnt++;
		self.bgm_volume(1-Math.min(1, self.fcnt/240));
		g.font = UI.CLEAR.FONT;
		g.textAlign = "center";
		g.textBaseline = "middle";
		g.fillStyle = UI.CLEAR.COLOR;
		g.fillText(UI.CLEAR.TEXT, UI.CLEAR.X, UI.CLEAR.Y);
		if ((self.fcnt & 127) < 96)
		{
			g.font = UI.CLEAR.FONT2
			g.fillStyle = UI.CLEAR.COLOR2;
			g.fillText(UI.CLEAR.TEXT2, UI.CLEAR.X2, UI.CLEAR.Y2);
		}
		if (self.input[KEY.BOMB])
		{
			self.stage = level[self.next_stage];
			self.state = STG.START;
			self.stop_bgm();
			self.bgm_volume(1);
		}
	}
	
	self.update_talk = function (g)
	{
		var tachie = self.tachie[1-self.top_tachie];
		var x = (self.top_tachie == 0 ? UI.TALK.TACHIE_RIGHT_X : UI.TALK.TACHIE_LEFT_X);
		var y = UI.TALK.TACHIE_Y;
		if (tachie)
		{
			self.update_talk_tachie(g, tachie, x, y);
		}
		tachie = self.tachie[self.top_tachie];
		x = (self.top_tachie == 1 ? UI.TALK.TACHIE_RIGHT_X : UI.TALK.TACHIE_LEFT_X);
		if (tachie)
		{
			self.update_talk_tachie(g, tachie, x, y);
		}
		// top
		var talk = self.top_talk;
		if (talk)
		{
			self.update_talk_dialog(g, talk, UI.TALK.X, UI.TALK.TOP_Y, STG_TALK.TEXT_TOP);
		}
		// mid
		talk = self.mid_talk;
		if (talk)
		{
			self.update_talk_dialog(g, talk, UI.TALK.X, UI.TALK.MID_Y, STG_TALK.TEXT_MID);
		}
		// bot
		talk = self.bot_talk;
		if (talk)
		{
			self.update_talk_dialog(g, talk, UI.TALK.X, UI.TALK.BOT_Y, STG_TALK.TEXT_BOT);
		}
		// input handle
		if (self.input[KEY.FIRE] || self.input[KEY.MODE])
		{
			self.ss = STG.DONE;
		}
	}
	
	self.update_talk_tachie = function (g, t, x, y)
	{
		g.drawImage(t.img, x-t.w/2, y-t.h/2);
	}
	
	self.update_talk_dialog = function (g, t, x, y, loc)
	{
		g.translate(x, y);
		g.beginPath();
		/*
		 10--------20
		01          31
		|            |
		02          32
		 13----+ --23
			   |/
		*/
		var x0 = 0, x1 = UI.TALK.CORN_SIZE, x2 = UI.TALK.WIDTH+UI.TALK.CORN_SIZE, x3 = x2+UI.TALK.CORN_SIZE;
		var y0 = 0, y1 = UI.TALK.CORN_SIZE, y2 = UI.TALK.HEIGHT+UI.TALK.CORN_SIZE, y3 = y2+UI.TALK.CORN_SIZE;
		g.moveTo(x1, y0);
		if (loc == STG_TALK.TEXT_BOT)
		{
			g.lineTo(UI.TALK.FROM_X0, y0);
			g.lineTo(UI.TALK.FROM_X0+UI.TALK.FROM_OX, y0-UI.TALK.FROM_OY);
			g.lineTo(UI.TALK.FROM_X1, y0);
		}
		g.lineTo(x2, y0);
		g.arcTo(x3, y0, x3, y1, UI.TALK.CORN_SIZE);
		g.lineTo(x3, y2);
		g.arcTo(x3, y3, x2, y3, UI.TALK.CORN_SIZE);
		if (loc == STG_TALK.TEXT_TOP)
		{
			g.lineTo(UI.TALK.FROM_X1, y3);
			g.lineTo(UI.TALK.FROM_X1-UI.TALK.FROM_OX, y3+UI.TALK.FROM_OY);
			g.lineTo(UI.TALK.FROM_X0, y3);
		}
		g.lineTo(x1, y3);
		g.arcTo(x0, y3, x0, y2, UI.TALK.CORN_SIZE);
		g.lineTo(x0, y1);
		g.arcTo(x0, y0, x1, y0, UI.TALK.CORN_SIZE);
		if (self.dialog_top == loc)
		{
			g.fillStyle = COLOR.TALK_BACK;
		}
		else
		{
			g.fillStyle = COLOR.TALK_BACK_INACTIVE;
		}
		g.fill();
		g.strokeStyle = COLOR.GREEN;
		g.stroke();
		g.font = UI.TALK.FONT;
		g.textAlign = "left";
		g.textBaseline = "top";
		if (t.name)
		{
			g.fillStyle = COLOR.TEXT;
			g.fillText(t.name, UI.TALK.NAME_X, UI.TALK.NAME_Y);
		}
		var text = t.text;
		for (var i=0; i<text.length; i++)
		{
			g.fillText(text[i], UI.TALK.TEXT_X, UI.TALK.TEXT_Y+UI.TALK.TEXT_HEIGHT*i);
		}
		g.translate(-x, -y);
	}
	
	self.hit = function (hole, hit_x, hit_y)
	{
		if (self.state == STAGE.PLAY)
		{
			var hit = false;
			if (hole.rat)
			{
				hit = hole.rat.hit(self);
			}
			// if there's no rat, give some penalty
			else
			{
				// todo
			}
			// miss penalty
			if (!hit)
			{
				self.master.hp -= self.level.hit_miss_penalty;
			}
			hit_x = hit_x || self.level.hole_x_shift + hole.x + hole.w*frand(0.3, 0.7);
			hit_y = hit_y || self.level.hole_y_shift + hole.y + hole.h*frand(0.3, 0.5);
			self.nikukyuu_list.push({
				x: hit_x, 
				y: hit_y, 
				t: 0, 
				hit: hit, 
			});
		}
	}
	
	self.play_bgm = function (data)
	{
		self.stop_bgm();
		self.bgm = data.audio;
		self.bgm.loop = true;
		if (is_def(self.bgm))
		{
			self.bgm.play();
		}
	}
	
	self.stop_bgm = function()
	{
		if (is_def(self.bgm))
		{
			self.bgm.pause();
			self.bgm.currentTime = 0;
		}
	}
	
	self.bgm_volume = function(volume)
	{
		if (is_def(self.bgm))
		{
			self.bgm.volume = volume;
		}
	}
	
	self.keyup = function (e)
	{
		var key = e.which || e.keyCode;
		if (KEY.ACCEPT[key])
		{
			self.input[key] = false;
			return false;
		}
		return true;
	}
	
	self.keydown = function (e)
	{
		var key = e.which || e.keyCode;
		if (KEY.ACCEPT[key])
		{
			if (!self.input[key])
			{
				self.input[key] = true;
				if (self.level.key_to_hole[key])
				{
					self.hit(self.level.key_to_hole[key]);
				}
			}
			return false;
		}
		return true;
	}
	
	self.mousedown = function (e)
	{
		if (self.state == STAGE.PLAY)
		{
			var tar_hole;
			var cx = e.offsetX - self.level.hole_x_shift;
			var cy = e.offsetY - self.level.hole_y_shift;
			for (var i=self.level.hole.length-1; i>=0; i--)
			{
				var hole = self.level.hole[i];
				if (click_in_the_hole(hole, cx, cy))
				{
					if (hole.rat && hole.rat.hp > 0)
					{
						self.hit(hole, e.offsetX, e.offsetY);
						return false;
					}
					else
					{
						tar_hole = hole;
					}
				}
			}
			if (tar_hole)
			{
				self.hit(tar_hole, e.offsetX, e.offsetY);
				return false;
			}
		}
		return true;
	}
	
	self.clear_input = function ()
	{
		self.input = {};
	}
	
	self.clear_talk = function ()
	{
		self.tachie = [];
		self.top_tachie = 0;
		self.top_talk = null;
		self.mid_talk = null;
		self.bot_talk = null;
	}
	
	self.init();
	
	return self;
}
