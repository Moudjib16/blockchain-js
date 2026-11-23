class Block {
    constructor(index, previousHash, data, timestamp, hash) {
        this.index = index;
        this.previousHash = previousHash.toString();
        this.data = data;
        this.timestamp = timestamp;
        this.hash = hash;
    }
}

var calculateHash = (index, previousHash, timestamp, data) => {
    return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
};

var generateNextBlock = (blockData) => {
    var previousHash = getLatestBlock();
    var nextIndex = previousBlock.index + 1;
    var nextTimestamp = new Date().getTime() / 1000;
    var nextHash = calculateHash(nextIndex, previousHash.hash, nextTimestamp, blockData);
    return new Block(nextIndex, previousHash, blockData, nextTimestamp, nextHash)
}

// First block of the Blockchain is "genesis-block" which is hard coded

var getGenesisBlock = () => {
    return new Block(0, "0", 1795456048, "genesis block", "f4463ed15663d3f5bbcc8c59f74eeff7a3d9ff0ebfec2ffae0503f4984b7c09a");
};

var blockchain = [getGenesisBlock()];

var isvalidNewBlock = (newBlock, previousBlock) => {
    if (previousBlock.index + 1 !== newBlock.index) {
        console.log("invalid index");
        return false;
    } else if (previousBlock.hash !== newBlock.previousHash) {
        console.log("invalid previous hash");
        return false;
    } else if (calculateHashForBlock(newBlock) !== newBlock.hash) {
        console.log("invalid hash");
        return false;
    }

    return true;
}

