import "dotenv/config"
import app from "./routes/control";

app.listen(3333, ()=>{
    console.log("[SERVER] Running at port 3333")
})