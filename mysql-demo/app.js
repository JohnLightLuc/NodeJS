require("babel-register")
const mysql = require('mysql')
const morgan = require('morgan')
const {success, error} = require('./fonctions')
const bodyParser = require('body-parser')
const express = require("express")
const app = express()
const conf = require("./config")


var membres = [
    {
        'id':1,
        'name':'Karim'
    },
    {
        'id':2,
        'name':'Azim'
    },
    {
        'id':3,
        'name':'New dev'
    },
];



const db = mysql.createConnection({
    host: 'localhost',
    database: 'nodejs',
    user:'root',
    password: ''
})

db.connect((err) =>{
    
    if (err)
        console.log(err.message)
    else
        console.log('Connect on id '+ db.threadId)
        db.query('SELECT * FROM members', (err, result) =>{
            if (err)
                console.log(err.message)
            else
                console.log(result)
        })
})

let MemberRouter = express.Router()

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

MemberRouter.route('/:id')
    // RECUPERATION DE MEMBERS
    .get((req, res) =>{
        let index = getIndex(req.params.id);
        if (typeof(index) == 'string'){
            res.send(error(index))
        }else{
            res.json(success(membres[index]))
        }
        
    })

    // MODIFICATION DE MEMBERS
    .put((req, res) =>{
        let exist = false
        let index = getIndex(req.params.id);
        if (typeof(index) == 'string'){
            res.send(error(index))
        }else{
            for(let i=0; i < membres.length; i++){
                if (membres[i].name == req.body.name){
                exist = true
                break
                }
            }
            if (exist){
                res.json(error("Ce nom existe deja"))
            }else{
                membres[index].name = req.body.name;
                res.json(success(true));
            }
            
        }
        
    })

    // SUPPRESSION DE MEMBERS
    .delete((req, res) =>{
        let index = getIndex(req.params.id);
        if (typeof(index) == 'string'){
            res.send(error(index))
        }else{
            let mbre = membres[index] 
            membres.splice(index, 1)
            res.json(success(mbre))
        }
        
    })

MemberRouter.route('/')
    // RECUPERATION DE MEMBRES
    .get((req, res)=>{
        res.json(success(membres))
    })

    // ENREGISTRER DE MEMBRES
    .post((req, res)=>{
        if (req.body.name){
            var exist = false;
            for(var i= 0; i < membres.length; i++ ){
                if (req.body.name == membres[i].name ){
                    exist= true;
                    break;
                }
            }
            if (exist){
                res.json(error('Ce nom exist deja'))
            }else{
                let myid = newID()
                let newmember = {
                    id: myid,
                    name: req.body.name
                }
                membres.push(newmember)
                res.json(success(newmember))
            }
            

        }else{
            res.json(error('No name value'))
        }
        
    })


app.use(conf.routApi + 'members', MemberRouter)
app.listen(conf.port , ()=>{
    console.log("Start at "+ conf.port )
})


function getIndex(id){
    for(let i=0; i < membres.length; i++){
        if (membres[i].id == id){
            return i
        }
    }
    return 'Wrong id'   
}

function newID(){
    return (membres[membres.length -1].id + 1)
}