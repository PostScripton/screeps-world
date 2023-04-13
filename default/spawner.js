const Harvester = require('role.harvester')
const Upgrader = require('role.upgrader')

const allRoles = [
    Harvester,
    Upgrader,
];

const spawner = {
    roles: allRoles,
    
    spawn: function (spawnerName, roles) {
        const spawner = Game.spawns[spawnerName]
        
        for (const Role of sortRoles(roles)) {
            let roleCreeps = Role.getCreeps()
            
            if (roleCreeps.length < Role.getCountPerRoom(spawner.room) && !spawner.spawning) {
                Role.create(spawner)
                break;
            }
        }
        
        if (spawner.spawning) {
            let spawningCreep = Game.creeps[spawner.spawning.name]
            spawner.room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                spawner.pos.x + 1,
                spawner.pos.y,
                { align: 'left', opacity: 0.8 }
            )
        }
    },
    
    shouldSpawn: function (room, roles) {
        return roles.some(role => role.getCreeps().length < role.getCountPerRoom(room))
    },
    
    clearMemory: function () {
        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name]
                console.log('Clearing non-existing creep memory:', name)
            }
        }
    }
}

function sortRoles(roles) {
    const spawnPriorities = {
        harvester: 1,
        upgrader: 2,
    }
    
    return roles.sort(function (a, b) {
        let priorityA = spawnPriorities[a.getRoleName()]
        let priorityB = spawnPriorities[b.getRoleName()]
        
        if (priorityA === priorityB) {
            return 0;
        }
        return priorityA > priorityB ? 1 : -1;
    })
}

module.exports = spawner