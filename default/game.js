const storagesToGet = [
    STRUCTURE_EXTENSION,
    STRUCTURE_SPAWN,
]

const storagesToPut = [
    RESOURCE_ENERGY,
    STRUCTURE_EXTENSION,
    STRUCTURE_SPAWN,
    STRUCTURE_TOWER,
]

const game = {
    
    getStoragesEnergy: function (room) {
        return room.find(FIND_STRUCTURES, {
            filter: (structure) => storagesToGet.includes(structure.structureType)
        })
    },
    
    getStoragesEnergyFilledAmount: function (room) {
        return this.getStoragesEnergy(room)
            .reduce((acc, cur) => acc + cur.store.getUsedCapacity(RESOURCE_ENERGY), 0)
    },
    
    getStoragesEnergyTotalAmount: function (room) {
        return this.getStoragesEnergy(room)
            .reduce((acc, cur) => acc + cur.store.getCapacity(RESOURCE_ENERGY), 0)
    },
    
    getStoragesWithFreeCapacity: function (room) {
        return room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                let neededStructure = storagesToPut.includes(structure.structureType)
                
                return neededStructure && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            }
        })
    },
    
}

module.exports = game