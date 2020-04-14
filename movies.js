var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var id = Math.floor(Math.random() * 1000000) + 1;

mongoose.connect('mongodb://localhost/my_db', { useNewUrlParser: true , useFindAndModify: false, useUnifiedTopology: true });

var movieSchema = mongoose.Schema({
    movieId: Number,
    name: String,
    year: Number,
    rating: Number
});
var movies = mongoose.model("movies", movieSchema);

router.get("/", function(req, res){
    movies.find({},{'_id':0, '__v':0}).exec(function(err, response){
        if(err) throw err;
        res.status(200);
        res.json(response);
    })
});

router.get("/:type/:value", function(req, res){
    if(req.params.type!="name"&&req.params.type!="year"&&req.params.type!="movieId"){
        res.status(400);
        res.json({message: "Bad Request", value:req.params.type});
    }
    else{
        var type = req.params.type;
        var value = req.params.value;
        movies.find({[type]:value},{'_id':0,'__v':0},function(err, response){
            if(err)
                res.json({message: "Bad Request", value:req.params.type});
            else{
                res.status(200);
                res.json(response);
            }
        });
    }
});

router.post("/", function(req, res){
    if(!req.body.name || !req.body.year || !req.body.rating){
        res.status(400);
        res.json({message: "Bad Request",Details: {movieId:id, Name:req.body.name, Year: req.body.year, rating: req.body.rating}});
    }
    else{
        var newMovie = new movies({
            movieId: id,
            name: req.body.name,
            year: req.body.year,
            rating: req.body.rating
          });
          newMovie.save(function(err, mov){
             if(err)
                res.json({message: "Database error", type: "error"});
             else{
                res.status(201);
                res.json({Status:"Success",Details: {movieId:id, Name:req.body.name, Year: req.body.year, rating: req.body.rating}});
            }
          });
          id=id+1;
    }
});

router.put("/", function(req, res){
    if(!req.body.movieId){
        res.status(400);
        res.json({message: "Bad Request",Details: {movieId:id, Name:req.body.name, Year: req.body.year, rating: req.body.rating}});
    }
    else{
        var movieId = req.body.movieId;
        var newMovie ={
            name: req.body.name||"N/A",
            year: req.body.year||0,
            rating: req.body.rating||0
        };
          //delete newMovie._id;
         // console.log(newMovie);
      movies.findOneAndUpdate({"movieId":movieId},{$set:newMovie},{returnNewDocument : true}).exec(function(err, mov){
             if(err)
                res.json({message: "Query error", type:err});
             else{
                res.status(201);
                res.json({Status:"Success",Details: mov});
            }
        });
          id=id+1;
    }
});

router.delete("/:type/:value", function(req, res){
    if(req.params.type!="name"&&req.params.type!="year"&&req.params.type!="movieId"){
        res.status(400);
        res.json({message: "Bad Request", value:req.params.type});
    }
    else{
        var type = req.params.type;
        var value = req.params.value;
        movies.deleteOne({[type]:value},function(err, mov){
            if(err){
                 res.json({message: "Database error", type: "error"});
            }
            else{
                res.status(200);
                res.json({Status:"Success",Removed: {[type]:value}});
            }
        });
    }
});

module.exports = router;
