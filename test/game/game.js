var should = require('should');
var io = require('socket.io-client');

var socketURL = 'http://localhost:3000';

var options ={
  transports: ['websocket'],
  'force new connection': true
};

var cfhPlayer1 = { 'name':'Tom' };
var cfhPlayer2 = { 'name':'Sally' };
var cfhPlayer3 = { 'name':'Dana' };

describe("Game Server",function(){

  it('Should accept requests to joinGame', function(done) {
    var client1 = io.connect(socketURL, options);
    var disconnect = function() {
      client1.disconnect();
      done();
    };
    client1.on('connect', function(data){
      client1.emit('joinGame',{ userID:'unauthenticated',room: '', createPrivate: false });
      setTimeout(disconnect,200);
    });
  });

  it('Should send a game update upon receiving request to joinGame', function(done) {
    var client1 = io.connect(socketURL, options);
    var disconnect = function() {
      client1.disconnect();
      done();
    };
    client1.on('connect', function(data){
      client1.emit('joinGame',{ userID:'unauthenticated',room: '', createPrivate: false });
      client1.on('gameUpdate', function(data) {
        data.gameID.should.match(/\d+/);
      });
      setTimeout(disconnect,200);
    });
  });

  it('Should announce new user to all users', function(done){
    var client1 = io.connect(socketURL, options);
    var client2;
    var disconnect = function() {
      client1.disconnect();
      client2.disconnect();
      done();
    };
    client1.on('connect', function(data){
      client1.emit('joinGame',{ userID:'unauthenticated',room: '', createPrivate: false });
      client2 = io.connect(socketURL, options);
      client2.on('connect', function(data) {
        client2.emit('joinGame',{ userID:'unauthenticated',room: '', createPrivate: false });
        client1.on('notification', function(data) {
          data.notification.should.match(/ has joined the game\!/);
        });
      });
      setTimeout(disconnect,200);
    });
  });

  it('Should start game when startGame event is sent with 3 players', function(done){
    var client1, client2, client3;
    client1 = io.connect(socketURL, options);
    var disconnect = function() {
      client1.disconnect();
      client2.disconnect();
      client3.disconnect();
      done();
    };
    var expectStartGame = function() {
      client1.emit('startGame');
      client1.on('gameUpdate', function(data) {
        data.state.should.equal("waiting for players to pick");
      });
      client2.on('gameUpdate', function(data) {
        data.state.should.equal("waiting for players to pick");
      });
      client3.on('gameUpdate', function(data) {
        data.state.should.equal("waiting for players to pick");
      });
      setTimeout(disconnect,200);
    };
    client1.on('connect', function(data){
      client1.emit('joinGame',{ userID:'unauthenticated',room: '', createPrivate: false });
      client2 = io.connect(socketURL, options);
      client2.on('connect', function(data) {
        client2.emit('joinGame',{ userID:'unauthenticated',room: '', createPrivate: false });
        client3 = io.connect(socketURL, options);
        client3.on('connect', function(data) {
          client3.emit('joinGame', {
            userID: 'unauthenticated', room: '', createPrivate: false
          });
          setTimeout(expectStartGame,100);
        });
      });
    });
  });

  it(`Should automatically start game
   when 12 players are in a game`, (done) => {
    let client2, client3, client4, client5, client6, client7,
      client8, client9, client10, client11, client12;
    const client1 = io.connect(socketURL, options);
    const disconnect = function disconnect() {
      client1.disconnect();
      client2.disconnect();
      client3.disconnect();
      client4.disconnect();
      client5.disconnect();
      client6.disconnect();
      client7.disconnect();
      client8.disconnect();
      client9.disconnect();
      client10.disconnect();
      client11.disconnect();
      client12.disconnect();
      done();
    };
    const expectStartGame = () => {
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
      client4.on('gameUpdate', (data) => {
        data.state.should.equal('waiting for players to pick');
      });
      client5.on('gameUpdate', (data) => {
        data.state.should.equal('waiting for players to pick');
      });
      client6.on('gameUpdate', (data) => {
        data.state.should.equal('waiting for players to pick');
      });
      client7.on('gameUpdate', (data) => {
        data.state.should.equal('waiting for players to pick');
      });
      client8.on('gameUpdate', (data) => {
        data.state.should.equal('waiting for players to pick');
      });
      client9.on('gameUpdate', (data) => {
        data.state.should.equal('waiting for players to pick');
      });
      client10.on('gameUpdate', (data) => {
        data.state.should.equal('waiting for players to pick');
      });
      client11.on('gameUpdate', (data) => {
        data.state.should.equal('waiting for players to pick');
      });
      client12.on('gameUpdate', (data) => {
        data.state.should.equal('waiting for players to pick');
      });
      setTimeout(disconnect, 200);
    };
    client1.on('connect', () => {
      client1.emit('joinGame',
        { userID: 'unauthenticated', room: '', createPrivate: true });
      let connectOthers = true;
      client1.on('gameUpdate', (data) => {
        const gameID = data.gameID;
        if (connectOthers) {
          client2 = io.connect(socketURL, options);
          connectOthers = false;
          client2.on('connect', () => {
            client2.emit('joinGame',
              {
                userID: 'unauthenticated',
                room: gameID,
                createPrivate: false
              });
            client3 = io.connect(socketURL, options);
            client3.on('connect', () => {
              client3.emit('joinGame',
                { userID: 'unauthenticated',
                  room: gameID,
                  createPrivate: false });
              client4 = io.connect(socketURL, options);
              client4.on('connect', () => {
                client4.emit('joinGame',
                  {
                    userID: 'unauthenticated',
                    room: gameID,
                    createPrivate: false
                  });
                client5 = io.connect(socketURL, options);
                client5.on('connect', () => {
                  client5.emit('joinGame',
                    {
                      userID: 'unauthenticated',
                      room: gameID,
                      createPrivate: false
                    });
                  client6 = io.connect(socketURL, options);
                  client6.on('connect', () => {
                    client6.emit('joinGame',
                      {
                        userID: 'unauthenticated',
                        room: gameID,
                        createPrivate: false
                      });
                    client7 = io.connect(socketURL, options);
                    client7.on('connect', () => {
                      client7.emit('joinGame',
                        {
                          userID: 'unauthenticated',
                          room: gameID,
                          createPrivate: false
                        });
                      client8 = io.connect(socketURL, options);
                      client8.on('connect', () => {
                        client8.emit('joinGame',
                          {
                            userID: 'unauthenticated',
                            room: gameID,
                            createPrivate: false
                          });
                        client9 = io.connect(socketURL, options);
                        client9.on('connect', () => {
                          client9.emit('joinGame',
                            {
                              userID: 'unauthenticated',
                              room: gameID,
                              createPrivate: false
                            });
                          client10 = io.connect(socketURL, options);
                          client10.on('connect', () => {
                            client10.emit('joinGame',
                              {
                                userID: 'unauthenticated',
                                room: gameID,
                                createPrivate: false
                              });
                            client11 = io.connect(socketURL, options);
                            client11.on('connect', () => {
                              client11.emit('joinGame',
                                {
                                  userID: 'unauthenticated',
                                  room: gameID,
                                  createPrivate: false
                                });
                              client12 = io.connect(socketURL, options);
                              client12.on('connect', () => {
                                client12.emit('joinGame',
                                  {
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
  });
});
