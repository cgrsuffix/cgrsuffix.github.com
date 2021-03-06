require("./cgr")

var my_map = new cgr_map();

console.log("\nHash: ");
console.log(my_map.hash('CGACCGA'));
console.log(my_map.hash('ATACCGA'));
console.log(my_map.hash('TACCGAC'));
console.log(my_map.rehash(my_map.hash('ATACCGA'), 7, 'C'));
console.log(my_map.hash('TATACCGAATACCGAATACCGAATACCGAATACCGAATACCGAATACCGAACCGAC'));
console.log(my_map.rehash(my_map.hash('TTATACCGAATACCGAATACCGAATACCGAATACCGAATACCGAATACCGAACCGA'), 56, 'C'));

my_map.addstr('CGACCGA');
my_map.addstr('ATAGAGA');

console.log("\nSequences: ");
console.log(my_map.seqs);

console.log("\nNodes: ");
console.log(my_map.nodes);
console.log();

console.log("Distance: " + my_map.strdist(0,1));
console.log();

console.log("Search: GAC");
console.log(my_map.search('GAC'));
console.log(my_map.fast_search('GAC'));
console.log();

console.log("Search: GA");
console.log(my_map.search('GA'));
console.log(my_map.fast_search('GA'));
console.log();

console.log("Search: A (" + my_map.fast_count('A') + ")");
console.log(my_map.search('A'));
console.log(my_map.fast_search('A'));
console.log();

console.log("Is suffix: CGA");
console.log(my_map.issuffix(0, 'CGA'));
console.log(my_map.issuffix(1, 'CGA'));
console.log();

console.log("rLCE:");
console.log(my_map.rlce(0, 1, 6, 4));
console.log(my_map.rlce(0, 1, 4, 4));
console.log(my_map.rlce(0, 1, 6, 6));
console.log(my_map.rlce(0, 0, 3, 6));
console.log(my_map.rlce(0, 0, 2, 6));
console.log(my_map.rlce(0, 0, 6, 6));
console.log();

console.log(my_map.b2d(         0,          0, 0));
console.log(my_map.b2d(         0, 1073741824, 1));
console.log(my_map.b2d(1073741824,  536870912, 2));
console.log(my_map.b2d( 536870912,  268435456, 3));
console.log(my_map.b2d( 268435456, 1207959552, 4));
console.log(my_map.b2d( 134217728, 1677721600, 5));
console.log(my_map.b2d(1140850688,  838860800, 6));
console.log(my_map.b2d( 570425344,  419430400, 7));
console.log();

