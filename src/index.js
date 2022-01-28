const express =require("express");
const {v4:uuidv4}=require("uuid");
const app=express()
app.use(express.json());
app.listen(5555);



const user=[];

function verifyIfUserAlrearyExists(request,response,next){
const {cpf}=request.headers;

const users=user.find((users)=>users.cpf===cpf);

if(!users){
    return response.status(400).json({message:"user alreary exists"});
}

request.users=users;

return next();

};

app.post("/user",(request,response)=>{
const {name,cpf}=request.body;

const users=user.some((users)=>users.cpf===cpf);

if(users){
    return response.status(400).json({message:"user not found"});
}

user.push({
name,
cpf,
id:uuidv4(),
date:new Date(),
statement:[],
});

return response.status(201).json({message:"user create successfully"})

});

app.get("/user",verifyIfUserAlrearyExists,(request,response)=>{
    const {users}=request;

    return response.status(201).json(users);
});