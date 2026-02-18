class BlockMap {
    constructor(
        size = 32,
        height = 4
    ) {
        this.type = "BlockMap";
        this.size = size;
        this.height = height;
        this.map = [];

        this.skybox = new GameObject([0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [500.0, 500.0, 500.0], "leafBlock", g_colors.skyBlue, 0.0, 0.0, true);
        this.ground = new GameObject([0.0, -0.5, 0.0], [0.0, 0.0, 0.0], [this.size, 1.0, this.size], "dirtBlock", g_colors.brown, 0.5, 1.0, true);
    }

    generate() {

        this.map = [];

        for (let i = 0; i < this.size ** 2; i++) {
            let col = [];

            let randNum = Math.random();

            let numBlocks = 0;
            if (randNum < 0.5) numBlocks = Math.floor(Math.random() * (this.height - 1) + 1);

            for (let j = 0; j < numBlocks; j++) {
                let xPos = (i % this.size) - (this.size / 2) + 0.5;
                let zPos = (Math.floor(i / this.size)) - (this.size / 2) + 0.5;
                let yPos = j + 0.5;

                col.push(new GameObject([xPos, yPos, zPos], [0.0, 0.0, 0.0], [1.0, 1.0, 1.0], "leafBlock", g_colors.grey, 0.4, 1.0, true));
            }

            this.map.push(col);
        }
    }

    render() {
        this.map.forEach((col) => {
            col.forEach((block) => { block.render(); });
        });

        this.skybox.render();
        this.ground.render();
    }

    getBlockfromPosition() {

        let blockX = Math.floor(camera.eye.elements[0]) + (this.size / 2);
        let blockZ = Math.floor(camera.eye.elements[2]) + (this.size / 2);


        let forwardVec = new Vector3();
        forwardVec.set(camera.at);
        forwardVec.sub(camera.eye);
        forwardVec.normalize();

        if (Math.abs(forwardVec.elements[0]) >= Math.abs(forwardVec.elements[2])) {
            if (forwardVec.elements[0] > 0) {
                blockX += 1;
            } else {
                blockX -= 1;
            }
        } else {
            if (forwardVec.elements[2] > 0) {
                blockZ += 1;
            } else {
                blockZ -= 1;
            }
        }

        return [blockX, blockZ];
    }

    addBlock() {

        let pos = this.getBlockfromPosition();

        let blockX = pos[0];
        let blockZ = pos[1];
        
        console.log("Adding Block to:");
        console.log(blockX, blockZ);

        if (blockX > this.size - 1 || blockX < 0 || blockX > this.size - 1 || blockZ < 0) {
            console.log("OUT OF RANGE TO ADD BLOCK");
            return
        }

        let i = blockZ * this.size + blockX;

        let xPos = (i % this.size) - (this.size / 2) + 0.5;
        let zPos = (Math.floor(i / this.size)) - (this.size / 2) + 0.5;
        let yPos = this.map[i].length + 0.5;

        this.map[i].push(new GameObject([xPos, yPos, zPos], [0.0, 0.0, 0.0], [1.0, 1.0, 1.0], "leafBlock", g_colors.grey, 0.4, 1.0, true));
    }

    deleteBlock() {

        let pos = this.getBlockfromPosition();

        let blockX = pos[0];
        let blockZ = pos[1];

        if (blockX > this.size - 1 || blockX < 0 || blockX > this.size - 1 || blockZ < 0) {
            console.log("OUT OF RANGE TO ADD BLOCK");
            return;
        }

        let i = blockZ * this.size + blockX;

        this.map[i].pop();
    }
}
