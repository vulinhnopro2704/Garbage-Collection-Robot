import os
import cloudinary
import cloudinary.uploader
import cloudinary.api
from dotenv import load_dotenv
import uuid
from io import BytesIO
import base64

# Load environment variables
load_dotenv()

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET'),
    secure=True
)

def upload_image_base64(base64_image, folder="detections", public_id=None):
    """
    Upload an image to Cloudinary from a base64 string
    
    Args:
        base64_image (str): Base64 encoded image (without the data:image prefix)
        folder (str): Folder to store the image in Cloudinary
        public_id (str, optional): Custom public ID for the image. Defaults to None.
    
    Returns:
        dict: Cloudinary upload response containing URL and other information
    """
    if not public_id:
        public_id = f"detection_{uuid.uuid4().hex}"
    
    try:
        # Properly format the base64 image for Cloudinary upload
        upload_data = f"data:image/jpeg;base64,{base64_image}"
        
        # Upload to Cloudinary
        response = cloudinary.uploader.upload(
            upload_data,
            folder=folder,
            public_id=public_id,
            resource_type="image"
        )
        return {
            "success": True,
            "url": response['secure_url'],
            "public_id": response['public_id'],
            "resource_type": response['resource_type']
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

def upload_image_file(image_file, folder="detections", public_id=None):
    """
    Upload an image file to Cloudinary
    
    Args:
        image_file: File object (from request.FILES)
        folder (str): Folder to store the image in Cloudinary
        public_id (str, optional): Custom public ID for the image. Defaults to None.
    
    Returns:
        dict: Cloudinary upload response containing URL and other information
    """
    if not public_id:
        public_id = f"detection_{uuid.uuid4().hex}"
    
    try:
        # For Django's InMemoryUploadedFile, we need to read it first
        image_file.seek(0)  # Reset file pointer to the beginning
        
        # Upload to Cloudinary
        response = cloudinary.uploader.upload(
            image_file,
            folder=folder,
            public_id=public_id,
            resource_type="auto"  # Using auto to detect the resource type
        )
        return {
            "success": True,
            "url": response['secure_url'],
            "public_id": response['public_id'],
            "resource_type": response['resource_type']
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

def delete_image(public_id):
    """
    Delete an image from Cloudinary
    
    Args:
        public_id (str): Public ID of the image to delete
    
    Returns:
        dict: Deletion response
    """
    try:
        response = cloudinary.uploader.destroy(public_id)
        return {
            "success": True,
            "response": response
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }