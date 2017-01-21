$(document).ready(function() {

  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  var randomNumber = Math.floor(Math.random() * 4) + 1;
  var compMove = '2b';
  var humanIsX;
  var myTimer;
  var activeDiv;
  var possibleMove = null;
  var gameOver = false;
  var hasRunThroughAllMoves = false;
  var firstCornerMoveCompleted = false;
  var board = {
    oneA: '',
    oneB: '',
    oneC: '',
    twoA: '',
    twoB: '',
    twoC: '',
    threeA: '',
    threeB: '',
    threeC: ''
  };

  function blockIsEmpty(checkDiv) {
    if (checkDiv.innerHTML === '') {
      return true;
    } else {
      return false;
    }
  }

  function drawCanvasLine(x1, y1, x2, y2) {
    if ($(window).width() < 550) {
      $('#myCanvas').attr('width', '250px');
      $('#myCanvas').attr('height', '500px');
      ctx.lineWidth = 15;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo((x1 - 10) / 2, (y1 + 50) / 2);
      ctx.lineTo((x2 - 10) / 2, (y2 + 50) / 2);
      ctx.stroke();
    } else {
      $('#myCanvas').attr('width', '500px');
      $('#myCanvas').attr('height', '800px');
      ctx.lineWidth = 25;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }

  function decideCornerAtRandom(randomInteger) {
    if (randomInteger === 1) {
      if (checkCorner('oneA') !== false) {
        board['oneA'] = 'comp-player';
        return 'oneA';
      }
    } else if (randomInteger === 2) {
      if (checkCorner('oneC') !== false) {
        board['oneC'] = 'comp-player';
        return 'oneC';
      }
    } else if (randomInteger === 3) {
      if (checkCorner('threeA') !== false) {
        board['threeA'] = 'comp-player';
        return 'threeA';
      }
    } else if (randomInteger === 4) {
      if (checkCorner('threeC') !== false) {
        board['threeC'] = 'comp-player';
        return 'threeC';
      }
    }
    return null;
  }

  function checkCorner(cornerSquareToCheck) {
    if (board[cornerSquareToCheck] === '') {
      return true;
    } else return false;
  }

  function decidecompMove(playerArg) {
    // Always go for center square on first move, if available
    if (board.twoB === '') {
      board.twoB = 'comp-player';
      return 'twoB';
      // Otherwise, check for potentially winning moves
    } else if (board.oneA === playerArg && board.oneB === playerArg && board.oneC === '') { //#1
      board.oneC = 'comp-player';
      return 'oneC';
    } else if (board.oneA === playerArg && board.twoA === playerArg && board.threeA === '') { //#2
      board.threeA = 'comp-player';
      return 'threeA';
    } else if (board.oneA === playerArg && board.twoB === playerArg && board.threeC === '') { //#3
      board.threeC = 'comp-player';
      return 'threeC';
    } else if (board.oneB === playerArg && board.oneC === playerArg && board.oneA === '') { //#4
      board.oneA = 'comp-player';
      return 'oneA';
    } else if (board.oneB === playerArg && board.twoB === playerArg && board.threeB === '') { //#5
      board.threeB = 'comp-player';
      return 'threeB';
    } else if (board.oneC === playerArg && board.twoB === playerArg && board.threeA === '') { //#6
      board.threeA = 'comp-player';
      return 'threeA';
    } else if (board.oneC === playerArg && board.twoC === playerArg && board.threeC === '') { //#7
      board.threeC = 'comp-player';
      return 'threeC';
    } else if (board.twoA === playerArg && board.twoB === playerArg && board.twoC === '') { //#8
      board.twoC = 'comp-player';
      return 'twoC';
    } else if (board.twoA === playerArg && board.threeA === playerArg && board.oneA === '') { //#9
      board.oneA = 'comp-player';
      return 'oneA';
    } else if (board.twoB === playerArg && board.twoC === playerArg && board.twoA === '') { //#10
      board.twoA = 'comp-player';
      return 'twoA';
    } else if (board.twoB === playerArg && board.threeB === playerArg && board.oneB === '') { //#11
      board.oneB = 'comp-player';
      return 'oneB';
    } else if (board.twoB === playerArg && board.threeA === playerArg && board.oneC === '') { //#12
      board.oneC = 'comp-player';
      return 'oneC';
      } else if (board.twoB === playerArg && board.threeC === playerArg && board.oneA === '') { //#13
      board.oneA = 'comp-player';
      return 'oneA';
    } else if (board.twoC === playerArg && board.threeC === playerArg && board.oneC === '') { //#14
      board.oneC = 'comp-player';
      return 'oneC';
    } else if (board.threeA === playerArg && board.threeB === playerArg && board.threeC === '') { //#15
      board.threeC = 'comp-player';
      return 'threeC';
    } else if (board.threeB === playerArg && board.threeC === playerArg && board.threeA === '') { //#16
      board.threeA = 'comp-player';
      return 'threeA';
      // Check if there are any winning moves between two squares. I.e. by plugging a gap in a line.
    } else if (board.oneA === playerArg && board.oneC === playerArg && board.oneB === '') {
      board.oneB = 'comp-player';
      return 'oneB';
    } else if (board.oneA === playerArg && board.threeA === playerArg && board.twoA === '') {
      board.twoA = 'comp-player';
      return 'twoA';
    } else if (board.oneC === playerArg && board.threeC === playerArg && board.twoC === '') {
      board.twoC = 'comp-player';
      return 'twoC';
    } else if (board.threeA === playerArg && board.threeC === playerArg && board.threeB === '') {
      board.threeB = 'comp-player';
      return 'threeB';
      // If it hasn't found any winning moves for itself, the program then passes 'player' as an argument
      //  to check for winning moves to block
    } else if (!hasRunThroughAllMoves) {
      hasRunThroughAllMoves = true;
      return (decidecompMove('player'));
      // If there is no pending winning move to complete or block, the program will choose a corner square
      // The first corner is picked randomly
    } else {
      if (!firstCornerMoveCompleted) {
        firstCornerMoveCompleted = true;
        possibleMove = decideCornerAtRandom(randomNumber);
        if (possibleMove !== null) {
          return possibleMove;
        }
      }
      if (board.oneC === '') {
        board.oneC = 'comp-player';
        return 'oneC';
      } else if (board.oneA === '') {
        board.oneA = 'comp-player';
        return 'oneA';
      } else if (board.threeA === '') {
        board.threeA = 'comp-player';
        return 'threeA';
      } else if (board.threeC === '') {
        board.threeC = 'comp-player';
        return 'threeC';
        // If there are no corner squares, it will choose the first remaining open square
      } else {
        for (var key in board) {
          if (board[key] === '') {
            board[key] = 'comp-player';
            return key;
          }
        }
      }
      $("#canvas-nav").fadeIn(500);
      myTimer = setTimeout(function() {
        $('#results-nav').show();
        $("#result").html('<h2>Its a Draw!</h2>');
        gameOver = true;
        return null;
      }, 1000);

    }
  }

  function lineCheck(position1, position2, position3) {
    if (position1 === 'player' && position2 === 'player' && position3 === 'player') {
      $("#canvas-nav").fadeIn(500);
      myTimer = setTimeout(function() {
        $('#results-nav').show();
        $("#result").html('<h2>You Win!</h2>');
      }, 1500);
      gameOver = true;
      return true;
    } else if (position1 === 'comp-player' && position2 === 'comp-player' && position3 === 'comp-player') {
      $("#canvas-nav").fadeIn(500);
      myTimer = setTimeout(function() {
        $('#results-nav').show();
        $("#result").html('<h2>Computer Wins! <br> Hard Luck :(</h2>');
      }, 1500);
      gameOver = true;
      return true;
    } else {
      return false;
    }
  }

  function checkPossibleWins() {

    // Horizontal lines
    if (lineCheck(board.oneA, board.oneB, board.oneC)) {
      drawCanvasLine(40, 100, 460, 100);
    }
    if (lineCheck(board.twoA, board.twoB, board.twoC)) {
      drawCanvasLine(40, 260, 460, 260);
    }
    if (lineCheck(board.threeA, board.threeB, board.threeC)) {
      drawCanvasLine(40, 420, 460, 420);
    }
    // Vertical lines
    if (lineCheck(board.oneA, board.twoA, board.threeA)) {
      drawCanvasLine(80, 60, 80, 470);
    }
    if (lineCheck(board.oneB, board.twoB, board.threeB)) {
      drawCanvasLine(240, 60, 240, 470);
    }
    if (lineCheck(board.oneC, board.twoC, board.threeC)) {
      drawCanvasLine(440, 60, 440, 470);
    }
    // Diagonal lines
    if (lineCheck(board.oneA, board.twoB, board.threeC)) {
      drawCanvasLine(40, 60, 460, 470);
    }
    if (lineCheck(board.oneC, board.twoB, board.threeA)) {
      drawCanvasLine(40, 470, 460, 60);
    }
  }
  
  function computerMove() {
      hasRunThroughAllMoves = false;
      compMove = decidecompMove('comp-player');
      if (compMove !== null) {
        if (humanIsX) {
          myTimer = setTimeout(function() {
            $('#' + compMove).text('O');
          }, 150);
        } else {
          myTimer = setTimeout(function() {
            $('#' + compMove).text('X');
          }, 150);
        }
        checkPossibleWins();
      }
    }

  // End of function declarations

  $('#myNav').show();

  $('.closebtn').click(function() {
    $('#myNav').hide();
  });

  $('.square').click(function() {
    activeDiv = document.getElementById(this.id);
    if (blockIsEmpty(activeDiv)) {
      board[this.id] = 'player';
      if (humanIsX) {
        $(this).text('X');
      } else {
        $(this).text('O');
      }
      checkPossibleWins();
      if (!gameOver) {
        myTimer = setTimeout(function() {
          computerMove();
        }, 100);
      }
    }
  });

  $('#xChosen').click(function() {
    humanIsX = true;
    $('#myNav').hide();
  });

  $('#oChosen').click(function() {
    humanIsX = false;
    $('#myNav').hide();
  });

  $('#reset').click(function() {
    
    randomNumber = Math.floor(Math.random() * 4) + 1;
    possibleMove = null;
    hasRunThroughAllMoves = false;
    firstCornerMoveCompleted = false;
    
    for (var key in board) {
      board[key] = '';
    }
    $('#myNav').show();
    $('.square').html('');
    $('#result').text('');
  });

  $('#play-again').click(function() {
    ctx.clearRect(0, 0, c.width, c.height);
    randomNumber = Math.floor(Math.random() * 4) + 1;
    possibleMove = null;
    gameOver = false;
    hasRunThroughAllMoves = false;
    firstCornerMoveCompleted = false;
    $('#canvas-nav').hide();
    $('#myNav').show();
    $('#results-nav').hide();
    for (var key in board) {
      board[key] = '';
    }
    $('.square').html('');
    $('#result').text('');
  });
});