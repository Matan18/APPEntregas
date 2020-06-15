import express from "express";

const app = express();

app.get('/test', (req, res)=>{
    console.log("Access")
    res.send({message: "success"})
})

export default app;