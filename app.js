const express = require('express');
const fs = require('fs'); //File system que lee movies.json
const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(3000, () => {
    console.log('Successful conection on port 3000');
});

//Método GET
app.get('/', function (request, response){
    response.send("Hello there");
});
app.get('/movies',(req,res) => {
    fs.readFile('movies.json', (error, file) => {
        if(error){
            console.log("File cannot be read", error);
            return;
        }
        const movies = JSON.parse(file);
        return res.json(movies);
    });
});

//Método POST
app.post('/movies',(req,res)=>{
    fs.readFile('movies.json',(err,data)=>{
        if(err){
            console.log("ERROR: File cannot be read",err);
        }
        const movies = JSON.parse(data);
        const newMovieID = movies.length + 1;
        req.body.id = newMovieID;
        movies.push(req.body);

        //Array with the new movie
        const newMovie = JSON.stringify(movies,null,2);
        fs.writeFile('movies.json',newMovie,(err)=>{
            if(err){
                console.log("An error has ocurred when the file was uploading. Try Again!", err);
            }
            return res.status(200).send("New movie added!!");
        });
    });
});

//Método PATCH
app.patch('/movies/:id',(req,res) => {
    const mid = req.params.id;
    const { name,year } = req.body;
    fs.readFile('movies.json', (err,data) => {
        if(err){
            console.log("ERROR: File cannot be read",err);
        }
        const movies = JSON.parse(data);
        movies.forEach(movie => {
            if(movie.id === Number(mid)){
                if(name != undefined){
                    movie.name = name;
                }
                if(year != undefined){
                    movie.year = year;
                }
                const movieUpdated = JSON.stringify(movies,null,2);
                fs.writeFile('movies.json',movieUpdated,(err)=>{
                    if(err){
                        console.log("An error has ocurred when the file was uploading. Try Again!", err);
                    }
                    return res.status(200).json({message: "movie updated"});
                });
            }
        });
    });
});

//Método Delete
app.delete('/movies/:id',(req,res) => {
    const mid = req.params.id;
    fs.readFile('movies.json', (err,data) => {
        if(err){
            console.log("ERROR: File cannot be read",err);
        }
        const movies = JSON.parse(data);
        movies.forEach(movie => {
            if(movie.id === Number(mid)){
                movies.splice(movies.indexOf(movie),1);
                const movieDeleted = JSON.stringify(movies,null,2);
                fs.writeFile('movies.json',movieDeleted,(err)=>{
                    if(err){
                        console.log("An error has ocurred when the file was uploading. Try Again!", err);
                    }
                    return res.status(200).json({message: "movies updated"});
                });
            }
        });
    });
});