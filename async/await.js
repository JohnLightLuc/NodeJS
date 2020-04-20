require('babel-register')

console.log('Debut')

async function viewArticles(){
    try{
        let member = await getMember()
        let articles = await getArticles(member)
        console.log(articles)

    }catch (err){
        console.log(err.message)
    }
    
}

viewArticles()

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

console.log('Fin')
