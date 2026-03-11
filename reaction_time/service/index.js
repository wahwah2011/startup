const port = process.argv.length > 2 ? process.argv[2] : 4000;

/*Add this code to service/index.js to cause Express static middleware to 
serve files from the public directory once your code has been deployed to 
your AWS server.*/
app.use(express.static("public"));
