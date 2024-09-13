const fs = require('fs');
const path = require('path');
const PassageEvent = require('./PassageEvent');

class RoutineEvent{
    constructor(path) {
        this.path = path;
        //Check if main.twee file exists
        if (!fs.existsSync(path + '/main.twee')) {
            //Warning if main.twee file does not exist
            console.warn(`RoutineEvent: main.twee file does not exist in ${path}`);
            return;
        }
        //get main.twee file inside
        let mainFile = fs.readFileSync(path + '/main.twee', 'utf8');

        //get passage name :: passage_name of the main file
        const passageMatch = mainFile.match(/^::\s*([^\n]+)/);
        this.mainPassage = passageMatch[1];

        //get all other files inside (even if they are in subfolders)
        let files = this.getFiles(path);
        this.files = files;

        //parse all files and get all passages from them
        this.parseFiles(files);


        //create a tree structure of the passages
        this.tree = this.buildTree(this.mainPassage);

        //go search in ../Schedule to see where the routine is scheduled example: ../Schedule/0.Monday/0.morning.twee contains the passage name of the routine so we add to dict 
        this.schedule = this.initSchedule(path + '/../../Schedule');
    }

    getFiles(dir, files_) {
        files_ = files_ || [];
        var files = fs.readdirSync(dir);
        for (var i in files) {
            var name = dir + '/' + files[i];
            if (fs.statSync(name).isDirectory()) {
                this.getFiles(name, files_);
            } else {
                files_.push(name);
            }
        }
        return files_;
    }
        

    parseFiles(files) {
        let passages = {};
        files.forEach(file => {
            let fileContent = fs.readFileSync(file, 'utf8');

            //split filecontent by passages
            const regex = /(:: [^\n]+[\s\S]*?)(?=(:: [^\n]+|$))/g;
            let matches = fileContent.match(regex);
            matches.forEach(match => {
                let passageEvent = new PassageEvent(match); 
                passages[passageEvent.passageName] = passageEvent;
            });
        });
        this.passages = passages;
    }

    buildTree(passageName, visited = new Set()) {
        const passage = this.passages[passageName];
    
        if (!passage || visited.has(passageName)) return null;
    
        // Mark this passage as visited
        visited.add(passageName);
    
        // Recursively build children
        const children = (passage.choiceStream || []).map(choice => this.buildTree(choice.target, visited));
    
        return {
            passageName: passage.passageName,
            dialogues: passage.dialogues,
            choices: passage.choiceStream,
            children: children.filter(child => child !== null)
        };
    }

    initSchedule(schedulePath) {
        let schedule = {};
        let weekDays = fs.readdirSync(schedulePath);

        weekDays.forEach(weekDay => {
            let weekDayPath = path.join(schedulePath, weekDay);
            let dayParts = fs.readdirSync(weekDayPath);

            dayParts.forEach(dayPart => {
                let dayPartPath = path.join(weekDayPath, dayPart);
                let dayPartFile = fs.readFileSync(dayPartPath, 'utf8');
                
                //check if contains the passage name
                if(dayPartFile.includes(this.mainPassage)){
                    let passageName = this.mainPassage;
                    let weekDay_ = weekDay.split('.')[1];
                    let dayPart_ = dayPart.split('.')[1];
                    schedule[weekDay_] = schedule[weekDay_] || {};
                    schedule[weekDay_][dayPart_] = passageName;
                }
            });
        });

        return schedule;
    }
    
}

let routineEvent = new RoutineEvent('/Users/edoardo/vs_code_projects/electron_app/assets/Tweego Game Backup/project/twee/2.Characters/ArtGallery/Curator-Sofia_De_Luca/Routine/RoutineEvents/-0.Beach');

//console.log(routineEvent);

//print in a json file
fs.writeFileSync('routineEvent.json', JSON.stringify(routineEvent, null, 2));

module.exports = RoutineEvent;