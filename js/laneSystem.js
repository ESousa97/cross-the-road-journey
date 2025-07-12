// laneSystem.js
window.laneSystem = {
    allLanes: [60, 100, 140, 180, 220, 280, 320, 360, 400, 440, 480, 520],
    getActiveLanes: function(level) {
        var baseLanes = Math.min(3 + (level - 1), 12);
        return this.allLanes.slice(0, baseLanes);
    },
    getFastLaneChance: function(level) {
        return Math.min(0.2 + (level - 4) * 0.1, 0.8);
    }
};
