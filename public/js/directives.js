angular.module('mean.directives', [])
  .directive('player', function () {
    return {
      restrict: 'EA',
      templateUrl: '/views/player.html',
      link: function (scope, elem, attr) {
        scope.colors = ['#7CE4E8', '#FFFFa5', '#FC575E', '#F2ADFF', '#398EC4', '#8CFF95'];
      }
    };
  }).directive('answers', function () {
    return {
      restrict: 'EA',
      templateUrl: '/views/answers.html',
      link: function (scope, elem, attr) {
        scope.$watch('game.state', function () {
          if (scope.game.state === 'winner has been chosen') {
            const curQ = scope.game.curQuestion;
            const curQuestionArr = curQ.text.split('_');
            const startStyle = `<span style='color: ${scope.colors[scope.game.players[scope.game.winningCardPlayer].color]}'>`;
            const endStyle = '</span>';
            let shouldRemoveQuestionPunctuation = false;
            const removePunctuation = function (cardIndex) {
              let cardText = scope.game.table[scope.game.winningCard].card[cardIndex].text;
              if (cardText.indexOf('.', cardText.length - 2) === cardText.length - 1) {
                cardText = cardText.slice(0, cardText.length - 1);
              } else if ((cardText.indexOf('!', cardText.length - 2) === cardText.length - 1 ||
                cardText.indexOf('?', cardText.length - 2) === cardText.length - 1) &&
                cardIndex === curQ.numAnswers - 1) {
                shouldRemoveQuestionPunctuation = true;
              }
              return cardText;
            };
            if (curQuestionArr.length > 1) {
              let cardText = removePunctuation(0);
              curQuestionArr.splice(1, 0, startStyle + cardText + endStyle);
              if (curQ.numAnswers === 2) {
                cardText = removePunctuation(1);
                curQuestionArr.splice(3, 0, startStyle + cardText + endStyle);
              }
              curQ.text = curQuestionArr.join('');
              // Clean up the last punctuation mark in the question if there already is one in the answer
              if (shouldRemoveQuestionPunctuation) {
                if (curQ.text.indexOf('.', curQ.text.length - 2) === curQ.text.length - 1) {
                  curQ.text = curQ.text.slice(0, curQ.text.length - 2);
                }
              }
            } else {
              curQ.text += ` ${startStyle}${scope.game.table[scope.game.winningCard].card[0].text}${endStyle}`;
            }
          }
        });
      }
    };
  }).directive('question', function () {
    return {
      restrict: 'EA',
      templateUrl: '/views/question.html',
      link: function (scope, elem, attr) { }
    };
  })
  .directive('timer', function () {
    return {
      restrict: 'EA',
      templateUrl: '/views/timer.html',
      link: function (scope, elem, attr) { }
    };
  }).directive('chat', function () {
    return {
      restrict: 'EA',
      templateUrl: '/views/chat.html',
      link: function (scope, elem, attr) {
        $('#submit-btn').on('click', () => {
          const gameID = sessionStorage.getItem('gameID');
          const database = firebase.database();
          const chatPlayer = sessionStorage.getItem('chatUsername');
          const chatAvatar = sessionStorage.getItem('avatar');
          const time = new Date().toLocaleTimeString();
          const chatMessage = $('#new-message');
          database.ref(`chats/${gameID}`).push({
            username: chatPlayer,
            text: chatMessage.val(),
            timestamp: time,
            avatar: chatAvatar
          });
          chatMessage.val('');
        });

        $(document).ready(() => {
          const gameID = sessionStorage.getItem('gameID');
          const database = firebase.database();

          database.ref(`chats/${gameID}`).on('child_added', (snapshot) => {
            const msg = snapshot.val();
            let messageAdd = `
      ${`<div class='chat-message'><img src='${msg.avatar}'/><div class='chat-message-info'><div class='chat-user'>`}${msg.username}</div><div class='chat-time'>${msg.timestamp}</div></div>`;
            messageAdd += `<p class='message-text'>
      ${msg.text}</p><div class='clearFix'></div></div>`;
            $('#chat-body').append(messageAdd);
            $('#chat-body').scrollTop($('#chat-body').prop('scrollHeight'));

            if (document.getElementsByClassName('slideDown').length) {
              const notification = new Audio('../../audio/chimes.mp3');
              notification.volume = 0.2;
              notification.play();
            }
          });
        });
      }
    };
  })
  .directive('landing', function () {
    return {
      restrict: 'EA',
      link: function (scope, elem, attr) {
        scope.showOptions = true;

        if (scope.$$childHead.global.authenticated === true) {
          scope.showOptions = false;
        }
      }
    };
  });

