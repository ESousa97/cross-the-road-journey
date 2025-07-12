window.laneSystem = {
    laneCount: 12,
    getAllLanes: function() {
        // Gera as faixas dinamicamente entre o topo e o fundo do canvas
        let lanes = [];
        let marginTop = canvasHeight * 0.12; // por exemplo, 12% do canvas de margem superior
        let marginBottom = canvasHeight * 0.15; // por exemplo, 15% margem inferior
        let areaHeight = canvasHeight - marginTop - marginBottom;
        for (let i = 0; i < this.laneCount; i++) {
            let y = marginTop + (i + 0.5) * areaHeight / this.laneCount;
            lanes.push(y);
        }
        return lanes;
    },
    getActiveLanes: function(level) {
        const count = Math.min(3 + (level - 1), this.laneCount);
        return this.getAllLanes().slice(0, count);
    },
    getFastLaneChance: function(level) {
        return Math.min(0.2 + (level - 4) * 0.1, 0.8);
    }
};
