import { useState } from "react";
import "../../App.css";

const AddListenerForm = ({ onSave, initialData, onCancel }) => {
  const [editing, setEditing] = useState(initialData ? 1 : 0);

  const [formData, setFormData] = useState({
    _id: initialData?._id || null,
    name: initialData?.name || "",
    url: initialData?.url || "",
    checkInterval: initialData?.checkInterval || "",
    productParams: (initialData?.productParams || []).join(","),
    enabled: initialData?.enabled || false,
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
      const payload = {
        ...formData,
        productParams: formData.productParams
          .split(",")
          .map((param) => param.trim())
          .filter((param) => param !== ""),
      };
      await onSave(payload);
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
        <div className="lower_form addListenerForm">
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
                name="url"
                placeholder="URL"
                className="input"
                value={formData.url}
                onChange={handleInputChange}
              />
            </div>
            <textarea
              name="productParams"
              placeholder="Parameters in CSV"
              className="textarea"
              value={formData.productParams}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="checkInterval"
              placeholder="Check interval"
              className="input"
              value={formData.checkInterval}
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

export default AddListenerForm;
