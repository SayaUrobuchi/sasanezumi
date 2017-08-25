
var SHOKUSYU_SHOT_TEMPLATE = extend(SHOT_TEMPLATE, {
	r: 4, 
	dr: 6, 
	color: COLOR.PURPLE, 
	out_color: COLOR.RED, 
	target: GROUP.MIKATA, 
});

enemy.shokusyu = extend(ENEMY_TEMPLATE, {
	img: image.PURIN_BATTLE, 
	sx: 32, 
	sy: 96, 
	lvl_name: [
		"襲來！美少女触手", 
		"漫天雪雨", 
		"必殺．触手乱舞", 
		"奧義．千本触", 
	], 
	shot: function (field, self)
	{
		switch (self.lvl)
		{
		case 0:
			switch (self.state)
			{
			case 0:
				self.acnt = 0;
				self.bcnt = 0;
				self.state = 1;
				break;
			case 1:
				self.acnt++;
				if (self.acnt >= 7)
				{
					self.acnt = 0;
					self.bcnt++;
					var mc = field.get_mchara();
					if (is_def(mc))
					{
						var ang = self.angle_to(mc);
						var rang = ang + deg(fdice(2, 30, -30));
						if (self.bcnt == 8)
						{
							self.bcnt = 0;
							rang = ang;
						}
						var spd = 2;
						self.fire(field, [
							extend(PURIN_SHOT_TEMPLATE, {
								dx: Math.cos(rang), 
								dy: Math.sin(rang), 
								spd: spd, 
							}), 
						]);
					}
				}
				break;
			}
			break;
		case 1:
			switch (self.state)
			{
			case 0:
				self.acnt = 0;
				self.aang = 0;
				self.bcnt = 0;
				self.delay = 48;
				self.state = 1;
				break;
			case 1:
				self.delay--;
				if (self.delay <= 0)
				{
					self.state = 2;
				}
				break;
			case 2:
				if (self.acnt++ >= 24)
				{
					self.acnt = 0;
					var spd = 4;
					self.fire(field, [
						extend(PURIN_SHOT_TEMPLATE, {
							dx: Math.cos(self.aang), 
							dy: Math.sin(self.aang), 
							spd: spd, 
						}), 
						extend(PURIN_SHOT_TEMPLATE, {
							dx: Math.cos(self.aang+Math.PI/2), 
							dy: Math.sin(self.aang+Math.PI/2), 
							spd: spd, 
						}), 
						extend(PURIN_SHOT_TEMPLATE, {
							dx: Math.cos(self.aang+Math.PI), 
							dy: Math.sin(self.aang+Math.PI), 
							spd: spd, 
						}), 
						extend(PURIN_SHOT_TEMPLATE, {
							dx: Math.cos(self.aang-Math.PI/2), 
							dy: Math.sin(self.aang-Math.PI/2), 
							spd: spd, 
						}), 
					]);
					self.aang += Math.PI / 6;
				}
				if (self.bcnt++ >= 90-(25*(1-self.real_hp_rate)))
				{
					self.bcnt = 0;
					var mc = field.get_mchara();
					if (is_def(mc))
					{
						var ang = self.angle_to(mc);
						var offset = 12;
						var spd = 4;
						var aspd = 0.25;
						var ang_shift = deg(5);
						var shot_ang = ang+ang_shift;
						for (var i=0; i<8; i++)
						{
							self.fire(field, [
								extend(PURIN_SHOT_TEMPLATE, {
									ox: 12*Math.cos(shot_ang), 
									oy: 12*Math.sin(shot_ang), 
									dx: Math.cos(shot_ang), 
									dy: Math.sin(shot_ang), 
									spd: spd+aspd*i, 
								}), 
							]);
						}
						shot_ang = ang-ang_shift;
						for (var i=0; i<8; i++)
						{
							self.fire(field, [
								extend(PURIN_SHOT_TEMPLATE, {
									ox: 12*Math.cos(shot_ang), 
									oy: 12*Math.sin(shot_ang), 
									dx: Math.cos(shot_ang), 
									dy: Math.sin(shot_ang), 
									spd: spd+aspd*i, 
								}), 
							]);
						}
						shot_ang = ang;
						aspd = 0.4;
						for (var i=0; i<8; i++)
						{
							self.fire(field, [
								extend(PURIN_SHOT_TEMPLATE, {
									ox: 12*Math.cos(shot_ang), 
									oy: 12*Math.sin(shot_ang), 
									dx: Math.cos(shot_ang), 
									dy: Math.sin(shot_ang), 
									spd: spd+aspd*i, 
								}), 
							]);
						}
					}
				}
				break;
			}
			break;
		case 2:
			switch (self.state)
			{
			case 0:
				self.acnt = 0;
				self.bcnt = 0;
				self.ccnt = 0;
				self.delay = 64;
				self.state = 1;
				break;
			case 1:
				self.delay--;
				if (self.delay <= 0)
				{
					self.state = 2;
				}
				break;
			case 2:
				if (self.acnt++ >= 20)
				{
					self.acnt = 0;
					var mc = field.get_mchara();
					if (is_def(mc))
					{
						var ang = self.angle_to(mc);
						var rang = ang + deg(fdice(3, 30, -45));
						self.ccnt++;
						if (self.ccnt >= 7)
						{
							self.ccnt = 0;
							rang = ang;
						}
						var spd = 1 + fdice(2, 1);
						var d = 20, dd = 20;
						for (var i=2; i>=0; i--)
						{
							self.fire(field, [
								extend(PURIN_SHOT_TEMPLATE, {
									ox: Math.cos(rang+i*deg(dd))*d, 
									oy: Math.sin(rang+i*deg(dd))*d, 
									dx: Math.cos(rang), 
									dy: Math.sin(rang), 
									spd: spd, 
								}), 
							]);
							if (i)
							{
							self.fire(field, [
								extend(PURIN_SHOT_TEMPLATE, {
									ox: Math.cos(rang-i*deg(dd))*d, 
									oy: Math.sin(rang-i*deg(dd))*d, 
									dx: Math.cos(rang), 
									dy: Math.sin(rang), 
									spd: spd, 
								}), 
							]);
							}
						}
					}
				}
				if (self.bcnt++ >= 4)
				{
					self.bcnt = 0;
					var ang = Math.random()*Math.PI*2;
					var spd = Math.random()*1+0.5;
					self.fire(field, [
						extend(PURIN_SHOT_TEMPLATE, {
							dx: Math.cos(ang), 
							dy: Math.sin(ang), 
							spd: spd, 
						}), 
					]);
				}
				break;
			}
			break;
		case 3:
			switch (self.state)
			{
			case 0:
				self.acnt = 0;
				self.bcnt = 0;
				self.dcnt = 0;
				self.delay = 64;
				self.state = 1;
				break;
			case 1:
				self.delay--;
				if (self.delay <= 0)
				{
					self.state = 2;
				}
				break;
			case 2:
				if (self.acnt++ >= 20)
				{
					self.acnt = 0;
					var ang = Math.random()*Math.PI*2;
					var spd = Math.random()*1+0.5;
					self.fire(field, [
						extend(PURIN_SHOT_TEMPLATE, {
							dx: Math.cos(ang), 
							dy: Math.sin(ang), 
							spd: spd, 
							update: SHOT.UPDATE_TO_MC, 
							ang: ang, 
							limit_ang: 0.01, 
							limit_total_ang: deg(105), 
						}), 
					]);
				}
				if (self.bcnt++ >= 8)
				{
					self.bcnt = 0;
					self.dcnt++;
					if (self.dcnt > 6)
					{
						if (self.dcnt > 11)
						{
							if (Math.random() > 0.7)
							{
								self.dcnt = 0;
							}
						}
						var mc = field.get_mchara();
						if (is_def(mc))
						{
							var ang = self.angle_to(mc);
							var spd = 2;
							self.fire(field, [
								extend(PURIN_SHOT_TEMPLATE, {
									dx: Math.cos(ang), 
									dy: Math.sin(ang), 
									spd: spd, 
								}), 
							]);
						}
					}
				}
				break;
			}
			break;
		}
	}, 
});

level[2] = extend(LEVEL_TEMPLATE, {
	events: {
		start: [
			extend(LEVEL_TALK_TEMPLATE, {
				name: "触翔", 
				text: [
					"喔、喔喔！", 
					"彌兒舔舔 >Q<", 
				], 
				text_loc: STG_TALK.TEXT_BOT, 
				img: TACHIE.SHOKUSYU_GOOD, 
				img_loc: STG_TALK.TACHIE_RIGHT, 
			}), 
			extend(LEVEL_TALK_TEMPLATE, {
				name: "丁丁", 
				text: [
					"來得正好！", 
					"喂、決鬥啦！！", 
				], 
				text_loc: STG_TALK.TEXT_BOT, 
				img: TACHIE.PURIN_LOL, 
				img_loc: STG_TALK.TACHIE_RIGHT, 
			}), 
			extend(LEVEL_TALK_TEMPLATE, {
				name: "彌兒", 
				text: [
					"…啊？為毛非跟你決鬥不可啊。", 
				], 
				text_loc: STG_TALK.TEXT_TOP, 
				img: TACHIE.MINYAN_NOTGOOD, 
				img_loc: STG_TALK.TACHIE_LEFT, 
			}), 
			extend(LEVEL_TALK_TEMPLATE, {
				name: "丁丁", 
				text: [
					"當然是太閒啦！", 
				], 
				text_loc: STG_TALK.TEXT_BOT, 
				img: TACHIE.PURIN_LOL, 
				img_loc: STG_TALK.TACHIE_RIGHT, 
			}), 
			extend(LEVEL_TALK_TEMPLATE, {
				name: "彌兒", 
				text: [
					"給我好好工作啊喂！", 
					"風紀的維持如何了？", 
				], 
				text_loc: STG_TALK.TEXT_TOP, 
				img: TACHIE.MINYAN_ANGRY, 
				img_loc: STG_TALK.TACHIE_LEFT, 
			}), 
			extend(LEVEL_TALK_TEMPLATE, {
				name: "丁丁", 
				text: [
					"糟得不能再糟。", 
					"沒人違法亂紀，也就沒人可殺。", 
					"簡直無聊透頂！", 
				], 
				text_loc: STG_TALK.TEXT_BOT, 
				img: TACHIE.PURIN_NOTGOOD, 
				img_loc: STG_TALK.TACHIE_RIGHT, 
			}), 
			extend(LEVEL_TALK_TEMPLATE, {
				name: "彌兒", 
				text: [
					"那不是很和平嗎！", 
					"天下太平萬萬歲啦！", 
				], 
				text_loc: STG_TALK.TEXT_TOP, 
				img: TACHIE.MINYAN_SAD, 
				img_loc: STG_TALK.TACHIE_LEFT, 
			}), 
			extend(LEVEL_TALK_TEMPLATE, {
				name: "丁丁", 
				text: [
					"大錯特錯！！", 
					"身為魔法少女、擁有一身魔力，", 
					"卻完全無用武之地！", 
				], 
				text_loc: STG_TALK.TEXT_BOT, 
				img: TACHIE.PURIN_NOTGOOD, 
				img_loc: STG_TALK.TACHIE_RIGHT, 
			}), 
			extend(LEVEL_TALK_TEMPLATE, {
				name: "丁丁", 
				text: [
					"沒有惡人可殺、", 
					"也就沒理由失手誤傷無辜、", 
					"沒理由順手破壞城鎮了啊！", 
				], 
				text_loc: STG_TALK.TEXT_BOT, 
				img: TACHIE.PURIN_NOTGOOD, 
				img_loc: STG_TALK.TACHIE_RIGHT, 
			}), 
			extend(LEVEL_TALK_TEMPLATE, {
				name: "彌兒", 
				text: [
					"你把風紀當成什麼了！？", 
				], 
				text_loc: STG_TALK.TEXT_TOP, 
				img: TACHIE.MINYAN_ANGRY, 
				img_loc: STG_TALK.TACHIE_LEFT, 
			}), 
			extend(LEVEL_TALK_TEMPLATE, {
				name: "丁丁", 
				text: [
					"合法殺手！（眼睛一亮", 
				], 
				text_loc: STG_TALK.TEXT_BOT, 
				img: TACHIE.PURIN_LOL, 
				img_loc: STG_TALK.TACHIE_RIGHT, 
			}), 
			extend(LEVEL_TALK_TEMPLATE, {
				name: "彌兒", 
				text: [
					"看來有必要再教育呢…", 
				], 
				text_loc: STG_TALK.TEXT_TOP, 
				img: TACHIE.MINYAN_HAKI, 
				img_loc: STG_TALK.TACHIE_LEFT, 
			}), 
			extend(LEVEL_TALK_TEMPLATE, {
				name: "丁丁", 
				text: [
					"哦哦，想動粗嗎？", 
					"那麼就算是女僕長，也只好痛下決心、", 
					"揮下風紀的制裁之拳啦！", 
				], 
				text_loc: STG_TALK.TEXT_BOT, 
				img: TACHIE.PURIN_LOL, 
				img_loc: STG_TALK.TACHIE_RIGHT, 
			}), 
			extend(LEVEL_TALK_TEMPLATE, {
				name: "彌兒", 
				text: [
					"可笑！", 
					"在穹之聖地，本王就是法律！", 
				], 
				text_loc: STG_TALK.TEXT_TOP, 
				img: TACHIE.MINYAN_HAKI, 
				img_loc: STG_TALK.TACHIE_LEFT, 
			}), 
			extend(LEVEL_TALK_TEMPLATE, {
				name: "彌兒", 
				text: [
					"好吧，既然如此想死，", 
					"就先陪你玩玩，", 
					"之後再好好『懲罰懲罰』！", 
				], 
				text_loc: STG_TALK.TEXT_TOP, 
				img: TACHIE.MINYAN_HAKI, 
				img_loc: STG_TALK.TACHIE_LEFT, 
			}), 
			extend(LEVEL_ENEMY_TEMPLATE, {
				enemy: enemy.shokusyu, 
			}), 
		], 
		clear: [
			extend(LEVEL_TALK_TEMPLATE, {
				name: "彌兒", 
				text: [
					"哼、只有這丁點程度嗎？", 
				], 
				text_loc: STG_TALK.TEXT_TOP, 
				img: TACHIE.MINYAN_HAKI, 
				img_loc: STG_TALK.TACHIE_LEFT, 
			}), 
			extend(LEVEL_TALK_TEMPLATE, {
				name: "丁丁", 
				text: [
					"嗚嘎！？", 
					"唔、這下大破了…", 
					"魔力也都給榨乾啦！", 
				], 
				text_loc: STG_TALK.TEXT_BOT, 
				img: TACHIE.PURIN_NOTGOOD, 
				img_loc: STG_TALK.TACHIE_RIGHT, 
			}), 
			extend(LEVEL_TALK_TEMPLATE, {
				name: "彌兒", 
				text: [
					"…為防萬一，", 
					"給我隨時維持最佳狀態！", 
					"像現在的你，可應付不了敵襲啊？", 
				], 
				text_loc: STG_TALK.TEXT_TOP, 
				img: TACHIE.MINYAN_NOTGOOD, 
				img_loc: STG_TALK.TACHIE_LEFT, 
			}), 
			extend(LEVEL_TALK_TEMPLATE, {
				name: "丁丁", 
				text: [
					"是、是。", 
					"嘛，玩得開心比較重要。", 
				], 
				text_loc: STG_TALK.TEXT_BOT, 
				img: TACHIE.PURIN_LOL, 
				img_loc: STG_TALK.TACHIE_RIGHT, 
			}), 
			extend(LEVEL_TALK_TEMPLATE, {
				name: "彌兒", 
				text: [
					"給我好好幹啊喂！", 
				], 
				text_loc: STG_TALK.TEXT_TOP, 
				img: TACHIE.MINYAN_SAD, 
				img_loc: STG_TALK.TACHIE_LEFT, 
			}), 
			extend(LEVEL_NEXT_TEMPLATE, {
				id: 2, 
			}), 
		], 
	}, 
});

