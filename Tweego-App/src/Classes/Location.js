class Location {
    // Single constructor that handles multiple input formats
    constructor(input) {
      // Check if input is an object (JSON-like)
      if (typeof input === 'object' && input !== null) {
        this.passage_name = input.passage_name;
        this.location_name = input.location_name;
        this.macro_location = input.macro_location;
        this.choice_image = input.choice_image;
        this.passage_image = input.passage_image;
      }
      // Check if input is a string (passage string)
      else if (typeof input === 'string') {
        const regex = /::\s*(\w+)\s*\[.*?\]\n<<map-place-full-handler\s*"([^"]+)"\s*"([^"]+)"\s*"([^"]+)"\s*"([^"]+)"\s*>>/;
        const match = input.match(regex);
  
        if (match) {
          this.passage_name = match[1];
          this.location_name = match[2];
          this.macro_location = match[3];
          this.passage_image = match[5];
          this.choice_image = this.passage_image;
        } else {
          console.error("Failed to parse passage string with the given format.");
        }
      } else {
        console.error('Invalid input provided to constructor.');
      }
    }

        getFullPassage(){
            let formattedLocName = this.location_name;
            formattedLocName = formattedLocName.replace(/ /g, "_");
            let passage = `:: ${this.passage_name} [init-map ${this.macro_location} ${formattedLocName}]\n`+ 
            `<<map-place-full-handler "${this.location_name}" "${this.macro_location}" "${this.passage_name}" "
            ${this.passage_image}">\n\n`+
            `:: ${this.passage_name}_style [stylesheet]\n`+
            `.${this.passage_name}_choice_image{background-image:  url("${this.choice_image}");}`

            return passage;
        }

        toJSON(){
            return {
                passage_name: this.passage_name,
                location_name: this.location_name,
                macro_location: this.macro_location,
                choice_image: this.choice_image,
                passage_image: this.passage_image
            }
        }
    }

//export
module.exports = Location;