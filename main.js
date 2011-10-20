//require("./usm");
// console.log(usmDist(new usm('GCC', 'ACTG', 'compact'), new usm('GCC', 'ACTG', 'compact'), 'matrix'));

require("./cgr")



var my_map = new cgr_map();

console.log("\nHash: ");
console.log(my_map.hash('CGACCGA'));
console.log(my_map.hash('ATACCGA'));

my_map.addstr('CGACCGA');
my_map.addstr('ATAGAGA');

console.log("\nSequences: ");
console.log(my_map.seqs);

console.log("\nNodes: ");
console.log(my_map.nodes);
console.log();

console.log("Distance: " + my_map.strdist(0,1));
console.log();

console.log("Search: GA");
console.log(my_map.search('GA'));
console.log();

