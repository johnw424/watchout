// start slingin' some d3 here.
var highScore = 0;
var currentScore = 0;
var collisions = 0;
var collisionDetection = true;
var width = 900;
var height = 500;
var gameboard = d3.select('div.gameboard')
                  .append('svg')
                  .attr({'width': width,'height': height})
                  .append('g');

var enemies = _.range(20);
var enemyRadius = 10;
var heroRadius = 10;
var easingArray = ['linear', 'quad', 'circle', 'sin', 'back', ''];
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
           .duration(1100)
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
  dragTarget.attr('cx', function(){
    var newXPosition = d3.event.dx + parseInt(dragTarget.attr('cx'));
    if (newXPosition > (width - heroRadius)) {return (width - heroRadius);}
    if (newXPosition < heroRadius) {return heroRadius;}
    return newXPosition;
  })
  .attr('cy', function(){
    var newYPosition = d3.event.dy + parseInt(dragTarget.attr('cy'));
    if (newYPosition > (height - heroRadius)) {return (height - heroRadius);}
    if (newYPosition < heroRadius) {return heroRadius;}
    return newYPosition;
  });
};

// Check for collisions.
var checkCollision = function(callback){
  var hero = d3.selectAll('.hero');
  var enemies = d3.selectAll('.enemies');

  enemies.each(function() {
    var enemy = d3.select(this);
    var radiusSum = parseFloat(enemy.attr('r')) + parseFloat(hero.attr('r'));
    var xDiff =  parseFloat(enemy.attr('cx')) - parseFloat(hero.attr('cx'));
    var yDiff =  parseFloat(enemy.attr('cy')) - parseFloat(hero.attr('cy'));
    var separation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
    if(separation < radiusSum) {
      callback();
    }
  });
};
var collidedCallback = function() {
  // Short pause on collision detection
  collisionDetection = false;
  d3.selectAll('.hero')
    .transition()
    .duration(500)
    .attr('fill', 'red')
    .transition()
    .duration(1500)
    .attr('fill', 'orange');
  setTimeout(function(){
    collisionDetection = true;
  }, 2000);
  // Increment & update collision count
  collisions++;
  d3.selectAll('.collisions span').text(collisions);
  // Check current score
  if(currentScore > highScore) {
    // Set new high score
    highScore = currentScore;
    d3.selectAll('.high span').text(highScore);
  }
  currentScore = 0;
  d3.selectAll('.current span').text(currentScore);
};

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
         .call(d3.behavior.drag().on('drag', moveHero));

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

setInterval(update, 600);
setInterval(function() {
  if(collisionDetection){
    currentScore += 10;
    d3.selectAll('.current span').text(currentScore);
  }
}, 250);

setInterval(function(){
  if(collisionDetection){
    checkCollision(collidedCallback);
  }
}, 50);
