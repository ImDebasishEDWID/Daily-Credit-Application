import express from 'express';
import { Request, Response, NextFunction } from 'express';
import EnvData from './data/env.data';
import { HttpStatusCode,ResponseStatus } from './utils/enum.utils';
import { ResponseType } from './types/response.type';
import MongoDB from './db/mongo/db';

//Routes
import AuthRoute from './routes/auth.route';
import UserRoute from './routes/user.route';
import CustomerRoute from './routes/customer.route';
import PaymentRoute from './routes/payment.route';

//Establish MongoDB Connection
MongoDB.instance.connect().then(() => {
    console.log("MongoDB connected successfully"); 
}).catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,app-id,Authorization,platform,app-version,hash,x-access-token,app-type");
    res.header("Access-Control-Expose-Headers", "x-access-token,Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
    next();
});

//Routes
app.use("/api/v1/auth",AuthRoute.instance.router);
app.use("/api/v1/user",UserRoute.instance.router);
app.use("/api/v1/customer",CustomerRoute.instance.router);
app.use("/api/v1/payment",PaymentRoute.instance.router);

app.use(async (req: Request, res: Response) => {
    console.log(`Received request: ${req.method}: ${req.originalUrl}`);

    const response: ResponseType = {
        status: ResponseStatus.ERROR,
        message: "Unauthorized access",
    };
    return res.status(HttpStatusCode.UNAUTHORIZED).json(response);
});

app.get('/', (req, res) => {
  res.send('Main server is running ');
}); 

app.listen(EnvData.PORT, () => {
  console.log(`Server is running on http://localhost:${EnvData.PORT}`);
});