
import  homeRouter  from "./home.route.js";
import  userRouter  from "./user.routes.js";
import express from "express";
const mainRouter = express.Router();

mainRouter.use("/", userRouter);
//mainRouter.use("/", homeRouter);

export default mainRouter ;
