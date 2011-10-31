console.log('CGR on steroids ;-)');

cgr_map = function() {

	this.shift = 30;

	this.nodes = new Array();
	this.n = 0;

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

		var curr = {x:0, y:0};
		var quadtree_root = new quadtree_node(null);

		// Iterate over 's' and compute its points on the CGR map.
		for (var i = 0; i < s.length; i++) {

			var vec = this.chr2idx[s[i]];

			curr.x = (curr.x >> 1) | (vec.x << this.shift);
			curr.y = (curr.y >> 1) | (vec.y << this.shift);

			this.nodes[this.n] = new node(curr.x, curr.y, this.s_n, i+1);

			// Update the quadtree...
			var quadtree_curr = quadtree_root;
			for (var j = i; j >= 0; j--) {
				if (! quadtree_curr[s[j]]) {
					quadtree_curr[s[j]] =
					    new quadtree_node(this.nodes[this.n]);
					break;
				}
				quadtree_curr = quadtree_curr[s[j]];
			}

			this.n ++;
		}
		
		// Store the sequence.
		this.seqs[this.s_n ++] = {seq:s, x:curr.x, y:curr.y, tree:quadtree_root};
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

		// Check for occurrences.
		for (var j = 0; j < this.nodes.length; j++) {
			if ((this.nodes[j].x >> (this.shift + 1 - k)) == curr.x &&
			    (this.nodes[j].y >> (this.shift + 1 - k)) == curr.y ) {
				res.push({ s_id:this.nodes[j].s_id,
					   idx: this.nodes[j].s_l - s.length});
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
					if (quadtree_curr.node && quadtree_curr.node.s_l >= s.length &&
					    (quadtree_curr.node.x >> (this.shift + 1 - k)) == curr.x &&
					    (quadtree_curr.node.y >> (this.shift + 1 - k)) == curr.y ) {
						res.push({ s_id:quadtree_curr.node.s_id,
						   idx: quadtree_curr.node.s_l - s.length});
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
				if (quadtree_curr.node && quadtree_curr.node.s_l >= s.length &&
				    (quadtree_curr.node.x >> (this.shift + 1 - k)) == curr.x &&
				    (quadtree_curr.node.y >> (this.shift + 1 - k)) == curr.y ) {
					res.push({ s_id:quadtree_curr.node.s_id,
						   idx: quadtree_curr.node.s_l - s.length});
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
}
