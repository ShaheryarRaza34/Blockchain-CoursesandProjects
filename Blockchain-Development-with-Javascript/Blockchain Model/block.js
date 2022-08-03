class Block{
    constructor(){
        this.index=0
        this.previousHash=""
        this.hash=""
        this.nounce=0
        this.transactions=[]
    }

    get key(){
        return JSON.stringify(this.transactions)+this.index+this.previousHash+this.nounce
    }

    addTransaction(transaction){
        this.transactions.push(transaction)
    }
}

module.exports=Block