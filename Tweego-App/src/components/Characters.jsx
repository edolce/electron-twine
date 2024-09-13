import React from 'react';
import Character from './Character.jsx';

function Characters(props) {

    return (
        <div>
            {Object.keys(props.characters).map((character) => {
                return <Character 
                key={character} 
                character={props.characters[character]} 
                updateCharacter={(char) => props.updateCharacter} 
                />
            })
            }
        </div>
    );
}

export default Characters;