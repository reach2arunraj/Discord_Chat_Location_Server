const users = []

// addUser, removeUser, getUser, getUserInRoom

const addUser = ({ id, username, room }) => {
    // refactor the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data

    if(!username || !room){
        return {
            error:"Username and Room are required...!"
        }
    }

    //Check for existing user

    const existingUser = users.find((user) =>{
        return user.room === room && user.username === username
    })

    // Validate username
    if(existingUser){
        return{
            error:"Username is in use...!"
        }
    }

    // Store User
    const user = { id, username, room}
    users.push(user)
    return { user }
}

const removeUser = (id) =>{
    const index = users.findIndex((user) => user.id === id )

    if(index !== -1){
        return users.splice(index, 1) [0]
    }
}