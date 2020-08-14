import "dotenv/config"
import createConnection from "../typeorm/database/connections"
import app from "./routes/control";
createConnection()

app.listen(3333, () => {
  console.log("[SERVER] Running at port 3333")
})