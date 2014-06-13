// start slingin' some d3 here.
var width = 900;
var height = 500;
var gameboard = d3.select('div.gameboard')
                  .append('svg')
                  .attr({'width': width,'height': height})
                  .append('g');

var enemies = _.range(20);
var enemyRadius = 10;
var moveX = function(){
  return Math.random() * (width - enemyRadius * 2) + enemyRadius;
};
var moveY = function(){
  return Math.random() * (height - enemyRadius * 2) + enemyRadius;
};

gameboard.selectAll('svg')
         .data(enemies)
         .enter().append('circle')
         .attr({'class': 'enemies',
                'fill': 'black',
                'r': enemyRadius,
                'cx': function(){
                  return moveX();
                },
                'cy': function(){
                  return moveY();
                }
              });
