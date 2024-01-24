
/*
const express = require("express");
const app = express();
//app.use("/images", express.static("/uploads/users"));
app.use(express.static('Example-1'))
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.listen(3000, function () {
    console.log("Server is running on localhost3000");
});
*/



// Requiring module
const express = require('express');

// Creating express object
const app = express();

// Defining port number
const PORT = 3000;

// Function to serve all static files
// inside public directory.
app.use(express.static('public'));
app.use('/images', express.static('images'));

// Server setup
app.listen(PORT, () => {
	console.log(`Running server on PORT ${PORT}...`);
})
