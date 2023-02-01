const express = require("express"),
    http = require("http");
const cors = require("cors"),
    listEndpoints = require("express-list-endpoints");
require("dotenv").config();
const server = express();
const port = process.env.PORT || 3001;

server.use(cors());
server.use(express.json());

server.use("/product", require("./api/product"));

server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on port ${port}`);
});
