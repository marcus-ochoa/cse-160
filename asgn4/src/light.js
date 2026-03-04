class Light {
    constructor(
        color = [1.0, 1.0, 1.0],
        position = [0.0, 0.0, 0.0],
        ambient = [1.0, 1.0, 1.0],
        rotRadius = 20.0,
        isEnabled = true,
        isNormalMode = false
    ) {
        this.type = "Light";

        this.sourceObject = new GameObject(this.position, [0.0, 0.0, 0.0], [1.0, 1.0, 1.0], "baseSphere", g_colors.white, 0.0, false, false);

        this.color = color;
        this.setColor(color);

        this.position = position;
        this.setPosition(position);

        this.ambient = ambient;
        this.setAmbient(ambient);

        this.rotRadius = rotRadius;

        this.isEnabled = isEnabled;
        this.setEnabled(isEnabled);

        this.isNormalMode = isNormalMode;
        this.setNormalMode(isNormalMode);
    }

    setColor(color) {
        this.color = color;
        gl.uniform3f(u_LightColor, color[0], color[1], color[2]);
    }

    setPosition(pos) {
        this.position = pos;
        gl.uniform3f(u_LightPosition, pos[0], pos[1], pos[2]);
        this.sourceObject.position = pos;
    }

    setAmbient(color) {
        this.ambient = color;
        gl.uniform3f(u_AmbientLight, color[0], color[1], color[2]);
    }

    render() {
        this.sourceObject.render();
    }

    setPositionByAngle(polar, azimuth) {
        let newPos = [0.0, 0.0, 0.0];

        polar = polar * (Math.PI / 180.0);
        azimuth = azimuth * (Math.PI / 180.0);

        newPos[0] = this.rotRadius * Math.sin(polar) * Math.cos(azimuth);
        newPos[2] = this.rotRadius * Math.sin(polar) * Math.sin(azimuth);
        newPos[1] = this.rotRadius * Math.cos(polar);
        this.setPosition(newPos);
    }

    setEnabled(val) {
        this.isEnabled = val;
        gl.uniform1f(u_GlobalLit, val ? 1.0 : 0.0);
    }

    setNormalMode(val) {
        this.isNormalMode = val;
        gl.uniform1f(u_NormalMode, val ? 1.0 : 0.0);
    }
}
