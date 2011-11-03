console.log('CGR on steroids ;-)');

cgr_map = function() {

	this.shift = 30;

	this.seqs = new Array();
	this.s_n = 0;

	this.chr2idx = {A:{x:0, y:0}, C:{x:0,y:1}, G:{x:1,y:0}, T:{x:1,y:1}}
	
	function node(x, y, s_id, s_l) {
		this.x = x;
		this.y = y;
		this.s_id = s_id;
		this.s_l = s_l;
	}

	this.addstr = function(s) {

		var nodes = new Array();
		var n = 0;
		var curr = {x:0, y:0};
		var quadtree_root = new quadtree_node(null);

		// Iterate over 's' and compute its points on the CGR map.
		for (var i = 0; i < s.length; i++) {

			var vec = this.chr2idx[s[i]];

			curr.x = (curr.x >> 1) | (vec.x << this.shift);
			curr.y = (curr.y >> 1) | (vec.y << this.shift);

			nodes[n] = new node(curr.x, curr.y, this.s_n, i+1);

			// Update the quadtree...
			var quadtree_curr = quadtree_root;
			for (var j = i; j >= 0; j--) {
				if (! quadtree_curr[s[j]]) {
					quadtree_curr[s[j]] =
					    new quadtree_node(nodes[n]);
					break;
				}
				quadtree_curr = quadtree_curr[s[j]];
			}

			n ++;
		}
		
		// Store the sequence.
		this.seqs[this.s_n ++] = {seq:s, x:curr.x, y:curr.y, nodes:nodes, tree:quadtree_root};
	}

	this.hash = function(s) {
		var curr = {x:0, y:0};
		for (var i = 0; i < s.length; i++) {
			var vec = this.chr2idx[s[i]];
			curr.x = (curr.x >> 1) | (vec.x << this.shift);
			curr.y = (curr.y >> 1) | (vec.y << this.shift);
		}
		return curr;
	}

	this.b2d = function(x, y, l) {
		var max = ~(1 << (this.shift + 1)) + 1;
		var dx = (x + (1 << (this.shift - Math.min(this.shift, l))))/max;
		var dy = (y + (1 << (this.shift - Math.min(this.shift, l))))/max;

		return {x:dx, y:dy};
	}

	this.strdist = function(a, b) {
		var max = 1 << (this.shift + 1);
		return Math.sqrt(Math.pow((this.seqs[a].x - this.seqs[b].x)/max, 2)
			       + Math.pow((this.seqs[a].y - this.seqs[b].y)/max, 2));
	}

	this.search = function(s) {

		var res = new Array();
		var curr = this.hash(s);
		var k = Math.min(s.length, this.shift + 1);

		curr.x = curr.x >> ((this.shift + 1) - k);
		curr.y = curr.y >> ((this.shift + 1) - k);

		// Iterate over sequences...
		for (var i = 0; i < this.seqs.length; i++) {
			// Check for occurrences.
			var nodes = this.seqs[i].nodes;
			for (var j = 0; j < nodes.length; j++) {
				if ((nodes[j].x >> (this.shift + 1 - k)) == curr.x &&
				    (nodes[j].y >> (this.shift + 1 - k)) == curr.y ) {
					res.push({ s_id:nodes[j].s_id,
						   idx: nodes[j].s_l - s.length});
				}
			}
		}
	
		return res;
	}

	this.count = function(s) {
		return this.search(s).length;
	}

	this.fast_search = function(s) {

		var res = new Array();
		var curr = this.hash(s);
		var k = Math.min(s.length, this.shift + 1);

		curr.x = curr.x >> ((this.shift + 1) - k);
		curr.y = curr.y >> ((this.shift + 1) - k);

		// Iterate over sequences...
		for (var i = 0; i < this.seqs.length; i++) {
	
			var stack = new Array();

			// Process current sequence...
			var quadtree_curr = this.seqs[i].tree;
			for (var j = s.length - 1; quadtree_curr && j >= 0; j--) {
				if (quadtree_curr[s[j]]) {
					// Check match...
					var node = quadtree_curr.node;
					if (node && node.s_l >= s.length &&
					    (node.x >> (this.shift + 1 - k)) == curr.x &&
					    (node.y >> (this.shift + 1 - k)) == curr.y ) {
						res.push({ s_id:node.s_id,
						   idx: node.s_l - s.length});
					}
				} else {
					stack.push(quadtree_curr);
				}
				quadtree_curr = quadtree_curr[s[j]];
			}
			if (quadtree_curr) stack.push(quadtree_curr);

			// Process leafs...
			quadtree_curr = stack.pop();
			while (quadtree_curr) {
				
				// Check match...
				var node = quadtree_curr.node;
				if (node && node.s_l >= s.length &&
				    (node.x >> (this.shift + 1 - k)) == curr.x &&
				    (node.y >> (this.shift + 1 - k)) == curr.y ) {
					res.push({ s_id:node.s_id,
						   idx: node.s_l - s.length});
				}

				// Add children...
				if (quadtree_curr.A) stack.push(quadtree_curr.A);
				if (quadtree_curr.C) stack.push(quadtree_curr.C);
				if (quadtree_curr.G) stack.push(quadtree_curr.G);
				if (quadtree_curr.T) stack.push(quadtree_curr.T);
				
				// Next element...
				quadtree_curr = stack.pop();
			}
		}

		return res;
	}

	this.fast_count = function(s) {
		return this.fast_search(s).length;
	}

	function quadtree_node(node) {
		this.node = node;
	}

	this.issuffix = function(sidx, s) {
		var curr = this.hash(s);
		var k = Math.min(s.length, this.shift + 1);

		curr.x = curr.x >> ((this.shift + 1) - k);
		curr.y = curr.y >> ((this.shift + 1) - k);

		var node = this.seqs[sidx].nodes[this.seqs[sidx].seq.length - 1];

		return (node.x >> (this.shift + 1 - k)) == curr.x &&
		       (node.y >> (this.shift + 1 - k)) == curr.y ;
	}

	this.rlce = function(si, sj, i, j) {
		var ni = this.seqs[si].nodes[i];
		var nj = this.seqs[sj].nodes[j];
		var v = (ni.x^nj.x)|(ni.y^nj.y);
		var r;
		var shift;

		// Let us compute integer log as described at
		// http://graphics.stanford.edu/~seander/bithacks.html#IntegerLog
		r =     (v > 0xFFFF) << 4; v >>= r;
		shift = (v > 0xFF  ) << 3; v >>= shift; r |= shift;
		shift = (v > 0xF   ) << 2; v >>= shift; r |= shift;
		shift = (v > 0x3   ) << 1; v >>= shift; r |= shift;
                r |= (v >> 1);
		r = this.shift - r;

		if (r > i) r = i + 1;
		if (r > j) r = j + 1;

		return r;
	}
}

