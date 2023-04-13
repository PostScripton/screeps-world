const game = require('game')
const Role = require('role')

class Harvester extends Role {
    static getRoleName() {
        return 'harvester'
    }
    
    static getBody(room) {
        let body = [WORK, CARRY, CARRY]
        
        if (room.controller.level >= 1) {
            body = this.getNewBody(body, [CARRY, MOVE], room)
        }
        
        return body
    }
    
    static getCountPerRoom(room) {
        switch (room.controller.level) {
            case 0:
            case 1:
                return 2
            case 2:
                return 4
        }
    }
    
    run() {
        try {
            super.run()
        } catch (e) {
            return
        }
        
        if (this.#shouldHarvest()) {
            this.harvestSources()
        } else {
            this.#storeSources()
        }
    }
    
    #shouldHarvest = (resource) => {
        return this.creep.store.getFreeCapacity(resource) > 0
    }
    
    harvestSources = () => {
        if (this.#pickingUpDrop()) {
            return
        }
        
        const closestSource = this.creep.pos.findClosestByRange(FIND_SOURCES, {
            filter: source => this.creep.moveTo(source) !== ERR_NO_PATH
        })
        console.log(`${closestSource.id} : ${this.creep.name}`)
        
        // решение 1
        // запомнить в memory выбранный closestSource и идти к нему ???
        // проблема может быть в том, что там одно только доступное место, а туда идут другие крипы
        
        // решение 2
        // считать свободные и заняты клетки вокруг источника
        // В глобальный memory закинуть id источника и крипов, которые его идут добывать
        
        // console.log('--------------------')
        // console.log(closestSource.id)
        // let closestSource = this.creep.pos.findClosestByRange(sources, {
        //     filter: (source) => this.creep.moveTo(source) !== ERR_NO_PATH
        // })
        let res = this.creep.moveTo(closestSource, { visualizePathStyle: { stroke: '#ffffff' } })
        if (this.creep.harvest(closestSource) === ERR_NOT_IN_RANGE) {
            console.log(res)
        }
    }
    
    #pickingUpDrop = () => {
        let drops = this.creep.room.find(FIND_DROPPED_RESOURCES, {
            filter: resource => resource.resourceType === RESOURCE_ENERGY
        })
        if (drops.length > 0) {
            let closestDrop = this.creep.pos.findClosestByRange(drops)
            if (this.creep.pickup(closestDrop) === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(closestDrop)
                return true
            }
        }
        return false
    }
    
    #storeSources = () => {
        let storages = game.getStoragesWithFreeCapacity(this.creep.room)
        
        for (const storage of storages) {
            if (this.creep.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                this.creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffffff' } })
            }
        }
    }
}

module.exports = Harvester