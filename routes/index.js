
import { homeRouter } from "./home.route.js";
import { userRouter } from "./user.route.js";

const mainRouter = express.Router();

mainRouter.use("/", userRouter);
mainRouter.use("/", homeRouter);

export { mainRouter };
