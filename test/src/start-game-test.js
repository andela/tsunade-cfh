'use strict';
const io = require('socket.io-client');
const socketURL = 'http://localhost:3000';
const options = {
  transports: ['websocket'],
  'force new connection': true
};
describe('Game Server', () => {
  it('Should start game when startGame event is sent with 3 players',
    (done) => {
      let client1, client2, client3;
      client1 = io.connect(socketURL, options);
      let disconnect = () => {
        client1.disconnect();
        client2.disconnect();
        client3.disconnect();
        done();
      };
      let expectStartGame = () => {
        client1.emit('startGame');
        client1.on('gameUpdate', (data) => {
          data.state.should.equal('waiting for players to pick');
        });
        client2.on('gameUpdate', (data) => {
          data.state.should.equal('waiting for players to pick');
        });
        client3.on('gameUpdate', (data) => {
          data.state.should.equal('waiting for players to pick');
        });
        setTimeout(disconnect, 200);
      };
      client1.on('connect', () => {
        client1.emit('joinGame', {
          userID: 'unauthenticated',
          room: '',
          createPrivate: false
        });
        client2 = io.connect(socketURL, options);
        client2.on('connect', () => {
          client2.emit('joinGame', {
            userID: 'unauthenticated',
            room: '',
            createPrivate: false
          });
          client3 = io.connect(socketURL, options);
          client3.on('connect', () => {
            client3.emit('joinGame', {
              userID: 'unauthenticated',
              room: '',
              createPrivate: false
            });
            setTimeout(expectStartGame, 100);
          });
        });
      });
      done();
    });
  it('Should automatically start game when 12 players are in a game',
    (done) => {
      let clientArray = ['client1', 'client2', 'client3', 'client4',
        'client5', 'client6', 'client7', 'client8',
        'client9', 'client10', 'client11', 'client12'
      ];
      clientArray[0] = io.connect(socketURL, options);
      let disconnect = () => {
        for (let i = 0; i < 12; i++) {
          (clientArray[i]).disconnect();
        }
        done();
      };
      let expectStartGame = () => {
        clientArray[0].emit('startGame');
        for (let i = 0; i < 12; i++) {
          clientArray[i].on('gameUpdate', (data) => {
            data.state.should.equal('waiting for players to pick');
          });
        }
        setTimeout(disconnect, 200);
      };
      clientArray[0].on('connect', () => {
        clientArray[0].emit('joinGame', {
          userID: 'unauthenticated',
          room: '',
          createPrivate: true
        });
        let connectOthers = true;
        clientArray[0].on('gameUpdate', (data) => {
          let gameID = data.gameID;
          if (connectOthers) {
            clientArray[1] = io.connect(socketURL, options);
            connectOthers = false;
            clientArray[1].on('connect', () => {
              clientArray[1].emit('joinGame', {
                userID: 'unauthenticated',
                room: gameID,
                createPrivate: false
              });
              clientArray[2] = io.connect(socketURL, options);
              clientArray[2].on('connect', () => {
                clientArray[2].emit('joinGame', {
                  userID: 'unauthenticated',
                  room: gameID,
                  createPrivate: false
                });
                clientArray[3] = io.connect(socketURL, options);
                clientArray[3].on('connect', () => {
                  clientArray[3].emit('joinGame', {
                    userID: 'unauthenticated',
                    room: gameID,
                    createPrivate: false
                  });
                  clientArray[4] = io.connect(socketURL, options);
                  clientArray[4].on('connect', () => {
                    clientArray[4].emit('joinGame', {
                      userID: 'unauthenticated',
                      room: gameID,
                      createPrivate: false
                    });
                    clientArray[5] = io.connect(socketURL, options);
                    clientArray[5].on('connect', () => {
                      clientArray[5].emit('joinGame', {
                        userID: 'unauthenticated',
                        room: gameID,
                        createPrivate: false
                      });
                      clientArray[6] = io.connect(socketURL, options);
                      clientArray[6].on('connect', () => {
                        clientArray[6].emit('joinGame', {
                          userID: 'unauthenticated',
                          room: gameID,
                          createPrivate: false
                        });
                        clientArray[7] = io.connect(socketURL, options);
                        clientArray[7].on('connect', () => {
                          clientArray[7].emit('joinGame', {
                            userID: 'unauthenticated',
                            room: gameID,
                            createPrivate: false
                          });
                          clientArray[8] = io.connect(socketURL, options);
                          clientArray[8].on('connect', () => {
                            clientArray[8].emit('joinGame', {
                              userID: 'unauthenticated',
                              room: gameID,
                              createPrivate: false
                            });
                            clientArray[9] = io.connect(socketURL, options);
                            clientArray[9].on('connect', () => {
                              clientArray[9].emit('joinGame', {
                                userID: 'unauthenticated',
                                room: gameID,
                                createPrivate: false
                              });
                              clientArray[10] = io.connect(socketURL, options);
                              clientArray[10].on('connect', () => {
                                clientArray[10].emit('joinGame', {
                                  userID: 'unauthenticated',
                                  room: gameID,
                                  createPrivate: false
                                });
                                clientArray[11] = io.connect(socketURL, options);
                                clientArray[11].on('connect', () => {
                                  clientArray[11].emit('joinGame', {
                                    userID: 'unauthenticated',
                                    room: gameID,
                                    createPrivate: false
                                  });
                                  setTimeout(expectStartGame, 100);
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          }
        });
      });
      done();
    });
});
