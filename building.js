/**
 * Created by dave on 11/07/17.
 */



let BuildTypes = Object.freeze({

    Builder: Symbol("Builder"),
    Harvester: Symbol("Harvester"),
    Upgrader: Symbol("Upgrader"),
    Filler: Symbol("Filler"),
    StorageFiller: Symbol("StorageFiller")

});






function BuildCreep(CreepType, RoomData, HarvestPoint ) {

    // Get Energy Available


    let targetRoomEnergy = Game.rooms["" + RoomData.roomName + ""].energyAvailable;
    let buildTypeEnergyRequired = GetEnergyRequired(CreepType);


    if(targetRoomEnergy >= buildTypeEnergyRequired) {
        CreateCreep(CreepType,RoomData, HarvestPoint);
    } else {

        if(RoomData.spawn === "Spawn3") {
            RoomData.spawn = "Spawn2";
            CreateCreep(CreepType,RoomData,HarvestPoint)
        } else if(RoomData.spawn === "Spawn2") {
            RoomData.spawn = "Spawn1";
            CreateCreep(CreepType,RoomData,HarvestPoint);
        } else if(RoomData.spawn === "Spawn1") {
            RoomData.spawn = "Spawn2";
            CreateCreep(CreepType,RoomData,HarvestPoint);
        }

    }

}


/**
 * @return {number}
 */
function GetEnergyRequired(CreepType) {

    switch (CreepType) {
        case BuildTypes.Builder:
            return 1300;
            break;
        case BuildTypes.Harvester:
            return 750;
            break;
        case BuildTypes.Upgrader:
            return 1700;
            break;
        case BuildTypes.Filler:
            return 800;
            break;
        case BuildTypes.StorageFiller:
            return 800;
            break;
    }
}


function CreateCreep(CreepType, RoomData, HarvestPoint) {

    switch(CreepType) {
        case BuildTypes.Builder:
            Game.spawns[RoomData.spawn].createCreep([
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                WORK, WORK, WORK, WORK, WORK], undefined, {role: RoomData.roomName + "_builder"});
            break;

        case BuildTypes.Harvester:
            Game.spawns[RoomData.spawn].createCreep([
                MOVE, MOVE, MOVE, MOVE, MOVE,
                WORK, WORK, WORK, WORK, WORK], undefined, {role: HarvestPoint});
            break;

        case BuildTypes.Upgrader:
            Game.spawns[RoomData.spawn].createCreep([
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                WORK, WORK, WORK, WORK, WORK, WORK,WORK,WORK,WORK], undefined, {role: RoomData.roomName + "_upgrader"});
            break;

        case BuildTypes.Filler:
            Game.spawns[RoomData.spawn].createCreep([
                    CARRY, CARRY, CARRY,CARRY,CARRY, CARRY,CARRY,CARRY,CARRY,
                    MOVE, MOVE, MOVE,MOVE,MOVE,MOVE,MOVE],
                undefined,
                {role: RoomData.roomName + "_transfer"});
            break;

        case BuildTypes.StorageFiller:
            Game.spawns[RoomData.spawn].createCreep([
                    CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                undefined,
                {role: RoomData.roomName + "_store"});
            break;
    }

}

module.exports = {
    CreateCreep : BuildCreep,
    BuildTypes: BuildTypes
}





