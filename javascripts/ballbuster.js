$(document).ready(function() {

  var app_width = parseInt($('#app').width());
  var self = this;

  blowup_messages = [
    'pow!',
    'kaboom!',
    'fizz',
    'boom!',
    'pop!'
  ]

  function isCollision(first, second) {
    return !(
        ((first.y + first.height) < (second.y)) ||
        (first.y > (second.y + second.height)) ||
        ((first.x + first.width) < second.x) ||
        (first.x > (second.x + second.width))
    );
  }

  // bullet
  function Bullet(x) {
    this.bullet_speed = 200;
    var randnum = Math.floor(Math.random()*30);
    var target_id = 'bullet_' + x + '_' + randnum;
    var target = ('<div id="' + target_id + '" class="bullet"></div>');
    $('#app').append(target);
    var this_bullet = $('#' + target_id);
    this_bullet.css('left',x + 'px');
    this_bullet.animate(
      {
        bottom: 560
      },
      {
        duration:1000,
        step: function(current_y, fx) {
          all_balls = $('.ball');
          // let's see if we hit a ball
          $.each(all_balls, function(e) {
            var this_ball = $(this);
            this_ball_position = this_ball.position();
            var this_ball_obj = {
              x: this_ball_position.left,
              y: this_ball_position.top,
              width: this_ball.width(),
              height: this_ball.height()
            };
            this_bullet_obj = {
              x: x,
              y: current_y,
              width: 4,
              height: 20
            };
            if (isCollision(this_ball_obj, this_bullet_obj)) {
              this_ball.css('background', '#ff0000');
 
              this_ball.fadeOut(10, function() {
                $(this).remove();
                this_bullet.remove();
                $(this).stop();
                return false;
              });
            }

          })
        },
        complete: function() {
          this.remove();
        }
      }
    );
  }

  // ball
  function Ball(x, r, g, b, w, h) {
    this.ball_speed = 2000;
    var randnum = Math.floor(Math.random()*30);
    var target_id = 'ball_' + x + '_' + randnum;
    var target = ('<div id="' + target_id + '" class="ball"></div>');
    $('#app').append(target);
    var this_ball = $('#' + target_id);
    this_ball.css('backgroundColor', 'rgb(' + r + ',' + g + ',' + b + ')');
    this_ball.css('width',w + 'px');
    this_ball.css('height',h + 'px');
    this_ball.css('left',x);
    this_ball.css('top',0);
    this_ball_height = this_ball_width = parseInt(this_ball.css('width'));

    this_ball.animate({ top: 560 }, {
      duration: this.ball_speed,
      easing: "linear",
      step: function(current_y, fx) {
        ball_obj = {
          x: parseInt(x),
          y: parseInt(current_y),
          width: w,
          height: h
        };
        ship_obj = {
          x: parseInt(ship.x),
          y: 560,
          width: parseInt(ship.target().width()),
          height: parseInt(ship.target().height())
        };
        if (isCollision(ball_obj, ship_obj)) {
          $('#app').remove();
          $('#dead-msg').fadeIn(500);
          setTimeout(function() {
            location.reload();
          },
          1000);
        }
      },
      queue: false,
      complete: function() {
        this.remove();
      }
    });
  }


  // ship
  var ship = new Object();
  ship.x = (parseInt(app_width) / 2);
  ship.movement_delta = 80;
  ship.movement_speed = 100;
  ship.bounds_left = 0;
  ship.bounds_right = app_width;

  ship.target = function() {
    return $('#ship');
  }

  ship.parent_container = function() {
    return $('#ship').parent();
  }

  ship.inBounds = function(v) {
    if ((v > this.bounds_left) && (v < this.bounds_right)) {
      return true;
    }
    return false;
  }
  
  ship.move = function(direction) {
    var test_x;
    this.target().stop();
    if (direction == 'left') {
      test_x = this.x - this.movement_delta;
      if (this.inBounds(test_x)) {
        this.x -= this.movement_delta;
      }
    } else if (direction == 'right') {
      test_x = this.x + this.movement_delta;
      if (this.inBounds(test_x)) {
        this.x += this.movement_delta;
      }
    }
    this.target().animate({left: this.x}, this.movement_speed);
    //this.target().css('left',this.x + 'px');
  }

  ship.fire = function() {
    var this_bullet = new Bullet(this.x + ((this.target().width() / 2) - 3));
  }


  // DO WORK!
  $('body').focus();

  setInterval(function() {
    // see if we're going to launch a ball
    var likelihood = Math.floor(Math.random()*8);
    if (likelihood == 1) {
      var ball_x = Math.floor(Math.random()*980) + 40;
      var r = Math.floor(Math.random()*255);
      var g = Math.floor(Math.random()*255);
      var b = Math.floor(Math.random()*255);
      var w = Math.floor(Math.random()*200) + 40;
      new Ball(ball_x, r, g, b, w, w);
    }
  }, 100);

  $('body').on('keydown', function(k) {
    k.preventDefault();
    switch(k.which) {
      case 37:
        ship.move('left');
        break;
      case 39:
        ship.move('right');
        break;
      case 32:
        ship.fire();
        break;
    }
  });
});
