import "./EditUserDetails.css"
import { useState } from "../../../../frontend/react_lite/createDOM";

const EditUserDetails = () => {

    const user = {
        name: "John Doe",
        email: "1001@stu.ucsc.cmb.ac.lk",
        type: "Standard User",
        universityId: "UCSC20231001",
        tags: "Artificial Intelligence, Web Development, Machine Learning",
    };

    const onSave = (updatedDetails) => {
        console.log("Updated User Details:", updatedDetails);
        // Save changes logic here
    };

    const onCancel = () => {
        console.log("Edit canceled");
    };

    const [editDetails, setEditDetails] = useState({ ...user });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleSave = () => {
        onSave(editDetails);
    };

    return (
        <div className="edit-user-profile">
            <h2>Edit User Information</h2>
            <form className="edit-user-form">
                <label>
                    <strong>Name:</strong>
                    <input
                        type="text"
                        name="name"
                        value={editDetails.name}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    <strong>Email:</strong>
                    <input
                        type="email"
                        name="email"
                        value={editDetails.email}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    <strong>User Type:</strong>
                    <select
                        name="type"
                        value={editDetails.type}
                        onChange={handleInputChange}
                    >
                        <option value="Standard User">Standard User</option>
                        <option value="Premium User">Premium User</option>
                        <option value="Admin">Admin</option>
                        <option value="Moderator">Moderator</option>
                    </select>
                </label>
                <label>
                    <strong>University ID Number:</strong>
                    <input
                        type="text"
                        name="universityId"
                        value={editDetails.universityId}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    <strong>Interested Tags:</strong>
                    <input
                        type="text"
                        name="tags"
                        value={editDetails.tags}
                        onChange={handleInputChange}
                        placeholder="Separate tags with commas"
                    />
                </label>
                <div className="button-panel">
                    <button type="button" className="save-button" onClick={handleSave}>
                        Save
                    </button>
                    <button type="button" className="cancel-button" onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditUserDetails;
