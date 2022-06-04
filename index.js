const express =require("express")
const cors =require("cors")
const mongoose=require("mongoose");
const userRoute = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const socket=require("socket.io")


const app=express();
require('dotenv').config();

const PORT =process.env.PORT || 8080

app.use(cors())
app.use(express.json())

app.use('/',userRoute)
app.use('/', messageRoutes);

mongoose.connect("mongodb+srv://Guhan:guhan@cluster0.gubnl.mongodb.net/smilechat?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

const server =app.listen(PORT,()=>{
    console.log(`server started on Port ${PORT}`)
})
const io=socket(server,{
  cors:{
    origin:"*",
    credentials: true,
  }
})

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});