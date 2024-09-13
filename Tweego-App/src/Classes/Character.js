const fs = require('fs');
const path = require('path');
const MainEvent = require('./MainEvent');
const RoutineEvent = require('./RoutineEvent');

class Character {
    constructor(macroLocation,path) {
        this.macroLocation = macroLocation;
        this.path = path;
        //check if init-char.twee file exists
        if (!fs.existsSync(path + '/init-char.twee')) {
            console.warn(`Character: init-char.twee file does not exist in ${path}`);
            return; 
        }

        // init from init-char.twee file
        let initCharFile = fs.readFileSync(path + '/init-char.twee', 'utf8');
        this.parseInitChar(initCharFile);


    }
    
    parseInitChar(initCharFile) {
        //print 
        console.log(initCharFile);

        // Extract the passage name (first line starting with "::")
        const passageMatch = initCharFile.match(/^::\s*([^\n]+)/);

        // Extract the character infos from <<set $characters...>>
        const regex = /<<init_character\s+"([^"]+)"\s+"([^"]+)"\s+"([^"]+)"\s+"([^"]+)"\s+"([^"]+)"\s+"([^"]+)"\s+"([^"]+)">>/;

        const matches = initCharFile.match(regex);

        if (matches) {
            this.characterId = matches[1];
            this.characterDisplayName = matches[2];
            this.characterJobDescription = matches[3];
            this.characterMacroLocationDisplay = matches[4];
            this.characterImageCharList = matches[5];
            this.characterDialoguesImage = matches[6];
            this.characterChoiceImage = matches[7];
        }
        
        // init main events from Events folder
        const eventsPath = this.path + '/Events';
        console.log(eventsPath);
        this.events = this.initEvents(eventsPath);

        //init routine from files in Routine folder
        const routinePath = this.path + '/Routine';
        this.routine = this.initRoutine(routinePath);

        //init socials (Instagram, Snapchat, Gallery) from Social Folder
        const socialsPath = this.path + '/Socials';
        this.socials = this.initSocials(socialsPath);
    }

    initEvents(eventsPath) {
        let events = {};
        //check if events folder exists
        if (!fs.existsSync(eventsPath)) {
            console.warn(`Events: Events folder does not exist in ${eventsPath}`);
            return "Events folder does not exist";
        }
        let eventFiles = fs.readdirSync(eventsPath);

        eventFiles.forEach(eventFile => {
            let eventFilePath = path.join(eventsPath, eventFile);
            let eventFileContent = fs.readFileSync(eventFilePath, 'utf8');
            console.log("eventFileContent", eventFileContent);
            let event = new MainEvent(eventFileContent);
            events[event.initPassageName] = event;
        });

        return events;
    }

    initRoutine(routinePath) {
        //init routine events
        let routineEvents = {};
        //get all the events folders in the routine folder
        //check if exists
        if (!fs.existsSync(routinePath)) {
            console.warn(`Routine: Routine folder does not exist in ${routinePath}`);
            return "Routine folder does not exist";
        }
        //check if routine events folder exists
        if (!fs.existsSync(routinePath+'/RoutineEvents')) {
            console.warn(`Routine: RoutineEvents folder does not exist in ${routinePath}`);
            return "RoutineEvents folder does not exist";
        }
        let RoutineEventsFolders = fs.readdirSync(routinePath+'/RoutineEvents');

        RoutineEventsFolders.forEach(routineEventFolder => {
            let routineEventPath = path.join(routinePath+'/RoutineEvents', routineEventFolder);
            let routineEvent = new RoutineEvent(routineEventPath);
            routineEvents[routineEventFolder] = routineEvent;
        });

        return routineEvents;
    }

    initSocials(socialsPath) {
        let socials = {};
        //check if socials folder exists
        if (!fs.existsSync(socialsPath)) {
            console.warn(`Socials: Socials folder does not exist in ${socialsPath}`);
            return "Socials folder does not exist";
        }
        let socialDirs = fs.readdirSync(socialsPath);

        socialDirs.forEach(socialDir => {
            let socialPath = path.join(socialsPath, socialDir) + '/main.twee';
            let socialFile = fs.readFileSync(socialPath, 'utf8');

            // Extract the JSON-like portion from the input string
            let jsonString = socialFile.match(/<<set _instagram to(.*?)>>/s)

            //check if match is found
            if (!jsonString) return;
            
            jsonString = jsonString[1].trim();

            // Now parse the string into an object
            const jsonData = JSON.parse(jsonString);

            console.log(jsonData);

            socials[socialDir] = jsonData;
        });
        return socials;
    }

}

// const char = new Character('ArtGallery',
//     '/Users/edoardo/vs_code_projects/electron_app/assets/Tweego Game Backup/project/twee/2.Characters/ArtGallery/Curator-Sofia_De_Luca');

// console.log(char);

// //write to json file
// fs.writeFileSync('char.json', JSON.stringify(char, null, 2));


function initAllCharacters(charactersPath) {
    let characters = {};
    let macroLocations = fs.readdirSync(charactersPath);

    macroLocations.forEach(macroLocation => {
        let macroLocationPath = path.join(charactersPath, macroLocation);
        let characterDirs = fs.readdirSync(macroLocationPath);

        characterDirs.forEach(characterDir => {
            //ingore .DS_Store files
            if (characterDir === '.DS_Store') return;
            let characterPath = path.join(macroLocationPath, characterDir);
            let character = new Character(macroLocation, characterPath);
            characters[character.characterId] = character;
        });
    });

    return characters;
}

let characters = initAllCharacters('/Users/edoardo/vs_code_projects/electron_app/assets/Tweego Game Backup/project/twee/2.Characters');

//write json
fs.writeFileSync('characters.json', JSON.stringify(characters, null, 2));

module.exports = {Character, initAllCharacters};