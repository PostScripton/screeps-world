const spawner = require('spawner')
const Harvester = require('role.harvester')
const Upgrader = require('role.upgrader')

module.exports.loop = function () {
    for (const roomName in Game.rooms) {
        let room = Game.rooms[roomName]
        room.memory.shouldSpawn = spawner.shouldSpawn(room, spawner.roles)
    }
    
    spawner.spawn('Spawn1', [
        Harvester,
        // Upgrader,
    ])
    
    for (const name in Game.creeps) {
        const creep = Game.creeps[name]
        
        for (const Role of spawner.roles) {
            if (Role.getRoleName() === creep.memory.role) {
                (new Role(creep)).run()
            }
        }
    }
    
    spawner.clearMemory()
}