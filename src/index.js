const express = require("express")
const http = require("http")
const path = require("path")
const socketio = require("socket.io")
const Filter = require("bad-words")
const { generateMessage, generateLocationMessage } = require("./utils/messages")
const { addUser,getUser,removeUser,getUsersInRoom } = require("./utils/users")

const app = express()
const server = http.createServer(app)
const io = socketio(server)


const publicDirectoryPath = path.join(__dirname, "../public")

app.use(express.static(publicDirectoryPath))

let count = 0;

//server (emit) --> client ( receive ) - countUpdated
//client (emit) --> server ( receive ) - increment

io.on("connection", (socket) =>{
    console.log("New WebSocket connection.")


    socket.on("join", ({username,room}, callback) =>{
        const {error, user}  =addUser({id:socket.id, username, room})

        if(error){
            callback(error)
        }

        socket.join(user.room)
        socket.emit("message", generateMessage("Welcome"))
        socket.broadcast.to(user.room).emit("message", generateMessage(`${user.username} has joined!`))
        callback()
    })

    socket.on("sendMessage", (message, callback) => {

        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback("Profanity is not allowed!")
        }
        io.emit("message", generateMessage(message))
        callback()
    })

    socket.on("sendLocation", (coords, callback) =>{
        io.emit("locationMessage", generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on("disconnect", () =>{  

        const user = removeUser(socket.id)

         if(user){
             io.to(user.room).emit("message", generateMessage(`${user.username} has left the Room`))
         }
    })

})

server.listen(process.env.PORT || 3000 , console.log("Server is running..."))