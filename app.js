const express= require('express');
const bodyparser=require('body-parser');
const ejs=require('ejs');
const mongoose=require('mongoose');
const { ppid } = require('process');
const port='3000';
const app=express();

app.set('view engine','ejs');
app.use(bodyparser.urlencoded({
    extended:true
}))
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wikiDb',{useNewUrlParser:true});

const articleSchema=new mongoose.Schema({
    title:String,
    content:String
})

const Article=mongoose.model('Article',articleSchema);

app.get('/article',(req,res)=>{
    Article.find({},(err,item)=>{
        if(!err){
            res.send(item);
        }
    })
})


//REQUEST TARGETING ALL ARTICLES 

app.post('/article',(req,res)=>{
    console.log(req.body.name);
    console.log(req.body.content);
    const newitem=new Article({
        title:req.body.name,
        content:req.body.content
    })
    newitem.save();

})

app.delete('/article',(req,res)=>{
    Article.deleteMany((err)=>{
        if(!err){
            console.log("Successfully deleted the items from the collection");
        }
    })
    res.redirect('/article');
})

//REQUEST TARETING A SPECIFIC ARTICLE

app.route('/article/:articletitle')

.get((req,res)=>{
    Article.findOne({title:req.params.articletitle},(err,foundarticle)=>{
        res.send(foundarticle);
    })

})    

.patch((req,res)=>{
    Article.update(
        {title:req.params.articletitle},
        {$set:req.body},
        (err)=>{
            if(!err){
                res.send('Successfully updated the item');
            }
        }
    )    

})

.delete((req,res)=>{
    Article.deleteOne(
        {title:req.params.articletitle},
        (err)=>{
            if(!err){
                res.send('Successfully deleted the item');
            }
        }
        )
    
})

app.listen(port,()=>{
    console.log(`The server is running on port ${port}`)
});
 