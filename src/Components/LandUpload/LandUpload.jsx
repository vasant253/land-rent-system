import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const LandUpload = () => {
  const [formData, setFormData] = useState({
    name: "",
    landType: "",
    uploaded_images: [],
  });
  const [userId, setUserId] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const token = localStorage.getItem("auth_token");


  useEffect(() => {
    const token = localStorage.getItem("auth_token");
  
    if (!token) {
      console.warn("No authentication token found in localStorage");
      return;
    }
  
    axios.get("http://127.0.0.1:8000/api/user/details/", {
      headers: { Authorization: `Token ${token}` },  // ✅ Ensure token is included
    })
    .then(response => {
      console.log("User Data:", response.data);
      setUserId(response.data.id);
    })
    .catch(error => {
      console.error("Error fetching user data:", error.response?.data || error);
    });
  }, []);
  
  
  

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevData) => ({
      ...prevData,
      images: [...prevData.uploaded_images, ...files], // Preserve previous images
    }));
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
  };


  //submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("User not authenticated");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("landType", formData.landType);
    data.append("user", userId);

    formData.uploaded_images.forEach((image) => {
      data.append("uploaded_images", image);
    });

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/landapi/upload-land/",
        data,
        {
          headers: {
            Authorization: `Token ${token}`, // Send token properly
          },
        }
      );

      alert("Land uploaded successfully!");
      setFormData({ name: "", landType: "", uploaded_images: [] });
      setImagePreviews([]);
    } catch (error) {
      console.error("Error:", error);
      alert("Error uploading land: " + JSON.stringify(error.response?.data || error));
    }
  };

  return (
    <div className="container mt-5 p-4 shadow-lg bg-white rounded">
      <h2 className="text-center mb-4">Upload Land</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Land Name:</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Land Type:</label>
          <select
            className="form-select"
            name="landType"
            value={formData.landType}
            onChange={handleChange}
            required
          >
            <option value="">Select Type</option>
            <option value="Agricultural">Agricultural</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Industrial">Industrial</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Upload Images:</label>
          <input
            type="file"
            className="form-control"
            multiple
            onChange={handleImageUpload}
            accept="image/*"
            required
          />
          <div className="mt-2 d-flex flex-wrap">
            {imagePreviews.map((src, index) => (
              <img
                key={index}
                src={src}
                alt="Preview"
                className="img-thumbnail me-2"
                style={{ width: "100px", height: "100px" }}
              />
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-success">Submit</button>
      </form>
    </div>
  );
};

export default LandUpload;
