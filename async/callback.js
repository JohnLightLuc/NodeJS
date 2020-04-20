require('babel-register')

console.log('Debut')

// Fonction callback
getMember((member) =>{
    console.log(member)
    getArticles((articles)=>{
        console.log(articles)
    })
})


console.log('Fin')

function getMember(next) {
    setTimeout(()=>{
        next('Member 1')
    }, 1500)
}

function getArticles(next){
    setTimeout(()=>{
        next([1,2,3])
    })
}