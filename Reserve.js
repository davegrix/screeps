/**
 * Created by dave on 06/06/17.
 */

let reserve = {

  run: function () {
    let r = "W52N86";


    let ReserverCount = 1;
    let BuilderCount = 2;
    let BuilderLeftCount = 0;
    let TransferCount = 0;
    let TransferLeftCount = 0;
    let HarvesterCount = 0;
    let HarvesterLeftCount = 0;
    let RepairCount = 2;
    let Defender = 0;


    // Create Reserver at base

    if (_.filter(Game.creeps, (creep) => creep.memory.role === "reserve").length < ReserverCount) {
      Game.spawns.Spawn1.createCreep([MOVE, MOVE, CLAIM, CLAIM], undefined, {role: "reserve"});
    }


    let creeps = _.filter(Game.creeps, (creep) => creep.memory.role === "reserve");
    creeps.forEach(function (creep) {
      if (creep.room.name !== r) {
        creep.moveTo(Game.flags.bHarvest4);
      } else {

        if (creep.reserveController(Game.getObjectById("5873bc8211e3e4361b4d7b92")) === ERR_NOT_IN_RANGE) {
          creep.moveTo(Game.getObjectById("5873bc8211e3e4361b4d7b92"));
        }

      }
    });


    if (_.filter(Game.creeps, (creep) => creep.memory.role === "defend").length < Defender) {
      Game.spawns["Spawn1"].createCreep([
        MOVE, MOVE, MOVE,
        ATTACK, ATTACK, ATTACK,
        RANGED_ATTACK, RANGED_ATTACK], undefined, {role: "defend"});
    }


    creeps = _.filter(Game.creeps, (creep) => creep.memory.role === "defend");
    creeps.forEach(function (creep) {
      if (creep.room.name !== r) {
        creep.moveTo(Game.flags.b0);
      } else {
        let t = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        if (t) {
          if (creep.attack(t) === ERR_NOT_IN_RANGE) {
            creep.moveTo(t);
          }
        }
      }

    });


    //Harvest
    if (_.filter(Game.creeps, (creep) => creep.memory.role === "harvest").length < HarvesterCount) {
      Game.spawns["Spawn1"].createCreep([MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK], undefined, {role: "harvest"});
    }


    creeps = _.filter(Game.creeps, (creep) => creep.memory.role === "harvest");
    creeps.forEach(function (creep) {

      if (creep.ticksToLive < 250 && _.filter(Game.creeps, (creep) => creep.memory.role === "harvest").length < 2) {
        Game.spawns["Spawn1"].createCreep([MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK], undefined, {role: "harvest"});
      }

      if (creep.room.name !== r) {
        creep.moveTo(Game.flags.bHarvest5);
      } else {


        creep.moveTo(Game.flags.bHarvest5);
        if (Game.getObjectById("597117ebbb6e4550728dd548").store.energy < 2000) {
          creep.harvest(Game.getObjectById("5873bc8211e3e4361b4d7b91"));
        }

      }
    });


    //Harvest Left
    if (_.filter(Game.creeps, (creep) => creep.memory.role === "harvestleft").length < HarvesterLeftCount) {
      Game.spawns["Spawn3"].createCreep([MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK], undefined, {role: "harvestleft"});
    }


    creeps = _.filter(Game.creeps, (creep) => creep.memory.role === "harvestleft");
    creeps.forEach(function (creep) {

      if (creep.ticksToLive < 78 && _.filter(Game.creeps, (creep) => creep.memory.role === "harvestleft").length < 2) {
        Game.spawns["Spawn1"].createCreep([MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK], undefined, {role: "harvestleft"});
      }

      if (creep.room.name !== r) {
        creep.moveTo(Game.flags.bHarvest6);
      } else {


        creep.moveTo(Game.flags.bHarvest6);
        if (Game.getObjectById("5972e66d270e682d28c4bbba").store.energy < 2000) {
          creep.harvest(Game.getObjectById("5873bc8211e3e4361b4d7b90"));
        }

      }
    });


    //Repair
    if (_.filter(Game.creeps, (creep) => creep.memory.role === "repair").length < RepairCount) {
      Game.spawns["Spawn1"].createCreep([
        MOVE, MOVE, MOVE, MOVE, MOVE,
        MOVE,
        WORK, WORK, WORK, WORK,
        CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], undefined, {role: "repair"});
    }


    creeps = _.filter(Game.creeps, (creep) => creep.memory.role === "repair");
    creeps.forEach(function (creep) {

      if (creep.carry.energy === 0) {

        getenergy(creep);

      } else {
        if (creep.room.name !== r) {
          creep.moveTo(Game.flags.b0);
        } else {
          let toRepair = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: function (o) {
              return (o.structureType === STRUCTURE_CONTAINER ||
                  o.structureType === STRUCTURE_ROAD) && o.hits < o.hitsMax
                  ;
            }
          });

          creep.moveTo(toRepair);
          creep.repair(toRepair);
        }
      }

    });


    //Transfer
    if (_.filter(Game.creeps, (creep) => creep.memory.role === "carry").length < TransferCount) {
      Game.spawns["Spawn1"].createCreep([MOVE, MOVE, MOVE,
        CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], undefined, {role: "carry"});
    }


    creeps = _.filter(Game.creeps, (creep) => creep.memory.role === "carry");
    creeps.forEach(function (creep) {

      if (creep.carry.energy === 0) {

        if(creep.withdraw(Game.getObjectById("597117ebbb6e4550728dd548"), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(Game.getObjectById("597117ebbb6e4550728dd548"))
        }

      } else {

        creep.moveTo(Game.getObjectById("5956d51ac208c96e968bf8a6"));
        creep.transfer(Game.getObjectById("5956d51ac208c96e968bf8a6"), RESOURCE_ENERGY);

      }

    });


    //TransferLeft
    if (_.filter(Game.creeps, (creep) => creep.memory.role === "carry0").length < TransferLeftCount) {
      Game.spawns["Spawn1"].createCreep([MOVE, MOVE,
        CARRY, CARRY, CARRY, CARRY], undefined, {role: "carry0"});
    }


    creeps = _.filter(Game.creeps, (creep) => creep.memory.role === "carry0");
    creeps.forEach(function (creep) {

      if (creep.carry.energy === 0) {

        if (creep.withdraw(Game.getObjectById("5972e66d270e682d28c4bbba"), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(Game.getObjectById("5972e66d270e682d28c4bbba"));
        }

      } else {

        creep.moveTo(Game.getObjectById("5956d51ac208c96e968bf8a6"));
        creep.transfer(Game.getObjectById("5956d51ac208c96e968bf8a6"), RESOURCE_ENERGY);

      }

    });


    //BUILD
    if (_.filter(Game.creeps, (creep) => creep.memory.role === "build00").length < BuilderCount) {
      Game.spawns["Spawn1"].createCreep([
        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
        CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
        WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK], undefined, {role: "build00"});
    }


    creeps = _.filter(Game.creeps, (creep) => creep.memory.role === "build00");
    creeps.forEach(function (creep) {

      let bt = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

      if (bt === null) {

        if (creep.carry.energy > 0) {
          if (creep.transfer(Game.getObjectById("5964264943d0e249138f6006")) === ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.getObjectById("5964264943d0e249138f6006"))
          }
        }

      } else {


        if (creep.room.name !== r) {
          creep.moveTo(Game.flags["b0"]);
        }
        else if (creep.carry.energy === 0) {
          getenergy(creep);
        }

        else {
          const c = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

          if (creep.build(c) === ERR_NOT_IN_RANGE) {
            creep.moveTo(c)
          }
        }
      }

    });


    if (_.filter(Game.creeps, (creep) => creep.memory.role === "build01").length < BuilderLeftCount) {
      Game.spawns["Spawn3"].createCreep([
        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
        CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
        WORK, WORK, WORK, WORK, WORK], undefined, {role: "build01"});
    }


    creeps = _.filter(Game.creeps, (creep) => creep.memory.role === "build01");
    creeps.forEach(function (creep) {


      if (creep.carry.energy === 0) {

        if (creep.withdraw(Game.getObjectById("5972e66d270e682d28c4bbba"), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {

          creep.moveTo(Game.getObjectById("5972e66d270e682d28c4bbba"));
        }

      } else {

        if (creep.room.name !== r) {
          creep.moveTo(Game.flags.b1);
        } else {
          const c = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

          if (creep.build(c) === ERR_NOT_IN_RANGE) {
            creep.moveTo(c);
          }
        }


      }

    });
  }
};

function getenergy(creep) {



  if(creep.roomName !== "W52N86") {
    creep.moveTo(Game.flags.b0)
  }

  let de = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);

  if (de) {
    if (creep.pickup(de) === ERR_NOT_IN_RANGE) {
      creep.moveTo(de);
    }
  } else {

    let closest = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: function (o) {
        return (o.structureType === STRUCTURE_CONTAINER &&
            o.store.energy > 200)
      }
    });

    if (creep.withdraw(closest, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(closest)
    }
  }
}

module.exports = reserve;

