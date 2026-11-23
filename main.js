class Block {
    constructor(index, previousHash, data, timestamp, hash) {
        this.index = index;
        this.previousHash = previousHash.toString();
        this.data = data;
        this.timestamp = timestamp;
        this.hash = hash;
    }
}
