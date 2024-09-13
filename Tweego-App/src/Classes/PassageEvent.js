class PassageEvent {
        constructor(inputString) {
            this.wrapperName = null;
            this.passageName = null;
            this.dialogues = [];
            this.choiceStream = [];
    
            this.parseInput(inputString);
        }
    
        // Parsing function to extract information from the input string
        parseInput(inputString) {
            // Extract the passage name (first line starting with "::")
            const passageMatch = inputString.match(/^::\s*([^\n]+)/);
            this.passageName = passageMatch ? passageMatch[1].trim() : null;
    

            const wrapperMatch = inputString.match(/<<wrapper\s+"([^"]+)">>/);
            this.wrapperName = wrapperMatch ? wrapperMatch[1] : null;
    
            // Parse dialogues (fast_image or say blocks)
            const blockRegex = new RegExp(
                '(<<fast_image\\s+"([^"]+)">>|<<say\\s+"([^"]+)"\\s+"([^"]+)">>([\\s\\S]*?)<</say>>)', 
                'g'
            );
            
            let match;
            while ((match = blockRegex.exec(inputString)) !== null) {
                if (match[1].startsWith('<<fast_image')) {
                    // Handle fast_image block
                    const imageUrl = match[2];
                    this.dialogues.push({ type: 'fast_image', imageUrl });
                } else if (match[1].startsWith('<<say')) {
                    // Handle say block
                    const characterId = match[3];
                    const characterName = match[4];
                    const dialogueText = match[5].trim();
                    this.dialogues.push({ type: 'say', characterId, characterName, dialogueText });
                }
            }
    
            // Parse choices
            const decisionRegex = /<<decision(_hard|_soft)?\s+"([^"]+)"\s+"([^"]+)"\s+"([^"]+)">>/g;
            let decisionMatch;
            while ((decisionMatch = decisionRegex.exec(inputString)) !== null) {
                const type = decisionMatch[1] ? decisionMatch[1].substring(1) : 'normal'; // hard, soft, or normal
                const id = decisionMatch[2];
                const label = decisionMatch[3];
                const target = decisionMatch[4];
    
                this.choiceStream.push({ type, id, label, target });
            }
    
            // Requirement choices can be added similarly
        }
    
        // Add any additional methods needed to work with this data


        //to dict
        toDict() {
            return {
                passageName: this.passageName,
                wrapperName: this.wrapperName,
                dialogues: this.dialogues,
                choiceStream: this.choiceStream
            };
        }

        //to passage string
        toPassageString() {
            let passageString = `:: ${this.passageName}\n\n`;
            passageString += `<<wrapper "${this.wrapperName}">>\n`;
    
            for (const dialogue of this.dialogues) {
                if (dialogue.type === 'fast_image') {
                    passageString += `<<fast_image "${dialogue.imageUrl}">>\n`;
                    continue;
                }
                passageString += `<<say "${dialogue.characterId}" "${dialogue.characterName}">>\n`;
                passageString += `${dialogue.dialogueText}\n`;
                passageString += `<</say>>\n`;
            }
    
            if (this.choiceStream.length > 0) {
                passageString += `<<decision_maker "${this.choiceStream[0].id}">>\n`;
                for (const choice of this.choiceStream) {
                    passageString += `<<decision${choice.type!=='normal' ? `_${choice.type}` : ''} "${choice.id}" "${choice.label}" "${choice.target}">>\n`;
                }
                passageString += `<</decision_maker>>\n`;
            }
    
            passageString += `<</wrapper>>`;
    
            return passageString;
        }
}


module.exports = PassageEvent;