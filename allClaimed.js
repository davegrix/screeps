/**
 * Created by dave on 30/06/17.
 */

let bFunction = require("building");

let thisroom = {


    run: function () {

        let claimedRooms = [];


        let W52N87 = {};

        W52N87.room = Game.rooms['W52N87'];
        W52N87.roomName = 'W52N87';
        W52N87.spawn = "Spawn1";
        W52N87.harvestPoints = ['bHarvest', 'bHarvest0'];
        W52N87.storage = Game.getObjectById("593b960c474c493897c3a826");
        W52N87.containers = [Game.getObjectById('59471083bca05f2031c849d9'), Game.getObjectById('5946f8390313cc951f6ad059')];
        W52N87.controller = Game.getObjectById('5873bc8211e3e4361b4d7b8d');
        W52N87.links = [Game.getObjectById('5956da3f7a98ff60f40ab318'), Game.getObjectById('594dbf95e1d94ecc43fa306b'), Game.getObjectById('5956d51ac208c96e968bf8a6')];


        let W53N87 = {};

        W53N87.room = Game.rooms['W53N87'];
        W53N87.roomName = 'W53N87';
        W53N87.spawn = "Spawn2";
        W53N87.harvestPoints = ['bHarvest1'];
        W53N87.storage = Game.getObjectById("593c0eff927d9f502b892313");
        W53N87.containers = [Game.getObjectById('595e951dc45eae7d953a0f6d')];
        W53N87.controller = Game.getObjectById('5873bc7f11e3e4361b4d7b4c');
        W53N87.terminal = Game.getObjectById('5961037af59ec97dd59c0b8f');


        let W53N86 = {};

        W53N86.room = Game.rooms['W53N86'];
        W53N86.roomName = 'W53N86';
        W53N86.spawn = "Spawn3";
        W53N86.storage = Game.getObjectById("5964264943d0e249138f6006");
        W53N86.harvestPoints = ['bHarvest3'];
        W53N86.containers = [Game.getObjectById('595ef70451a18078bf994b3e')];
        W53N86.controller = Game.getObjectById('5873bc7f11e3e4361b4d7b50');
        W53N86.terminal = Game.getObjectById('5961037af59ec97dd59c0b8f');


        claimedRooms.push(W52N87);
        claimedRooms.push(W53N86);
        claimedRooms.push(W53N87);


        claimedRooms.forEach(function (rData) {

            BuildCreeps(rData);

            Harvest(rData);
            UpgradeController(rData);
            BuildStructures(rData);
            RepairWithTowers(rData);
            Refill(rData);
            RefillStorage(rData);
            //;

            if (rData.roomName === "W52N87") {
                emptySecondContainer(rData);
                sendEnergy(rData);
              transferEnergy(rData)
            } else {
               // receiveEnergy(rData);
            }


        });
    }

};

module.exports = thisroom;

function BuildCreeps(tData) {


    tData.harvestPoints.forEach(function (mh) {
        if (_.filter(Game.creeps, (creep) => creep.memory.role === mh).length < 1) {
            bFunction.CreateCreep(bFunction.BuildTypes.Harvester, tData, mh);
        }
    });


    if (_.filter(Game.creeps, (creep) => creep.memory.role === tData.roomName + "_upgrader").length < 2) {
        bFunction.CreateCreep(bFunction.BuildTypes.Upgrader, tData);
    }

    if (tData.room !== undefined) {
        let targets = tData.room.find(FIND_CONSTRUCTION_SITES);

        if (_.filter(Game.creeps, (creep) => creep.memory.role === tData.roomName + "_builder").length < 1 && targets.length > 0) {
            bFunction.CreateCreep(bFunction.BuildTypes.Builder, tData);
        }
    }

    let extensions = tData.room.find(FIND_MY_STRUCTURES, {
        filter: (s) => s.structureType === STRUCTURE_EXTENSION
        && s.energy < s.energyCapacity
    });

    if (_.filter(Game.creeps, (creep) => creep.memory.role === tData.roomName + "_transfer").length < 1 && extensions.length > 0) {
        bFunction.CreateCreep(bFunction.BuildTypes.Filler, tData);
    }

    let storage = tData.room.find(FIND_MY_STRUCTURES, {
        filter: (s) => s.structureType === STRUCTURE_STORAGE
    });

    if (_.filter(Game.creeps, (creep) => creep.memory.role === tData.roomName + "_store").length < 1 && storage.length > 0) {
        bFunction.CreateCreep(bFunction.BuildTypes.StorageFiller, tData)
    }


}


function Harvest(tData) {
    tData.harvestPoints.forEach(function (f) {
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role === f);
        creeps.forEach(function (creep) {
            creep.moveTo(Game.flags[f]);
            let t = creep.pos.findClosestByPath(FIND_SOURCES);
            let containers = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_CONTAINER});
            if (containers !== null) {
                if (containers.store.energy < 2000) {
                    creep.harvest(t);
                }
            }
        });
    })


}
function UpgradeController(tData) {
    let Upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === tData.roomName + "_upgrader");

    Upgraders.forEach(function (u) {

        if (u.carry.energy === 0) {
            getEnergy(u, tData)
        } else {

            if (u.upgradeController(tData.controller) === ERR_NOT_IN_RANGE) {
                u.moveTo(tData.controller);
            }
        }
    })
}
function BuildStructures(tData) {

    let Builders = _.filter(Game.creeps, (creep) => creep.memory.role === tData.roomName + "_builder");
    Builders.forEach(function (b) {

        if (b.carry.energy === 0) {
            getEnergy(b, tData)
        } else {

            let targets;


            targets = b.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);


            if (b.build(targets) === ERR_NOT_IN_RANGE) {
                b.moveTo(targets);
            }
        }
    })
}
function RepairWithTowers(tData) {
    let Towers = tData.room.find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_TOWER});
    Towers.forEach(function (t) {
        let hostiles = tData.room.find(FIND_HOSTILE_CREEPS);
        if (hostiles.length > 0) {
            t.attack(hostiles[0]);
        } else {
            let toRepair = tData.room.find(FIND_STRUCTURES, {
                filter: function (o) {
                    return (o.structureType === STRUCTURE_CONTAINER ||
                        o.structureType === STRUCTURE_ROAD) && o.hits < o.hitsMax
                }
            });

            if (toRepair.length > 0) {
                t.repair(toRepair[0]);

            } else {
                toRepair = tData.room.find(FIND_STRUCTURES, {

                    filter: function (o) {
                        return o.structureType === STRUCTURE_RAMPART
                            || o.structureType === STRUCTURE_WALL
                            && o.hits < 310000
                    }
                });

                if (toRepair.length > 0) {
                    t.repair(toRepair[0]);
                }
            }
        }
    });

}
function Refill(tData) {


    creeps = _.filter(Game.creeps, (creep) => creep.memory.role === tData.roomName + "_transfer");
    creeps.forEach(function (creep) {


        let r = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);

        if (r) {

            if (creep.pickup(RESOURCE_ENERGY, r) === ERR_NOT_IN_RANGE) {
                creep.moveTo(r)
            }

        }


        let etargets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) =>
                (
                    (s.structureType === STRUCTURE_EXTENSION && s.energy < s.energyCapacity) || (s.structureType === STRUCTURE_SPAWN && s.energy < 300 || s.structureType === STRUCTURE_TOWER && s.energy < 500)
                )
        });


        if (etargets) {


            if (creep.carry.energy === 0) {


                getEnergy(creep, tData)
            } else {

                if (creep.transfer(etargets, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(etargets, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    });
}
function RefillStorage(tData) {
    creeps = _.filter(Game.creeps, (creep) => creep.memory.role === tData.roomName + "_store");
    creeps.forEach(function (creep) {


        if (creep.carry.energy === 0 && creep.ticksToLive < 50) {
            creep.suicide();
        }

        if (creep.carry.energy === 0) {


            let d = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
            if (d) {

                if (creep.pickup(d) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(d)
                }
            } else {

                if(tData.containers.length === 1) {

                  if (creep.withdraw(tData.containers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(tData.containers[0]);
                  }

                }
                else {
                  let c = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_CONTAINER && s.store.energy > 99});
                  if (creep.withdraw(c, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(c);
                  }
                }
            }

        } else {
            let Store = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_STORAGE});
            if (creep.transfer(Store, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(Store, {visualizePathStyle: {stroke: '#000fff'}});
            }
        }
    });
}

function transferEnergy(tData) {


        if (tData.links[2].energy > 500 && tData.links[0].energy < 800) {
            tData.links[2].transferEnergy(tData.links[0]);
        }

      // if (tData.links[1].energy > 700 && tData.links[2].energy < 800) {
      //   tData.links[1].transferEnergy(tData.links[2]);
      // }



}


function emptySecondContainer(tData) {

    creeps = _.filter(Game.creeps, (creep) => creep.memory.role === tData.roomName + "_extra");
    if (creeps.length < 2) {
        Game.spawns[tData.spawn].createCreep([
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,MOVE,MOVE,
                CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,CARRY, CARRY
            ],
            undefined,
            {role: tData.roomName + "_extra"});

    } else {

        creeps.forEach(function (c) {

                if (c.carry.energy === 0) {

                  if(Game.getObjectById("5956da3f7a98ff60f40ab318").energy > 0) {
                    if (c.withdraw(Game.getObjectById("5956da3f7a98ff60f40ab318"), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                      c.moveTo(Game.getObjectById("5956da3f7a98ff60f40ab318"))
                    }
                  } else {
                    if (c.withdraw(Game.getObjectById("5946f8390313cc951f6ad059"), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                      c.moveTo(25, 28)
                    }
                  }

                } else {


                  if(c.transfer(Game.getObjectById("593b960c474c493897c3a826"), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
                    c.moveTo(Game.getObjectById("593b960c474c493897c3a826"))
                  }


                    // if(Game.getObjectById("593b960c474c493897c3a826").store.energy < 250000) {
                    //   if (c.transfer(Game.getObjectById("593b960c474c493897c3a826"), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    //     c.moveTo(Game.getObjectById("593b960c474c493897c3a826"));
                    //   }
                    // } else {
                    //
                    //   if (c.transfer(Game.getObjectById("5944234d56079edd10289ac8"), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    //     c.moveTo(Game.getObjectById("5944234d56079edd10289ac8"));
                    //   }
                    // }
                }


        });
    }
}

function sendEnergy() {


    let terminals = {};

    terminals.W52N87 = Game.getObjectById("5944234d56079edd10289ac8");
    terminals.W53N87 = Game.getObjectById("5961037af59ec97dd59c0b8f");


    if (terminals.W52N87.store.energy > 1000) {

        Game.rooms['W52N87'].terminal.send(RESOURCE_ENERGY, 1000, 'W53N87')
    }

    // if(Game.getObjectById("594dbf95e1d94ecc43fa306b").energy > 0 &&
    //     Game.getObjectById("5956d51ac208c96e968bf8a6").energy < 780) {
    //
    //   console.log(Game.getObjectById("594dbf95e1d94ecc43fa306b").transferEnergy(Game.getObjectById("5956d51ac208c96e968bf8a6"), RESOURCE_ENERGY))

}

function receiveEnergy(tData) {

    creeps = _.filter(Game.creeps, (creep) => creep.memory.role === tData.roomName + "_dofill");
    if (creeps.length === 0) {
        Game.spawns[tData.spawn].createCreep([
                MOVE, MOVE, MOVE, MOVE, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                CARRY, CARRY, CARRY, CARRY, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY
            ],
            undefined,
            {role: tData.roomName + "_dofill"});
    } else {

        creeps.forEach(function (c) {


              removeFromTerminal(c, tData)

        })
    }

}


function removeFromTerminal(creep, tData) {




    if (creep.carry.energy === 0 && tData.storage.store.energy < 100000) {
        if (creep.withdraw(tData.terminal, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(tData.terminal);
        }

    } else {
        if (creep.transfer(tData.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(tData.storage);
        }

    }

}


function getEnergy(creep, tData) {




    if(creep.carry > 0) {
        if(creep.transfer(Game.getObjectById("5944234d56079edd10289ac8"), RESOURCE_GHODIUM_OXIDE) === ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.getObjectById("5944234d56079edd10289ac8"))
        }


    }


    let de = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);

    if(de) {
      if(creep.pickup(de) === ERR_NOT_IN_RANGE) {
        creep.moveTo(de);
      }
    }

    else if (tData.storage !== undefined) {

        if (creep.withdraw(tData.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(tData.storage);
        }

    } else {

        if (tData.containers[0].store.energy > 100) {

            if (creep.withdraw(tData.containers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(tData.containers[0]);
            }

        }
        else {
            creep.moveTo(Game.flags.wait);
        }
    }
}
function transferToStore(creep, tData) {

    if (creep.transfer(tData.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(tData.storage);
    }

}