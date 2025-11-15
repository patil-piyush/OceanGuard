# services/cloudinary_service.py
import cloudinary
import cloudinary.uploader
import os

# Set these env vars in your .env or config
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

def upload_image(file_obj, folder="oceanguard/reports"):
    """
    file_obj: werkzeug.FileStorage (what Flask gives you in request.files)
    Returns: secure URL (string)
    """
    if file_obj is None:
        return None

    # If file_obj is a dict item (due to merging files into data_dict) handle that too
    # Accept either FileStorage or path
    if hasattr(file_obj, "read"):
        # Cloudinary accepts file-like objects or temporary path
        res = cloudinary.uploader.upload(file_obj, folder=folder, resource_type="image")
        return res.get("secure_url")
    else:
        # If string URL already, return as is
        return str(file_obj)
