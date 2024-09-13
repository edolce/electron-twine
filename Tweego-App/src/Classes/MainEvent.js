const PassageEvent = require('./PassageEvent');

class MainEvent {
    constructor(passageString) {
        //title, description, scene, handler, time, icon, priority, status, isActive

        const regex = /::\s*([^\s\[]+)\s*(\[[^\]]+\])?\s*<<main_char_event_init\s+"([^"]+)"\s+"([^"]+)"\s+"([^"]+)"\s+"([^"]+)"\s+"([^"]+)"\s+"([^"]+)"\s+(\d+)\s+(?:"([^"]+)"|undefined)\s+(true|false)\s*>>\s*::\s*([^\s\[]+)\s*([\s\S]+?)(?=::|$)/;

        const matches = passageString.match(regex);

        if (matches) {
            // const [
            //     fullMatch,
            //     initPassageName,
            //     initTag,
            //     title,
            //     description,
            //     scene,
            //     handler,
            //     time,
            //     icon,
            //     priority,
            //     status,
            //     isActive,
            //     nextPassageName,
            //     nextPassageContent
            // ] = matches;
            this.initPassageName = matches[1];
            this.title = matches[3];
            this.description = matches[4];
            this.scene = matches[5];
            this.handler = matches[6];
            this.time = matches[7];
            this.icon = matches[8];
            this.priority = matches[9];
            this.status = matches[10];
            this.isActive = matches[11];
            this.eventPassageName = matches[12];
            this.eventPassage = (new PassageEvent(":: "+matches[12]+"\n"+matches[13])).toDict();
        }


    }
}

const Events_dir_path =  "/Users/edoardo/vs_code_projects/electron_app/assets/Tweego Game Backup/project/twee/2.Characters/ArtGallery/Curator-Sofia_De_Luca/Events"

const fs = require('fs');

const eventFileContent = fs.readFileSync(Events_dir_path+"/scene_1.twee", 'utf8');

const event = new MainEvent(eventFileContent);

console.log(event);

module.exports = MainEvent;