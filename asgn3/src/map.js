class Map {
    constructor(
        size = 32,
        height = 4
    ) {
        this.type = "Map";
        this.size = size;
        this.height = height;
        this.map = [];
    }

    generate() {

        for (let col = 0; col < this.size; col++) {
            let newCol = [];

            for (let row = 0; row < this.size; row++) {
                for (let i = 0; i < this.map[col][row]; i++) {
                    let xPos = col - (this.size / 2) + 0.5;
                    let zPos = row - (this.size / 2) + 0.5;
                    let yPos = i + 0.5;

                    newCol.push(new Cube([xPos, yPos, zPos], [0.0, 0.0, 0.0], [1.0, 1.0, 1.0], g_colors.grey, 0.4));
                } 
            }

            this.map.push(newCol);
        }
    }

    render() {
        for (let col = 0; col < this.size; col++) {
            for (let row = 0; row < this.size; row++) {
                for (let i = 0; i < this.map[col][row]; i++) {
                    let xPos = col - (this.size / 2) + 0.5;
                    let zPos = row - (this.size / 2) + 0.5;
                    let yPos = i + 0.5;

                    let testCube = new Cube([xPos, yPos, zPos], [0.0, 0.0, 0.0], [1.0, 1.0, 1.0], g_colors.grey, 0.4);
                    testCube.render();
                }
                
            }
        }
    }

    addBlock() {
        let playerPos = camera.eye;

        let forwardVector = new Vector3();
        forwardVector.set(camera.at);
        forwardVector.sub(camera.eye);

    }
}
