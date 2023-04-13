const game = require('game')
const MyCreep = require('creep')

class Role extends MyCreep
{
    static getCreeps() {
        return _.filter(Game.creeps, creep => creep.memory.role === this.getRoleName())
    }
    
    static create(spawner) {
        if (game.getStoragesEnergyFilledAmount(spawner.room) < this.getBodyCost(this.getBody(spawner.room))) {
            return
        }
        
        console.log('Spawning a new creep: ' + this.getRoleName())
        spawner.spawnCreep(
            this.getBody(spawner.room),
            `${this.getRoleName()}.${Game.time}`,
            { memory: { role: this.getRoleName() } }
        )
    }
    
    run() {
        if (this.dyingNearSpawn()) {
            throw new Error('Stop running')
        }
    }
}

module.exports = Role