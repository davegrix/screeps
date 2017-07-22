/**
 * Created by dave on 06/07/17.
 */
let claim = {

  run: function () {


    let r = "W53N86";




  }
}


  function CreateCreep(CreepType) {

  switch(CreepType) {
    case BuildTypes.Builder:
      Game.spawns["Spawn1"].createCreep([
        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
        CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
        WORK, WORK, WORK, WORK, WORK, WORK, WORK,WORK,WORK, WORK], undefined, {role: r + "_builder"});
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
        WORK, WORK, WORK, WORK, WORK, WORK,WORK], undefined, {role: RoomData.roomName + "_upgrader"});
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
};

module.exports = claim;

//
