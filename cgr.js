console.log('CGR on steroids ;-)');

cgr_map = function() {

	this.n = 0;
	this.nodes = new Array();

	this.s_n = 0;
	this.seqs = new Array();

	function node(x, y, s_id, s_l) {
		this.x = x;
		this.y = y;
		this.s_id = s_id;
		this.s_l = s_l;
	}

	this.chr2idx = {A:{x:0, y:0}, C:{x:0,y:1}, G:{x:1,y:0}, T:{x:1,y:1}}

	this.addstr = function(s) {

		var curr = {x:0, y:0};

		// Iterate over 's' and compute its points on the CGR map.
		for (var i = 0; i < s.length; i++) {

			var vec = this.chr2idx[s[i]];

			curr.x = (curr.x >> 1) | (vec.x << 30);
			curr.y = (curr.y >> 1) | (vec.y << 30);

			this.nodes[this.n ++] = new node(curr.x, curr.y, this.s_n, i+1);
		}
		
		// Store the sequence.
		this.seqs[this.s_n ++] = {seq:s, x:curr.x, y:curr.y};
	}

	this.hash = function(s) {
		var curr = {x:0, y:0};
		for (var i = 0; i < s.length; i++) {
			var vec = this.chr2idx[s[i]];
			curr.x = (curr.x >> 1) | (vec.x << 30);
			curr.y = (curr.y >> 1) | (vec.y << 30);
		}
		return curr;
	}




	this.strdist = function(a, b) {
		var max = 1 << 31;
		return Math.sqrt(Math.pow((this.seqs[a].x - this.seqs[b].x)/max, 2)
			       + Math.pow((this.seqs[a].y - this.seqs[b].y)/max, 2));
	}

	this.search = function(s) {

		var curr = {x:0, y:0};
		var res = new Array();

		// Iterate over 's' and compute its final point on the CGR map.
		for (var i = 0; i < s.length; i++) {

			var vec = this.chr2idx[s[i]];

			curr.x = (curr.x >> 1) | (vec.x << 30);
			curr.y = (curr.y >> 1) | (vec.y << 30);
		}

		curr.x = curr.x >> (31 - i);
		curr.y = curr.y >> (31 - i);

		console.log(curr);
		console.log();

		// Check for occurrences.
		for (var j = 0; j < this.nodes.length; j++) {
			if ((this.nodes[j].x >> (31 -i)) == curr.x &&
			    (this.nodes[j].y >> (31 -i)) == curr.y ) {
				res.push({ s_id:this.nodes[j].s_id,
					   idx: this.nodes[j].s_l - i});
				console.log(this.nodes[j]);
			}
		}
	
		return res;
	}
}

