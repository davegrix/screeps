let reserve = require("Reserve");
let claim = require("claim");
let c = require('allClaimed');

module.exports.loop = function () {


  let rooms = [];
  rooms.push(Game.rooms['W52N87']);
  rooms.push(Game.rooms['W53N87']);
  rooms.push(Game.rooms['W53N86']);

  rooms.forEach(function (room) {
    let per = room.controller.progress / room.controller.progressTotal * 100;
    console.log("room " + room.name +
        " energy=" + room.energyAvailable + "  @  " +
        room.controller.progress + '/' +
        room.controller.progressTotal +
        ' ' + per.toFixed(2) + '%');

  });


  c.run();

  reserve.run();



  for (let name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log('Clearing non-existing creep memory:', name);
    }
  }


  let spawningCreep;
  if (Game.spawns['Spawn1'].spawning) {
    spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
    Game.spawns['Spawn1'].room.visual.text(
        '🛠️' + spawningCreep.memory.role,
        Game.spawns['Spawn1'].pos.x + 1,
        Game.spawns['Spawn1'].pos.y,
        {align: 'left', opacity: 0.8});
  }

  if (Game.spawns['Spawn2'].spawning) {
    spawningCreep = Game.creeps[Game.spawns['Spawn2'].spawning.name];
    Game.spawns['Spawn2'].room.visual.text(
        '🛠️' + spawningCreep.memory.role,
        Game.spawns['Spawn2'].pos.x + 1,
        Game.spawns['Spawn2'].pos.y,
        {align: 'left', opacity: 0.8});
  }

  if (Game.spawns['Spawn3'].spawning) {
    spawningCreep = Game.creeps[Game.spawns['Spawn3'].spawning.name];
    Game.spawns['Spawn3'].room.visual.text(
        '🛠️' + spawningCreep.memory.role,
        Game.spawns['Spawn3'].pos.x + 1,
        Game.spawns['Spawn3'].pos.y,
        {align: 'left', opacity: 0.8});
  }

}