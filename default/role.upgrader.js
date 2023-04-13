const game = require('game')
const Harvester = require('role.harvester')

class Upgrader extends Harvester {
    static getRoleName() {
        return 'upgrader'
    }
    
    static getBody(room) {
        let body = [WORK, CARRY, CARRY, MOVE, MOVE]
        
        if (room.controller.level >= 2) {
            body = this.getNewBody(body, [WORK, MOVE], room)
        }
        
        return body
    }
    
    static getCountPerRoom(room) {
        switch (room.controller.level) {
            case 0:
            case 1:
            case 2:
                return 2
        }
    }
    
    run() {
        if (this.creep.memory.upgrading && this.creep.store[RESOURCE_ENERGY] === 0) {
            this.creep.memory.upgrading = false
        }
        if (!this.creep.memory.upgrading && this.creep.store.getFreeCapacity() === 0) {
            this.creep.memory.upgrading = true
        }
        
        if (this.creep.memory.upgrading) {
            this.#upgradeRoomController()
        } else {
            if (this.creep.room.memory.shouldSpawn) {
                this.harvestSources()
            } else {
                this.#takeEnergyFromStorages()
            }
        }
    }
    
    #upgradeRoomController = () => {
        if (this.creep.upgradeController(this.creep.room.controller) === ERR_NOT_IN_RANGE) {
            this.creep.moveTo(this.creep.room.controller)
        }
    }
    
    #takeEnergyFromStorages = () => {
        const storages = game.getStoragesEnergy(this.creep.room)
        const closestStorage = this.creep.pos.findClosestByRange(storages)
        if (this.creep.withdraw(closestStorage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            this.creep.moveTo(closestStorage)
        }
    }
}

module.exports = Upgrader