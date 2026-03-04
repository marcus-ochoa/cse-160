class Sphere {
    constructor(sectorCount = 30, stackCount = 30, textureID = 0, uvScalar = 1.0) {
        this.type = "Sphere";

        this.textureID = textureID;

        this.stackCount = stackCount;
        this.sectorCount = sectorCount;

        this.vertices;
        this.texCoords;
        this.normals;

        this.generate();

        this.texCoords = this.texCoords.map(function(x) { return x * uvScalar; });
    }

    generate() {
        
        // Check source / base here: https://songho.ca/opengl/gl_sphere.html#sphere

        let uniqueVertices = [];
        let uniqueTexCoords = [];
        let uniqueNormals = [];

        let sectorStep = (2 * Math.PI) / this.sectorCount;
        let stackStep = Math.PI / this.stackCount;

        for (let i = 0; i <= this.stackCount; i++) {
            let stackAngle = Math.PI / 2 - i * stackStep;
            let xy = Math.cos(stackAngle);
            let z = Math.sin(stackAngle);

            for (let j = 0; j <= this.sectorCount; j++) {
                let sectorAngle = j * sectorStep;

                let x = xy * Math.cos(sectorAngle);
                let y = xy * Math.sin(sectorAngle);
                uniqueVertices.push(x, y, z);

                uniqueNormals.push(x, y, z);

                uniqueTexCoords.push(j / this.sectorCount);
                uniqueTexCoords.push(i / this.stackCount);
            }
        }

        let finalVertices = [];
        let finalTexCoords = [];
        let finalNormals = [];

        for (let i = 0; i < this.stackCount; i++) {
            let k1 = i * (this.sectorCount + 1);
            let k2 = (k1 + this.sectorCount + 1);

            for (let j = 0; j < this.sectorCount; j++, k1++, k2++) {

                if (i != 0) {
                    finalVertices.push(uniqueVertices[k1 * 3], uniqueVertices[k1 * 3 + 1], uniqueVertices[k1 * 3 + 2]);
                    finalTexCoords.push(uniqueTexCoords[k1 * 2], uniqueTexCoords[k1 * 2 + 1]);
                    finalNormals.push(uniqueNormals[k1 * 3], uniqueNormals[k1 * 3 + 1], uniqueNormals[k1 * 3 + 2]);

                    finalVertices.push(uniqueVertices[k2 * 3], uniqueVertices[k2 * 3 + 1], uniqueVertices[k2 * 3 + 2]);
                    finalTexCoords.push(uniqueTexCoords[k2 * 2], uniqueTexCoords[k2 * 2 + 1]);
                    finalNormals.push(uniqueNormals[k2 * 3], uniqueNormals[k2 * 3 + 1], uniqueNormals[k2 * 3 + 2]);

                    finalVertices.push(uniqueVertices[(k1 + 1) * 3], uniqueVertices[(k1 + 1) * 3 + 1], uniqueVertices[(k1 + 1) * 3 + 2]);
                    finalTexCoords.push(uniqueTexCoords[(k1 + 1) * 2], uniqueTexCoords[(k1 + 1) * 2 + 1]);
                    finalNormals.push(uniqueNormals[(k1 + 1) * 3], uniqueNormals[(k1 + 1) * 3 + 1], uniqueNormals[(k1 + 1) * 3 + 2]);
                }

                if (i != (this.stackCount - 1)) {
                    finalVertices.push(uniqueVertices[(k1 + 1) * 3], uniqueVertices[(k1 + 1) * 3 + 1], uniqueVertices[(k1 + 1) * 3 + 2]);
                    finalTexCoords.push(uniqueTexCoords[(k1 + 1) * 2], uniqueTexCoords[(k1 + 1) * 2 + 1]);
                    finalNormals.push(uniqueNormals[(k1 + 1) * 3], uniqueNormals[(k1 + 1) * 3 + 1], uniqueNormals[(k1 + 1) * 3 + 2]);

                    finalVertices.push(uniqueVertices[k2 * 3], uniqueVertices[k2 * 3 + 1], uniqueVertices[k2 * 3 + 2]);
                    finalTexCoords.push(uniqueTexCoords[k2 * 2], uniqueTexCoords[k2 * 2 + 1]);
                    finalNormals.push(uniqueNormals[k2 * 3], uniqueNormals[k2 * 3 + 1], uniqueNormals[k2 * 3 + 2]);

                    finalVertices.push(uniqueVertices[(k2 + 1) * 3], uniqueVertices[(k2 + 1) * 3 + 1], uniqueVertices[(k2 + 1) * 3 + 2]);
                    finalTexCoords.push(uniqueTexCoords[(k2 + 1) * 2], uniqueTexCoords[(k2 + 1) * 2 + 1]);
                    finalNormals.push(uniqueNormals[(k2 + 1) * 3], uniqueNormals[(k2 + 1) * 3 + 1], uniqueNormals[(k2 + 1) * 3 + 2]);
                }
            }
        }

        console.log(uniqueVertices.length);

        this.vertices = new Float32Array(finalVertices);
        this.texCoords = new Float32Array(finalTexCoords);
        this.normals = new Float32Array(finalNormals);
    }
}
