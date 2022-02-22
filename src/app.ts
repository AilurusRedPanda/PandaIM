import { express, Application, bodyParser, expressJwt } from "./definitionFile.js";
import routes from "./views.js";
import config from "./config.js";
import { initDataBase } from "./db.js";

const app: Application = express();
const { dbAddr, root, port, secret } = config;

// parse application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
    expressJwt({
        secret,
        algorithms: ["HS256"],
        credentialsRequired: false,
        getToken: function fromHeaderOrQuerystring(req) {
            if (req.headers) return req.headers.cookie.slice(6).split(" ")[1];
        },
    }).unless({ path: ["/login", "/"] }),
);

function setStatic() {
    app.use(express.static(`${root}static`));
}

function setRouter() {
    Object.values(routes).forEach(route => route(app, root));
}

function startServer() {
    initDataBase(dbAddr);
    setStatic();
    setRouter();
    app.listen(port, () => console.log(`Listening to http://127.0.0.1:${port}`));
}

startServer();
