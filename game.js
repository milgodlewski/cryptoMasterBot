const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const locations = {
  'motel': {
    name: 'Cheap Motel Room',
    description: 'A small, dimly lit room with worn-out furniture.',
    exits: ['park']
  },
  'park': {
    name: 'Nearby Park',
    description: 'A peaceful park with green grass and towering trees.',
    exits: ['motel', 'cafe']
  },
  'cafe': {
    name: 'Local Café',
    description: 'A cozy café with the smell of fresh coffee in the air.',
    exits: ['park']
  }
};

let currentLocation = 'motel';

function displayLocation(location) {
  console.log(`\n${locations[location].name}`);
  console.log(locations[location].description);
  console.log(`Exits: ${locations[location].exits.join(', ')}`);
}

function processCommand(command) {
  if (command === 'quit') {
    rl.close();
  } else if (locations[currentLocation].exits.includes(command)) {
    currentLocation = command;
    displayLocation(currentLocation);
  } else {
    console.log('Invalid command. Type the name of an exit to move, or type "quit" to exit the game.');
  }
}

console.log('Welcome to the Text-based Sandbox Adventure Game!');
displayLocation(currentLocation);

rl.on('line', (input) => {
  processCommand(input.trim());
}).on('close', () => {
  console.log('Thanks for playing! Goodbye!');
  process.exit(0);
});
