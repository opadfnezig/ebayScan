import { useState } from "react";
import "../../App.css";

const AddSearchForm = ({ onSave, initialData, onCancel }) => {
  const [editing, setEditing] = useState(initialData ? 1 : 0);

  const [formData, setFormData] = useState({
    _id: initialData?._id || null,
    name: initialData?.name || "",
    listenerName: initialData?.listenerName || "",
    requirements: initialData?.requirements || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (onSave) {
      await onSave(formData);
    }
    setEditing(0);
  };

  const handleCancel = async () => {
    if (onCancel) {
      await onCancel();
    }
    setEditing(0);
  }

  return (
    <div>
      {editing === 1 && (
        <div className="lower_form addSearchForm">
          <div className="lower_form__inputs">
            <div className="input-group">
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="input"
                value={formData.name}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="listenerName"
                placeholder="Listener Name"
                className="input"
                value={formData.listenerName}
                onChange={handleInputChange}
              />
            </div>
            <textarea
              name="requirements"
              placeholder="Requirements"
              className="textarea"
              value={formData.requirements}
              onChange={handleInputChange}
            />
          </div>
          <div className="lower_form__buttons">
            <button className="action-button" onClick={handleSave}>
              Save
            </button>
            <button className="action-button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddSearchForm;
