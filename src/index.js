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
};

function getbalance(declaration){
const balance = declaration.reduce((acc,operation)=>{
    if(operation.type ==='insert'){
        return acc+operation.quantity
    }else{
        return acc-operation.quantity;
    }
},0)
return balance;
};





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
declaration:[],
});

return response.status(201).json({message:"product create"})
});

app.get("/product",verifyIfProductAlrearyExists,(request,response)=>{
    const {products}=request;

    return response.status(201).json(products);
});


app.post("/productInsert",verifyIfProductAlrearyExists,(request,response)=>{
const {products}=request;
const {description,quantity,validate}=request.body;

const declarationOperation={
description,
quantity,
validate,
type:"insert",
};
products.declaration.push(declarationOperation);

return response.status(201).json({message:"products insert"})
});

app.post("/productRemove",verifyIfProductAlrearyExists,(request,response)=>{
    const {products}=request;
    const{quantity,validate}=request.body;
    const balance=getbalance(products.declaration);

  
    if(balance < quantity){
        return response.status(400).json({error:"insufficient products"})
    }
    
const declarationOperation={
    quantity,
    validate,
    type:"remove",
}
products.declaration.push(declarationOperation);
 return response.status(201).json({message:"products remove"});

});

app.get("/balance",verifyIfProductAlrearyExists,(request,response)=>{
const {products}=request;
const balance=getbalance(products.declaration);
return response.status(201).json(balance);
});