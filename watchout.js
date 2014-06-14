// start slingin' some d3 here.
var width = 900;
var height = 500;
var gameboard = d3.select('div.gameboard')
                  .append('svg')
                  .attr({'width': width,'height': height})
                  .append('g');

var enemies = _.range(20);
var enemyRadius = 10;
var heroRadius = 10;
var easingArray = ['bounce', 'elastic', 'quad', 'circle'];
var easingGenerator = function(array) {
  return array[Math.floor(Math.random() * array.length)];
};
var moveX = function(){
  return Math.random() * (width - enemyRadius * 2) + enemyRadius;
};
var moveY = function(){
  return Math.random() * (height - enemyRadius * 2) + enemyRadius;
};
// Update gameboard.
var update = function(){
  gameboard.selectAll('circle.enemies')
           .transition()
           .duration(1900)
           .delay(100)
           .ease(easingGenerator(easingArray))
           .attr({'cx': function(){
                  return moveX();
                 },
                 'cy': function(){
                  return moveY();
                 }
               });
};

var moveHero = function(){
    var dragTarget = d3.select(this);
    dragTarget
        .attr("cx", function(){
          var newXPosition = d3.event.dx + parseInt(dragTarget.attr("cx"));
          if (newXPosition > (width - heroRadius)) {return (width - heroRadius);}
          if (newXPosition < heroRadius) {return heroRadius;}
          return newXPosition;
        })
        .attr("cy", function(){
          var newYPosition = d3.event.dy + parseInt(dragTarget.attr("cy"));
          if (newYPosition > (height - heroRadius)) {return (height - heroRadius);}
          if (newYPosition < heroRadius) {return heroRadius;}
          return newYPosition;
        });
};

// Setup gameboard.
gameboard.selectAll('circle')
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

// Setup the hero.
gameboard.selectAll()
         .data(['hero'])
         .enter().append('circle')
         .attr({'class': 'hero',
                'fill': 'orange',
                'r': heroRadius,
                'cx': width/2,
                'cy': (height / 2)
              })
         .call(d3.behavior.drag().on("drag", moveHero));

setInterval(update, 1000);
