const fs = require('fs')
const http = require('http')
const url = require('url')

const replaceTemplate = require('./modules/replaceTemplate')


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8')

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj = JSON.parse(data)

const port = process.env.PORT || 8000

//create server gets executed everytime there is a request
//readFileSync code above gets executed only once
const server = http.createServer((req,res)=> {

    const { query, pathname } = url.parse(req.url, true)
    console.log('proto',   req.headers['x-forwarded-proto']);


    //overview page
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200, { 'content-type': 'text/html' })

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)

        res.end(output)

    //product page
    } else if (pathname === '/product') {
        res.writeHead(200, { 'content-type': 'text/html' })
        const product = dataObj.filter(el => el.id==query.id)[0]

        console.log(product)
        const output = replaceTemplate(tempProduct, product)
        res.end(output)
    
    //api
    } else if (pathname === '/api'){
            res.writeHead(200, {'content-type':'application/json'})
            res.end(data);
    
    //not found
    } else {
        res.writeHead(404, {
            'content-type': 'text/html',
            'my-own-header': 'hello-world'
        })
        res.end('not found');
    }
})

server.listen(port,()=>{
    console.log(`Listening to requests on port ${port}`)
})