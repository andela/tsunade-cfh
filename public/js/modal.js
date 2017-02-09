// Get the modal
const modal = document.getElementById('myModal');

// Get the <span> element that closes the modal
const span = document.getElementsByClassName('close')[0];

// Open modal as soon as page opens
modal.style.display = 'block';

// When the user clicks on <span> (x), close the modal
span.onclick = () => {
  modal.style.display = 'none';
};

const start = document.getElementById('start-game');

// start.onclick = () => {
// game.startGame();
// };
