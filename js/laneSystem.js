window.laneSystem = {
    laneCount: 12,
    getAllLanes: function() {
        let lanes = [];
        let marginTop = canvasHeight * 0.12;
        let marginBottom = canvasHeight * 0.15;
        let areaHeight = canvasHeight - marginTop - marginBottom;

        for (let i = 0; i < this.laneCount; i++) {
            // i / (laneCount - 1) faz a 1ª e a última ficarem nas bordas do asfalto
            let y = marginTop + (i / (this.laneCount - 1)) * areaHeight;
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
