let express = require('express');
let app = express();
let port = 9120;
let Mongo = require('mongodb');
const bodyParser = require('body-parser');
const cors = require ('cors');
let {dbConnect,getData,postData} = require('./controller/dbController')

// middleware supporting liberary
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())





app.get('/',(req,res) => {
    res.send('Hiii From express')
})




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
    let collection = "products";
    let output = await getData(collection,query);
    res.send(output)
})
// get similarItem
app.get('/SimilarItem', async(req,res) => {
    let query = {}
    if(req.query.stateId){
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
    }else{
        query = {}
    }
    let collection = "TodayDeals";
    let output = await getData(collection,query);
    res.send(output)
})


// Details Item

app.get('/ItemDetails', async (req,res) => {
    let query = {};
    let collection = "ItemDetails";
    let output = await getData(collection,query);
    res.send(output)
})

// Order list

app.get('/orders',async(req,res)=>{
    let email = req.query.email;
    if(email){
        query={email:email}
    }
    let query = {};
    let collection = "orders";
    let output = await getData(collection,query);
    res.send(output)
})

//placeOrder
app.post('/placeOrder',async(req,res) => {
    let data = req.body;
    let collection = "orders";
    console.log(">>>",data)
    let response = await postData(collection,data)
    res.send(response)
})

//menu details {"id":[4,8,21]}
app.post('/ItemDetails',async(req,res) => {
    if(Array.isArray(req.body.id)){
        let query = {Details_id:{$in:req.body.id}};
        let collection = 'Details';
        let output = await getData(collection,query);
        res.send(output)
    }else{
        res.send('Please Pass data in form of array')
    }
})


app.listen(port,(err) => {
    dbConnect()
    if(err) throw err;
    console.log(`Server is running on port ${port}`)
})

