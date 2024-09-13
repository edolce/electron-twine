//template from react component
import React from 'react';

import Locations from './Locations.jsx';
import Characters from './Characters.jsx';

const Main = () => {

    //set state for the main component
        const [visualizer, setVisualizer] = React.useState('Characters');

    const [charactersData, setCharacters] = React.useState([]);
    const [locationsData, setLocations] = React.useState([]);

    function updateCharacter(character) {
        //find character in the list and update it
        let newCharacters = charactersData;
        let index = newCharacters.findIndex((char) => char.characterDisplayName === character.characterDisplayName);
        newCharacters[index] = character;
        setCharacters(newCharacters);
    }


    function getBody() {
        if (visualizer === 'Locations') {
            return <Locations />
        }
        else if (visualizer === 'Characters') {
            return <Characters 
            characters={charactersData} 
            updateCharacter={(char) =>updateCharacter}
            />
        }
        else {
            return <div>
                <h2>Welcome to Twine Helper</h2>
                <p>Choose a category to get started</p>
            </div>
        }
    }

    //add a meta tag to header of html with js 
//     document.querySelector('head').insertAdjacentHTML('beforeend', `<meta http-equiv="Content-Security-Policy" content="default-src *;
//    img-src * 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' *;
//    style-src  'self' 'unsafe-inline' *">`);


    




    //load all the state 
    function loadAllCharacters() {
        window.api.askForCharacters('askForCharacters');
        window.api.getCharacters((characters) => {
            setCharacters(characters);
        })
    }
    
    //load character at the start
    React.useEffect(() => {
        loadAllCharacters();
    }, []);

    console.log(Characters);

    return (
        <div className='main-container'>
            <div className='header'>
                <h1>Twine Helper</h1>
            </div>
            <div className="choice">
                <button onClick={() => {
                    console.log('locations');
                    setVisualizer('Locations');
                }}>Locations</button>
                <button onClick={() => setVisualizer('Characters')}>Characters</button>
            </div>
            <div className="body">
            {getBody()}
            </div>
        </div>
    );
    };

export default Main;