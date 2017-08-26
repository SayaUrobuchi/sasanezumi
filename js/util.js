
var PI2 = Math.PI * 2;

function DO_NOTHING()
{
}

function ALWAYS_RETURN(val)
{
	return function ()
	{
		return val;
	}
}

function is_ndef(v)
{
	return v === undefined;
}

function is_def(v)
{
	return !is_ndef(v);
}

function extend(p, q)
{
	var ret = {};
	for (var k in p)
	{
		ret[k] = p[k];
	}
	for (var k in q)
	{
		ret[k] = q[k];
	}
	return ret;
}

function rgba(r, g, b, a)
{
	return "rgba("+[r, g, b, a].join(",")+")";
}

function rgb(r, g, b)
{
	return rgba(r, g, b, 1.0);
}

function deg(ang)
{
	return ang*Math.PI/180;
}

function rand(a, b)
{
	if (is_ndef(b))
	{
		return Math.floor(Math.random()*a);
	}
	return Math.floor(Math.random()*(b-a+1)) + a;
}

function frand(a, b)
{
	if (is_ndef(b))
	{
		return Math.random()*a;
	}
	return Math.random()*(b-a) + a;
}

function fdice(x, y, z)
{
	var res = 0;
	while (x-- > 0)
	{
		res += Math.random()*y;
	}
	if (is_ndef(z))
	{
		return res;
	}
	return res+z;
}

function linear_f(st, ed, now)
{
	return st + (ed-st)*now;
}

function sqrt_f(st, ed, now)
{
	return st + (ed-st)*Math.sqrt(now);
}

function pow2_f(st, ed, now)
{
	return st + (ed-st)*(now*now);
}

function sin_f(st, ed, now)
{
	return st + (ed-st)*Math.sin(now*deg(90));
}

function cos_f(st, ed, now)
{
	return st + (ed-st)*(1-Math.cos(now*deg(90)));
}

function swing_f(st, ed, now)
{
	return st + (ed-st)*(.5-Math.cos(now*Math.PI)/2);
}

function is_collide(p, q)
{
	var dx = p.x - q.x;
	var dy = p.y - q.y;
	var r = p.r + q.r;
	return (dx*dx) + (dy*dy) < r*r;
}

