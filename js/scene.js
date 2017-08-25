
function Scene()
{
	var self = {};
	
	self.init = DO_NOTHING;
	self.keyup = DO_NOTHING;
	self.keydown = DO_NOTHING;
	self.update = DO_NOTHING;
	self.deinit = DO_NOTHING;
	
	return self;
}

function SceneManager()
{
	var self = Scene();
	
	self.init = function ()
	{
		self.list = [];
	}
	
	self.keyup = function (e)
	{
		return self.current.keyup(e);
	}
	
	self.keydown = function (e)
	{
		return self.current.keydown(e);
	}
	
	self.update = function (g)
	{
		self.current.update(g);
	}
	
	self.deinit = function ()
	{
		self.current.deinit();
	}
	
	self.push = function (s)
	{
		self.current = s;
		self.list.push(s);
	}
	
	self.pop = function ()
	{
		var ret = self.current;
		self.current = self.list.pop();
		return ret;
	}
	
	self.init();
	
	return self;
}
