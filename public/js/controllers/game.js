angular.module('mean.system').controller('GameController', ['$scope',
  'game', '$timeout', '$location', 'MakeAWishFactsService',
  '$dialog', 'playerSearch', 'invitePlayer', '$window', '$http',
  ($scope, game, $timeout, $location, MakeAWishFactsService,
$dialog, playerSearch, invitePlayer, $window, $http) => {
    $scope.hasPickedCards = false;
    $scope.winningCardPicked = false;
    $scope.showTable = false;
    $scope.modalShown = false;
    $scope.game = game;
    $scope.pickedCards = [];
    let makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
    $scope.makeAWishFact = makeAWishFacts.pop();
    $scope.searchResults = [];
    $scope.inviteeUsername = '';
    $scope.invitedPlayers = [];
    $scope.firstPlayer = false;
    $scope.selectedUsers = [];

    $timeout(() => {
      window.sessionStorage.setItem('gameID', $scope.gameID);
    }, 1000);


    $scope.allGameRecords = () => {
      $http.post('/api/games/history').then((games) => {
       $scope.allGameData = games.data;
      }, (err) => {
        console.log(err.data); });
    };

    $scope.pickCard = function (card) {
      const notification = new Audio('../../audio/click.mp3');
      notification.play();
      if (!$scope.hasPickedCards) {
        if ($scope.pickedCards.indexOf(card.id) < 0) {
          $scope.pickedCards.push(card.id);
          if (game.curQuestion.numAnswers === 1) {
            $scope.sendPickedCards();
            $scope.hasPickedCards = true;
          } else if (game.curQuestion.numAnswers === 2 &&
            $scope.pickedCards.length === 2) {
            // delay and send
            $scope.hasPickedCards = true;
            $timeout($scope.sendPickedCards, 300);
          }
        } else {
          $scope.pickedCards.pop();
        }
      }
    };

    $scope.pointerCursorStyle = () => {
      if ($scope.isCzar() && $scope.game.state === 'waiting for czar to decide') {
        return {
          cursor: 'pointer'
        };
      }
      return {};
    };

    $scope.sendPickedCards = () => {
      game.pickCards($scope.pickedCards);
      $scope.showTable = true;
    };

    $scope.cardIsFirstSelected = (card) => {
      if (game.curQuestion.numAnswers > 1) {
        return card === $scope.pickedCards[0];
      }
      return false;
    };

    $scope.cardIsSecondSelected = (card) => {
      if (game.curQuestion.numAnswers > 1) {
        return card === $scope.pickedCards[1];
      }
      return false;
    };

    $scope.firstAnswer = ($index) => {
      if ($index % 2 === 0 && game.curQuestion.numAnswers > 1) {
        return true;
      }
      return false;
    };

    $scope.secondAnswer = ($index) => {
      if ($index % 2 === 1 && game.curQuestion.numAnswers > 1) {
        return true;
      }
      return false;
    };

    $scope.showFirst = card => game.curQuestion.numAnswers > 1 && $scope.pickedCards[0] === card.id;

    $scope.showSecond = card => game.curQuestion.numAnswers > 1 && $scope.pickedCards[1] === card.id;

    $scope.isCzar = () => game.czar === game.playerIndex;

    $scope.isPlayer = ($index) => {
      $window.sessionStorage
        .setItem('chatUsername', game.players[game.playerIndex].username);
      $window.sessionStorage
        .setItem('avatar', game.players[game.playerIndex].avatar);
      return $index === game.playerIndex;
    };

    $scope.isCustomGame = () => !(/^\d+$/).test(game.gameID) && game.state === 'awaiting players';

    $scope.isPremium = $index => game.players[$index].premium;

    $scope.currentCzar = $index => $index === game.czar;

    $scope.winningColor = ($index) => {
      if (game.winningCardPlayer !== -1 && $index === game.winningCard) {
        return $scope.colors[game.players[game.winningCardPlayer].color];
      }
      return '#f9f9f9';
    };

    $scope.pickWinning = (winningSet) => {
      if ($scope.isCzar()) {
        game.pickWinning(winningSet.card[0]);
        $scope.winningCardPicked = true;
      }
    };

    $scope.winnerPicked = () => game.winningCard !== -1;

    $scope.startGame = function () {
      const isUptoRequiredNumber = game.players.length >= game.playerMinLimit;
      if (isUptoRequiredNumber) {
        game.startGame();
      } else { $('#playerMinimumAlert').modal('show'); }
    };

    $scope.abandonGame = () => {
      game.leaveGame();
      $location.path('/');
    };

    $scope.viewGameHistory = () => {
      game.gameHistory();
    };

    // Catches changes to round to update when no players pick card
    // (because game.state remains the same)
    $scope.$watch('game.round', () => {
      $scope.hasPickedCards = false;
      $scope.showTable = false;
      $scope.winningCardPicked = false;
      $scope.makeAWishFact = makeAWishFacts.pop();
      if (!makeAWishFacts.length) {
        makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
      }
      $scope.pickedCards = [];
    });

    // In case player doesn't pick a card in time, show the table
    $scope.$watch('game.state', () => {
      if (game.state === 'waiting for czar to decide' && $scope.showTable === false) {
        $scope.showTable = true;
      }
    });

    $scope.$watch('game.gameID', () => {
      if (game.gameID && game.state === 'awaiting players') {
        if (!$scope.isCustomGame() && $location.search().game) {
          // If the player didn't successfully enter the request room,
          // reset the URL so they don't think they're in the requested room.
          $location.search({});
        } else if ($scope.isCustomGame() && !$location.search().game) {
          // Once the game ID is set, update the URL if this is a game with friends,
          // where the link is meant to be shared.
          $location.search({ game: game.gameID });
          if (!$scope.modalShown) {
            setTimeout(() => {
              $('#searchContainer').show();
            }, 50);
            $scope.modalShown = true;
          }
        }
      }
    });

    $scope.drawCard = () => {
      game.drawCard();
    };

    if ($location.search().game && !(/^\d+$/).test($location.search().game)) {
      console.log('joining custom game');
      game.joinGame('joinGame', $location.search().game);
    } else if ($location.search().custom) {
      game.joinGame('joinGame', null, true);
    } else {
      game.joinGame();
    }

    $scope.sendInvite = () => {
      const maxPlayersExceeded = $scope.invitedPlayers
        .length === game.playerMaxLimit - 1;
      if (maxPlayersExceeded) {
        $('#playerMaximumAlert').modal('show');
        $scope.searchResults = [];
      } else if ($scope.selectedUsers.length === 0) {
        $('#playerNotSelected').modal('show');
      } else {
        $scope.selectedUsers.forEach((selectedUser) => {
          invitePlayer.sendMail(selectedUser.email, document.URL)
          .then((data) => {
            if (data === 'Accepted') {
              $scope.invitedPlayers.push(selectedUser.username);
            }
            $scope.searchResults = [];
            selectedUser.email = '';
            $scope.inviteeUsername = '';
            $scope.selectedUsers = [];
          });
        });
      }
    };

    $scope.playerSearch = () => {
      if ($scope.inviteeUsername !== '') {
        playerSearch.getPlayers($scope.inviteeUsername).then((data) => {
          $scope.searchResults = data;
        });
      } else {
        playerSearch.getPlayers('*').then((data) => {
          $scope.searchResults = data;
        });
      }
    };

    $scope.showAllPlayers = () => {
      playerSearch.getPlayers('*').then((data) => {
        $scope.searchResults = data;
      });
    };

    $scope.selectUser = (selectedUser) => {
      if ($scope.selectedUsers.includes(selectedUser)) {
        $scope.selectedUsers
        .splice($scope.selectedUsers.indexOf(selectedUser), 1);
      } else if ($scope.invitedPlayers.includes(selectedUser.username)) {
        $('#playerAlreadyInvited').modal('show');
      } else {
        $scope.selectedUsers.push(selectedUser);
      }
    };

    $scope.clickInvitee = (selectedUser) => {
      if ($scope.selectedUsers.includes(selectedUser)) {
        return {
          'search-result': true,
          'invitee-picked': true,
          'invitee-invited': false
        };
      } else if ($scope.invitedPlayers.includes(selectedUser.username)) {
        return {
          'search-result': true,
          'invitee-picked': false,
          'invitee-invited': true
        };
      }
      return {
        'search-result': true,
        'invitee-picked': false,
        'invitee-invited': false
      };
    };

    $scope.isInvited = (selectedUser) => {
      if ($scope.invitedPlayers.includes(selectedUser.username)) {
        return true;
      }
      return false;
    };

    $scope.isSelected = (selectedUser) => {
      if ($scope.selectedUsers.includes(selectedUser)) {
        return true;
      }
      return false;
    };

    $scope.startTour = () => {
      const tour = new Shepherd.Tour({
        defaults: {
          classes: 'shepherd-theme-default'
        }
      });
      tour.addStep('Step 1', {
        title: 'Start the game',
        text: `This button starts the game when there are up
       to 3 players ready to play`,
        attachTo: '#start-game-container bottom',
        showCancelLink: true,
        buttons: [
          {
            text: 'Skip',
            action: tour.cancel,
          },
          {
            text: 'Next',
            action: tour.next
          }
        ]
      });
      tour.addStep('Step 2', {
        title: 'Number of players',
        text: `Here is an indicator of how many players have
       joined the game out of 12 maximum players allowed.`,
        attachTo: '#player-count-container bottom',
        showCancelLink: true,
        buttons: [
          {
            text: 'Skip',
            action: tour.cancel,
          },
          {
            text: 'Back',
            action: tour.back,
          },
          {
            text: 'Next',
            action: tour.next,
          }
        ]
      });
      tour.addStep('Step 3', {
        title: 'Game Timer',
        text: `This is a countdown timer that shows how much
         time is remaining for you to choose a card.`,
        attachTo: '#timer-container left',
        showCancelLink: true,
        buttons: [
          {
            text: 'Skip',
            action: tour.cancel,
          },
          {
            text: 'Back',
            action: tour.back,
          },
          {
            text: 'Next',
            action: tour.next,
          }
        ]
      });
      tour.addStep('Step 4', {
        title: 'Chat window',
        text: `Here is a chat window where you can view
         conversations between players in the game, including you.`,
        attachTo: '#chat-body right',
        showCancelLink: true,
        buttons: [
          {
            text: 'Skip',
            action: tour.cancel,
          },
          {
            text: 'Back',
            action: tour.back,
          },
          {
            text: 'Next',
            action: tour.next,
          }
        ]
      });
      tour.addStep('Step 5', {
        title: 'Chat message',
        text: `This is a chat input box where you can type in messages
         you want to send to the chat widow for all players to see.`,
        attachTo: '#chat-footer right',
        showCancelLink: true,
        buttons: [
          {
            text: 'Skip',
            action: tour.cancel,
          },
          {
            text: 'Back',
            action: tour.back,
          },
          {
            text: 'Next',
            action: tour.next,
          }
        ]
      });
      tour.addStep('Step 6', {
        title: 'Game History',
        text: 'The game log shows you your game history.',
        attachTo: '#gameLogButton bottom',
        showCancelLink: true,
        buttons: [
          {
            text: 'Skip',
            action: tour.cancel,
          },
          {
            text: 'Back',
            action: tour.back,
          },
          {
            text: 'Next',
            action: tour.next,
          }
        ]
      });
      tour.addStep('Step 7', {
        title: 'Abandon Game',
        text: `Click this button to Leave the game. 
          You will not be able to get back into this 
          game if it has already started`,
        attachTo: '#abandon-game-button right',
        showCancelLink: true,
        buttons: [
          {
            text: 'Skip',
            action: tour.cancel,
          },
          {
            text: 'Back',
            action: tour.back,
          },
          {
            text: 'Done',
            action: tour.complete,
          }
        ]
      });
      tour.start();
    };
  }]);

