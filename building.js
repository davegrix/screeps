/**
 * Created by dave on 11/07/17.
 */



let BuildTypes = Object.freeze({

  Builder: Symbol("Builder"),
  Harvester: Symbol("Harvester"),
  Upgrader: Symbol("Upgrader"),
  Filler: Symbol("Filler"),
  StorageFiller: Symbol("StorageFiller"),
  Rebalancer: Symbol("Rebalancer")

});


function BuildCreep(CreepType, RoomData, HarvestPoint) {

  // Get Energy Available


  let targetRoomEnergy = Game.rooms["" + RoomData.roomName + ""].energyAvailable;
  let buildTypeEnergyRequired = GetEnergyRequired(CreepType);


  if (targetRoomEnergy >= buildTypeEnergyRequired) {
    CreateCreep(CreepType, RoomData, HarvestPoint);
  } else {

    if (RoomData.spawn === "Spawn3") {
      RoomData.spawn = "Spawn2";
      CreateCreep(CreepType, RoomData, HarvestPoint)
    } else if (RoomData.spawn === "Spawn2") {
      RoomData.spawn = "Spawn4";
      CreateCreep(CreepType, RoomData, HarvestPoint);
    } else if (RoomData.spawn === "Spawn1") {
      RoomData.spawn = "Spawn2";
      CreateCreep(CreepType, RoomData, HarvestPoint);
    }

  }

}


/**
 * @return {number}
 */
function GetEnergyRequired(CreepType) {

  switch (CreepType) {
    case BuildTypes.Builder:
      return 1100;
      break;
    case BuildTypes.Harvester:
      return 750;
      break;
    case BuildTypes.Upgrader:
      return 1750;
      break;
    case BuildTypes.Filler:
      return 900;
      break;
    case BuildTypes.StorageFiller:
      return 600;
      break;
    case BuildTypes.Rebalancer:
      return 1500;
      break;
  }
}


function CreateCreep(CreepType, RoomData, HarvestPoint) {

  switch (CreepType) {
    case BuildTypes.Builder:
      Game.spawns[RoomData.spawn].createCreep([
          MOVE,MOVE,MOVE,MOVE,MOVE,
          MOVE,
          WORK,WORK,WORK,WORK,WORK,
          CARRY,CARRY,CARRY,CARRY,CARRY,
          CARRY], undefined, {role: RoomData.roomName + "_builder"});
      break;

    case BuildTypes.Harvester:
      Game.spawns[RoomData.spawn].createCreep([
        MOVE, MOVE, MOVE,
        WORK, WORK, WORK, WORK, WORK], undefined, {role: HarvestPoint});
      // Game.spawns[RoomData.spawn].createCreep([
      //   MOVE,
      //   WORK, WORK], undefined, {role: HarvestPoint});
      break;

    case BuildTypes.Upgrader:
      Game.spawns[RoomData.spawn].createCreep([
          MOVE,MOVE,MOVE,MOVE,MOVE,
          MOVE,MOVE,MOVE,MOVE,
          WORK,WORK,WORK,WORK,WORK,
          WORK,WORK,WORK,
          CARRY,CARRY,CARRY,CARRY,CARRY,
          CARRY,CARRY,CARRY,CARRY,CARRY], undefined, {role: RoomData.roomName + "_upgrader"});
      break;

    case BuildTypes.Filler:
      Game.spawns[RoomData.spawn].createCreep([
            MOVE,MOVE,MOVE,MOVE,MOVE,
            MOVE,
            CARRY,CARRY,CARRY,CARRY,CARRY,
            CARRY,CARRY,CARRY,CARRY,CARRY,
            CARRY,CARRY],
          undefined,
          {role: RoomData.roomName + "_transfer"});

      // Game.spawns[RoomData.spawn].createCreep([
      //       MOVE,MOVE,
      //       CARRY,CARRY,CARRY],
      //     undefined,
      //     {role: RoomData.roomName + "_transfer"});
      break;

    case BuildTypes.StorageFiller:
      Game.spawns[RoomData.spawn].createCreep([
            MOVE,MOVE,MOVE,MOVE,
            CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
            CARRY,CARRY],
          undefined,
          {role: RoomData.roomName + "_store"});

      // Game.spawns[RoomData.spawn].createCreep([
      //       MOVE,MOVE,CARRY,
      //       CARRY,CARRY],
      //     undefined,
      //     {role: RoomData.roomName + "_store"});

      break;

    case BuildTypes.Rebalancer:
      Game.spawns[RoomData.spawn].createCreep([
          MOVE,MOVE,MOVE,MOVE,MOVE,
          MOVE,MOVE,MOVE,MOVE,MOVE,
          CARRY,CARRY,CARRY,CARRY,CARRY,
          CARRY,CARRY,CARRY,CARRY,CARRY,
          CARRY,CARRY,CARRY,CARRY,CARRY,
          CARRY,CARRY,CARRY,CARRY,CARRY],
          undefined,
          {role: RoomData.roomName + "_rebalancer"});
      break;
  }

}

module.exports = {
  CreateCreep: BuildCreep,
  BuildTypes: BuildTypes
}





