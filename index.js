let Score = JSON.parse(localStorage.getItem('score')) || {
  win: 0,
  lose: 0,
  tie: 0
};

let result = '';
let isAutoplaying = false;
let intervalID;
let tournamentWins = 0;
let tournamentLosses = 0;

updateScoreElement();

function autoPlay(){
  if(!isAutoplaying){
    intervalID = setInterval(function(){
      const playerMove = pickComputermove();
      playGame(playerMove);
    }, 1000);
    isAutoplaying = true;
  } else {
    clearInterval(intervalID);
    isAutoplaying = false;
  }
}

function playGame(playerMove){
  let computerMove = pickComputermove();

  if(playerMove === computerMove){
    result = 'Tie';
  } else if (
    (playerMove === 'Rock' && computerMove === 'Scissors') ||
    (playerMove === 'Paper' && computerMove === 'Rock') ||
    (playerMove === 'Scissors' && computerMove === 'Paper')
  ) {
    result = 'Win';
  } else {
    result = 'Lose';
  }

  if(result === 'Win'){
    Score.win++;
    tournamentWins++;
    document.getElementById('winSound').play();
  } else if(result === 'Tie'){
    Score.tie++;
    document.getElementById('tieSound').play();
  } else {
    Score.lose++;
    tournamentLosses++;
    document.getElementById('loseSound').play();
  }

  localStorage.setItem('score', JSON.stringify(Score));

  document.querySelector('.js-result').innerHTML = `Result: ${result}`;
  document.querySelector('.js-move').innerHTML = `You 
    <img class="move-icon" src="./IMAGES/${playerMove}-emoji.png">
    <img class="move-icon" src="./IMAGES/${computerMove}-emoji.png"> Computer`;

  updateScoreElement();
  checkTournament();
}

function updateScoreElement(){
  let totalGames = Score.win + Score.lose + Score.tie;
  let winRate = totalGames > 0 ? ((Score.win / totalGames) * 100).toFixed(1) : 0;

  document.querySelector('.js-score').innerHTML =
  `WINS: ${Score.win} | TIES: ${Score.tie} | LOSSES: ${Score.lose} <br>
   Win Rate: ${winRate}%`;
}

function resetScore(){
  Score = { win:0, lose:0, tie:0 };
  tournamentWins = 0;
  tournamentLosses = 0;
  localStorage.removeItem('score');
  updateScoreElement();
  document.querySelector('.js-tournament').innerHTML = "";
}

function pickComputermove(){
  const random = Math.random();
  if(random < 1/3) return 'Rock';
  else if(random < 2/3) return 'Paper';
  else return 'Scissors';
}

function toggleTheme(){
  document.body.classList.toggle('light');
}

// Tournament (Best of 5)
function checkTournament(){
  if(tournamentWins === 3){
    document.querySelector('.js-tournament').innerHTML = " You WON the this Game";
    tournamentWins = 0;
    tournamentLosses = 0;
  } else if(tournamentLosses === 3){
    document.querySelector('.js-tournament').innerHTML = " You LOST the this Game";
    tournamentWins = 0;
    tournamentLosses = 0;
  }
}
