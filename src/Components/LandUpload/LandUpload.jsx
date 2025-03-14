import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { getUserDetails } from "../getUserDetails";
import { getAccessToken } from "../../auth";

const LandUpload = () => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    state: "",
    district: "",
    area: "",
    land_type: "",
    utilities_available: "",
    soil_quality: "",
    land_access: "",
    price: "",
    available_from: "",
    available_to: "",
    description: "",
    uploaded_images: [],
  });

  const [userId, setUserId] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);


useEffect(() => {
  const fetchUserData = async () => {
    const user = await getUserDetails();
    if (user) setUserId(user.id);
  };
  fetchUserData();
}, []);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevData) => ({
      ...prevData,
      uploaded_images: [...prevData.uploaded_images, ...files],
    }));
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  // Final Submission
  const handleFinalSubmit = async () => {
    setShowConfirmation(false);
    if (!userId) {
      alert("User not authenticated");
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "uploaded_images") {
        formData.uploaded_images.forEach((image) => data.append("uploaded_images", image));
      } else {
        data.append(key, formData[key]);
      }
    });

    data.append("owner", userId);

    try {
      const accessToken=await getAccessToken();
      console.log(data);
      await axios.post("http://127.0.0.1:8000/landapi/upload-land/", data, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      alert("Land uploaded successfully!");
      setFormData({
        name: "",
        location: "",
        state: "",
        district: "",
        area: "",
        land_type: "",
        utilities_available: "",
        soil_quality: "",
        land_access: "",
        price: "",
        available_from: "",
        available_to: "",
        description: "",
        uploaded_images: [],
      });
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
        <div className="row">
          {/* Row 1 */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Land Name: *</label>
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Location: *</label>
            <input type="text" className="form-control" name="location" value={formData.location} onChange={handleChange} required />
          </div>

          {/* Row 2 */}
          <div className="col-md-6 mb-3">
            <label className="form-label">State: *</label>
            <input type="text" className="form-control" name="state" value={formData.state} onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">District: *</label>
            <input type="text" className="form-control" name="district" value={formData.district} onChange={handleChange} required />
          </div>

          {/* Row 3 */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Area (sq.ft): *</label>
            <input type="number" className="form-control" name="area" value={formData.area} onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Land Type: *</label>
            <input type="text" className="form-control" name="land_type" value={formData.land_type} onChange={handleChange} required />
          </div>

          {/* Row 4 */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Utilities Available: *</label>
            <input type="text" className="form-control" name="utilities_available" value={formData.utilities_available} onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Soil Quality: *</label>
            <input type="text" className="form-control" name="soil_quality" value={formData.soil_quality} onChange={handleChange} required />
          </div>

          {/* Row 5 */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Price (₹): *</label>
            <input type="number" className="form-control" name="price" value={formData.price} onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Land Access: *</label>
            <input type="text" className="form-control" name="land_access" value={formData.land_access} onChange={handleChange} required />
          </div>

          {/* Row 6 */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Available From: *</label>
            <input type="date" className="form-control" name="available_from" value={formData.available_from} onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Available To: *</label>
            <input type="date" className="form-control" name="available_to" value={formData.available_to} onChange={handleChange} required />
          </div>

          {/* Row 7 */}
          <div className="col-md-12 mb-3">
            <label className="form-label">Description: *</label>
            <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} required />
          </div>

          {/* Image Upload */}
          <div className="col-md-12 mb-3">
            <label className="form-label">Upload Images:</label>
            <input type="file" className="form-control" multiple onChange={handleImageUpload} accept="image/*" />
            <div className="mt-2 d-flex flex-wrap">
              {imagePreviews.map((src, index) => (
                <img key={index} src={src} alt="Preview" className="img-thumbnail me-2" style={{ width: "100px", height: "100px" }} />
              ))}
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-success">Submit</button>
      </form>

        {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowConfirmation(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Land Name:</strong> {formData.name}</p>
                <p><strong>Location:</strong> {formData.location}</p>
                <p><strong>State:</strong> {formData.state}</p>
                <p><strong>District:</strong> {formData.district}</p>
                <p><strong>Area:</strong> {formData.area} sq.ft</p>
                <p><strong>Land Type:</strong> {formData.land_type}</p>
                <p><strong>Price:</strong> ₹{formData.price}</p>
                <p><strong>Land Access:</strong> {formData.land_access}</p>
                <p><strong>Available From:</strong> {formData.available_from}</p>
                <p><strong>Available To:</strong> {formData.available_to}</p>
                <p><strong>Description:</strong> {formData.description}</p>

                <div className="mt-2">
                  <h6>Uploaded Images:</h6>
                  {imagePreviews.length > 0 ? (
                    imagePreviews.map((src, index) => (
                      <img key={index} src={src} alt="Preview" className="img-thumbnail me-2" style={{ width: "60px", height: "60px" }} />
                    ))
                  ) : (
                    <p>No images uploaded</p>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowConfirmation(false)}>Edit</button>
                <button className="btn btn-success" onClick={handleFinalSubmit}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};


export default LandUpload;

