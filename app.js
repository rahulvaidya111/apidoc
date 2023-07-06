let express = require('express');
let app = express();
let port = process.env.PORT||9120;
let Mongo = require('mongodb');
const bodyParser = require('body-parser');
const cors = require ('cors');
let {dbConnect,getData,postData,updateorder} = require('./controller/dbcontroller')

// middleware supporting liberary to postman
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())



// get all categories
app.get('/categories',async (req,res)=>{
    let query = {};
    let collection = "categories"
    let output = await getData(collection,query)
    res.send(output)
})

//get all products
app.get('/products', async (req,res) => {
    let query = {};
    if(req.query.categoryid){
        query={category_id: Number(req.query.categoryid)}
    }else{
        query = {}
    }
    let collection = "products";
    let output = await getData(collection,query);
    res.send(output)
})


// get similarItem
app.get('/SimilarItem', async(req,res) => {
    let query = {}
    if(req.query.categoryid){
        query={category_id: Number(req.query.categoryid)}
    }else{
        query = {}
    }
    let collection = "SimilarItem";
    let output = await getData(collection,query);
    res.send(output)
})

// get Todaydeals
app.get('/TodayDeals', async (req,res) => {
    let query = {};
    if(req.query.categoryId){
        query={category_id: Number(req.query.categoryId)}
    }
    // else if(req.query.item){
    //     query={"TodayDeals.item": Number(req.query.item)}
    // }
    // item se find kar raha tha
    else{
        query = {}
    }
    let collection = "TodayDeals";
    let output = await getData(collection,query);
    res.send(output)
})

// ---------------Data find the basic of cost--------------------


// Details Item

app.get('/Detailsitem/:id', async (req,res) => {
    let id = Number(req.params.id);
    let query = {category_id:id};
    let collection = "Detailsitem";
    let output = await getData(collection,query);
    res.send(output)
})

// Order list

app.get('/orders',async(req,res)=>{
    let query = {};
    if(req.query.email){
        query={email:req.query.email}
    }else{
        query = {}
    }
    let collection = "orders";
    let output = await getData(collection,query);
    res.send(output)
})

//placeOrder
app.post('/placeorders',async(req,res) => {
    let data = req.body;
    let collection = "orders";
    console.log(">>>",data)
    let response = await postData(collection,data)
    res.send(response)
})

//menu details {"id":[4,8,2]}
app.post('/Detailsitem',async(req,res) => {
    if(Array.isArray(req.body.id)){
        let query = {Deals_id:{$in:req.body.id}};
        let collection = 'Deals';
        let output = await getData(collection,query);
        res.send(output)
    }else{
        res.send('Please Pass data in form of array')
    }
})


// update orders
app.put('/updateorder',async(req,res)=>{
    let collection = 'orders';
    let condition = {"_id":new Mongo.ObjectId(req.body._id)}
    let data = {
        $set:{
            "status":req.body.status
        }
    }
    let response = await updateorder(collection,condition,data)
})



// Delete order

app.listen(port,(err) => {
    dbConnect()
    if(err) throw err;
    console.log(`Server is running on port ${port}`)
})

