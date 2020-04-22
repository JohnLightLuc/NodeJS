require("babel-register")
const mysql = require('mysql')
const morgan = require('morgan')
const {success, error} = require('./fonctions')
const bodyParser = require('body-parser')
const express = require("express")
const conf = require("./config")


const db = mysql.createConnection({
    host: conf.host,
    database: conf.db,
    user: conf.user,
    password: conf.password
})

db.connect((err) =>{
    
    if (err)
        console.log(err.message)
    else
        console.log('Connect. ')

        const app = express()

        let MemberRouter = express.Router()

        app.use(morgan('dev'))
        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({ extended: false }))

        MemberRouter.route('/:id')
            // RECUPERATION DE MEMBERS PAR ID
            .get((req, res) =>{
                db.query('SELECT * FROM members WHERE id = ?', [req.params.id], (err, result)=>{
                    if(err){
                        res.json(error(err.message))
                    }else{
                        if (result[0] != undefined) {
                            res.json(success(result))
                        }else{
                            res.json(error('Wrong id')) 
                        }
                    
                    }
                })

                
            })

            // MODIFICATION DE MEMBERS
            .put((req, res) =>{
                db.query('SELECT * FROM members WHERE id = ?', [ req.params.id ], (err, result)=>{
                    if(err){
                        res.json(error(err.message))
                    }else{
                        if (result[0] != undefined){
                            db.query('SELECT * FROM members WHERE id = ? AND name = ?', [req.params.id, req.body.name ], (err, result)=>{
                                if (err){
                                    res.json(error(err.message))
                                }else{
                                    if (result[0] != undefined){
                                        res.json(error('Same name'))
                                    }else{
                                        db.query('UPDATE members SET name= ? WHERE id = ?', [ req.body.name, req.params.id ], (err, result)=>{
                                            if (err){
                                                res.json(error(err.message))
                                            }else{
                                                res.json(success("Modifié avec succes"))
                                            }
                                        })
                                       
                                    }
                                }
                            })
                           
                        }else{
                            res.json(error('Wrong id'))
                        }
                    }
                })
                
            })

            // SUPPRESSION DE MEMBERS
            .delete((req, res) =>{
                db.query('SELECT * FROM members WHERE id = ?', [ req.params.id ] , (err, result) =>{
                    if (err){
                        res.json(error(err.message))
                    }else{
                        console.log(result[0])
                        if (result[0] != undefined){
                            db.query('DELETE FROM members WHERE id = ?', [ req.params.id ], (err, result)=>{
                                if (err){
                                    res.json(error(err.message))
                                }else{
                                    res.json(success("Supprimé avec succes"))
                                }
                            })
                           
                        }else{
                            res.json(error("Id n'existe pas"))
                           
                        }
                    }
                 
                })
               
            })

        MemberRouter.route('/')
            // RECUPERATION DE PostTOUS MEMBRES
            .get((req, res)=>{
                if (req.query.max != undefined && req.query.max > 0){
                    db.query("SELECT * FROM members LIMIT 0, ?", [ parseInt(req.query.max) ], (err, result)=>{
                        if(err){
                            res.json(error(err.message))
                        }else{
                            res.json(success(result))
                        }
                    })

                }else if (req.query.max != undefined){
                    res.json(error("Wrong max value"))
                }else{
                    db.query('SELECT * FROM members', (err, result)=>{
                        if(err){
                            res.json(error(err.message))
                        }else{
                            res.json(success(result))
                        }
                    })

    
                }
            })

            // ENREGISTRER DE MEMBRES
            .post((req, res)=>{
                if (req.body.name){
                    db.query('SELECT * FROM members WHERE name = ?',[req.body.name], (err, result)=>{
                        if(err){
                            res.json(error(err.message))
                        }else{
                            if (result[0] != undefined){
                                res.json(error('Name already taken'))
                            }else{
                                db.query('INSERT INTO members (name) value(?)', [req.body.name] , (err, result)=>{
                                    if(err){
                                        res.json(error('err.message'))
                                    }else{
                                        db.query('SELECT * FROM members WHERE name = ?',[req.body.name], (err, result)=>{
                                            if(err){
                                                res.json(error(err.message))
                                            }else{
                                                res.json(success({
                                                    id: result[0].id,
                                                    name: result[0].name
                                                }))
                                            }
                                        })
                                    }
                                })

                            }
                           
                        }
                    })
                }else{
                    res.json(error('No name value'))
                }
                
            })


        app.use(conf.routApi + 'members', MemberRouter)
        app.listen(conf.port , ()=>{
            console.log("Start at "+ conf.port )
        })

        
})
