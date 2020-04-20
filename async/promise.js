require('babel-register')

console.log('Debut')

getMember()
    .then(member => getArticles(member))
    .then(articles => console.log(articles))
    .catch(err => console.log(err.message))


function getMember() {
    return new Promise((resolve, reject) =>{
        setTimeout(()=>{
            console.log('Member 1')
            resolve('Member 1')
        }, 1500)
    })
    
}

function getArticles(member){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
           resolve([1,2,3])
           reject(new Error('Error during getArticles ...'))
        })
    })
    
}

// METTRE EN PARALLELE DES PROMISE

console.log('Debut')

let p1 = new Promise((resolve, reject) =>{
    setTimeout(()=>{
        resolve('Promise 1')
    }, 1500)
})

let p2 = new Promise((resolve, reject) =>{
    setTimeout(()=>{
        resolve('Promise 2')
    }, 3500)
})

// all: pour recuperertoutes les promise
// race : la plus rapide
Promise.race([p1, p2])
    .then((result)=> console.log(result))

console.log('Fin')
