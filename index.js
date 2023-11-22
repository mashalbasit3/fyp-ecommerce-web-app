import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import {router} from "./routes/routes.js";

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use("/api", router);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.CN_MDB);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

connectDB().then(() => {
  app.listen(process.env.PORT, () =>{
    console.log(`Server is working on port: ${process.env.PORT}`)
});
})