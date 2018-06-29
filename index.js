const app = require( 'express' )();
const server = require( 'http' ).Server( app );
const io = require( 'socket.io' )(server);
const port = 3000;

server.listen( port, () => console.log( `Server is running on port ${port}`) );

app.get( '/', (req, res) => {
    res.sendFile( __dirname + '/public/index.html' );
});

app.get( '/javascript', (req, res) => {
    res.sendFile( __dirname + '/public/javascript.html' );
});

app.get( '/swift', (req, res) => {
    res.sendFile( __dirname + '/public/swift.html' );
});

app.get( '/css', (req, res) => {
    res.sendFile( __dirname + '/public/css.html' );
});

/**
 * Namespace
 */
// tech namespace
const tech = io.of( '/tech' );

// io.on is an event listener; in this case, it listens for the connection event which occurs when another client connects
tech.on( 'connection', (socket) => {
    console.log( 'user connected' );
    // emit is an event; it is firing as soon as a connection occurs
    // socket.emit( 'message', {manny: 'hey how are you?'} );
    // here socket is listening for a new event to occur and invoking the callback passed as 2nd arg
    // socket.on( 'another event', (data) => {
    //     console.log( data );
    // });

    socket.on( 'join', (data) => {
        socket.join(data.room);
        tech.in(data.room).emit( 'message', `New user joined ${data.room} room.` );
    })

    socket.on( 'message', (data) => {
        console.log( `message: ${data.msg}` );
        tech.in(data.room).emit( 'message', data.msg );
    });

    socket.on( 'disconnect', () => {
        console.log( 'user disconnected' );
        // here we use io because this emit must come from the server; socket is the client
        tech.emit( 'message', 'user disconnected' );
    })
});