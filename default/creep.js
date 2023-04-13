const game = require('game')

class MyCreep {
    /** @param {Creep} creep **/
    creep
    
    constructor (creep) {
        if (typeof creep === 'string') {
            this.creep = Game.creeps[creep]
        } else {
            this.creep = creep
        }
    }
    
    static getBodyCost(body) {
        return body.reduce((acc, bodyPart) => acc + BODYPART_COST[bodyPart], 0)
    }
    
    static getNewBody(body, newParts, room) {
        let newBody = body.concat(newParts)
        if (this.getBodyCost(newBody) <= game.getStoragesEnergyTotalAmount(room)) {
            return newBody
        }
        return body
    }
    
    getName() {
        return this.creep.name
    }
    
    dyingNearSpawn() {
        if (this.creep.ticksToLive <= 50 && this.creep.store.getUsedCapacity() > 0) {
            const closestSpawner = this.creep.pos.findClosestByRange(FIND_MY_SPAWNS)
            this.creep.moveTo(closestSpawner)
            return true
        }
        return false
    }
}

module.exports = MyCreep