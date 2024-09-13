import React, { useState } from 'react';
import './Character.css'; // Add any custom styles here

const Character = ({ character, updateCharacter }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(character);
  const [imageType, setImageType] = useState('url'); // 'url' or 'file'
  
  const handleModalOpen = () => {
    setFormData(character);
    setShowModal(true);
  };

  const handleModalClose = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prevData => ({
          ...prevData,
          [imageType]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageTypeChange = (e) => {
    setImageType(e.target.value);
  };

  const saveData = () => {
    //get all form data
    let formData = document.querySelector('form');
    formData = new FormData(formData);
    formData = Object.fromEntries(formData.entries());

    //update the character
    character.characterDisplayName = formData.characterDisplayName;
    character.characterJobDescription = formData.characterJobDescription;
    character.macroLocation = formData.macroLocation;
    character.characterImageCharList = formData.characterImageCharList;
    character.characterDialoguesImage = formData.characterDialoguesImage;
    character.characterChoiceImage = formData.characterChoiceImage;





    updateCharacter(character);
    handleModalClose();
  };

  return (
    <div className="character-box">
      <img
        src={character.characterImageCharList}
        alt={character.characterDisplayName}
        onClick={handleModalOpen}
        className="character-img"
      />
      <h3>{character.characterDisplayName}</h3>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={handleModalClose}>X</button>
            <h2>Edit Character: {character.characterDisplayName}</h2>
            <form>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="characterDisplayName"
                  value={formData.characterDisplayName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Job Description:</label>
                <textarea
                  name="characterJobDescription"
                  value={formData.characterJobDescription}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Macro Location:</label>
                <input
                  type="text"
                  name="macroLocation"
                  value={formData.macroLocation}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Character Image:</label>
                <img
                  src={formData.characterImageCharList}
                  alt="Character"
                  className="character-img-preview"
                />
                <div>
                  <input
                    type="radio"
                    name="imageType"
                    value="url"
                    checked={imageType === 'url'}
                    onChange={handleImageTypeChange}
                  />
                  <label>URL</label>
                  <input
                    type="text"
                    name="characterImageCharList"
                    value={formData.characterImageCharList}
                    onChange={handleChange}
                    disabled={imageType === 'file'}
                  />
                </div>
                <div>
                  <input
                    type="radio"
                    name="imageType"
                    value="file"
                    checked={imageType === 'file'}
                    onChange={handleImageTypeChange}
                  />
                  <label>File</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={imageType === 'url'}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Dialogues Image:</label>
                <img
                  src={formData.characterDialoguesImage}
                  alt="Dialogues"
                  className="character-img-preview"
                />
                <input
                  type="text"
                  name="characterDialoguesImage"
                  value={formData.characterDialoguesImage}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Choice Image:</label>
                <img
                  src={formData.characterChoiceImage}
                  alt="Choice"
                  className="character-img-preview"
                />
                <input
                  type="text"
                  name="characterChoiceImage"
                  value={formData.characterChoiceImage}
                  onChange={handleChange}
                />
              </div>
              <div className="save" onClick={saveData}>Save</div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Character;
