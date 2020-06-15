import "reflect-metadata";
import connect from "./database/connections";

connect.then(async connection => {

    console.log("Inserting a new user into the database...");

    console.log("Here you can setup and run express/koa/any other framework.");

}).catch(error => console.log(error));