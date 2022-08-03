const { request } = require('express')
const express = require('express')
const Block = require("./block")
const Blockchain=require('./blockchain')
const Transaction=require('./transaction')
const BlockchainNode =require('./blockchainnode')

const app = express()
app.use(express.json())
const arguments= process.argv
let PORT = 8080
if(arguments.length>2){
    PORT=arguments[2]

}

let transactions=[]
let nodes=[]
let genesisblock= new Block()
let blockchain = new Blockchain(genesisblock)
let allTransactions=[]


app.get('/resolve',(req,res)=>{
    nodes.forEach(node=>{
        fetch(`${node.url}/blockchain`)
        .then(response=>response.json())
        .then(otherBlockchain =>{
            if(blockchain.blocks.length<otherBlockchain.blocs.length){
                allTransactions.forEach(transaction=>{
                    fetch(`${node.url}\transactions`,{
                        method:'POST',
                        headers:{
                            "Content-type":'application/json'

                        }
                        ,
                        body:JSON.stringify(transaction)
                    }).then(response=>response.json()).then(_=>{
                        fetch(`${node.url}/mine`)
                        .then(response=>response.json())
                        .then(_=>{
                            fetch(`${node.url}/blockchain`)
                            .then(response => response.json())
                            .then(updatedBlockchain=>{
                                blockchain=updatedBlockchain
                                res.json(blockchain)
                            })
                        })
                    })
                })
            }
            else{
                res.json(blockchain)
            }
        })
    })
})
app.post('/nodes/register',(req,res)=>{
    const urls =req.body
    urls.forEach(url=>{
        const node= new BlockchainNode(url)
        nodes.push(node)
    })
    res.json(nodes)
})

app.post("/transactions",(req,res)=>{
    const to =req.body.to
    const from  = req.body.from
    const amount = req.body.amount
    let transaction = new Transaction(to,from,amount)
    transactions.push(transaction)

    res.json(transactions)
})

app.get('/mine',(req,res)=>{
    let block = blockchain.getNextBlock(transactions)
    blockchain.addBlock(block)
    transactions.forEach(transaction=>{
        allTransactions.push(transaction)
    })
    transactions=[]
    res.json(block)
})
app.get('/blockchain',(req,res)=>{
    res.json(blockchain)
    
})
app.listen(PORT,()=>{
    console.log('Server is running on PORT '+PORT)
    console.log(blockchain)
})




