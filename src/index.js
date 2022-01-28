const express =require("express");
const {v4:uuidv4}=require("uuid");
const app=express()
app.use(express.json());
app.listen(5555);



const user=[];
const product=[];

function verifyIfUserAlrearyExists(request,response,next){
const {cpf}=request.headers;
const users=user.find((users)=>users.cpf===cpf);
if(!users){
    return response.status(400).json({message:"user not found"});
}
request.users=users;
return next();
};

function verifyIfProductAlrearyExists(request,response,next){
const {name}=request.headers;

const products=product.find((products)=>products.name===name);
if(!products){
    return response.status(400).json({message:"products not found"})
};

request.products=products;
return next();
}



app.post("/user",(request,response)=>{
const {name,cpf}=request.body;

const users=user.some((users)=>users.cpf===cpf);

if(users){
    return response.status(400).json({message:"user alreary exists"});
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


app.post("/product",(request,response)=>{
    const {name}=request.body;

const products=product.some((products)=>products.name===name);

if(products){
    return response.status(400).json({message:"products already exists"})
};

product.push({
name,
id:uuidv4(),
date: new Date(),
Statement:[],
});

return response.status(201).json({message:"product create"})
});

app.get("/product",verifyIfProductAlrearyExists,(request,response)=>{
    const {products}=request;

    return response.status(201).json(products);
})