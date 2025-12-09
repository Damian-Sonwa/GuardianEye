from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import face_recognition
import numpy as np
from PIL import Image
import io
import json
from typing import List, Dict
import os

app = FastAPI(title="Face Recognition Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory suspect database (in production, use a vector DB)
suspect_database: Dict[str, np.ndarray] = {}

def load_suspect_database():
    """Load suspect face encodings from storage"""
    # TODO: Load from vector database or file storage
    # For now, this is a placeholder
    pass

@app.on_event("startup")
async def startup_event():
    load_suspect_database()
    print("Face Recognition Service started")

@app.post("/match")
async def match_face(image: UploadFile = File(...)):
    """
    Match a face against the suspect database.
    Returns ranked matches with confidence scores.
    """
    try:
        # Read image
        image_data = await image.read()
        image_pil = Image.open(io.BytesIO(image_data))
        
        # Convert to RGB if needed
        if image_pil.mode != 'RGB':
            image_pil = image_pil.convert('RGB')
        
        # Convert to numpy array
        image_array = np.array(image_pil)
        
        # Detect faces
        face_locations = face_recognition.face_locations(image_array)
        
        if not face_locations:
            return {
                "matches": [],
                "message": "No faces detected in image"
            }
        
        # Get face encoding
        face_encodings = face_recognition.face_encodings(image_array, face_locations)
        
        if not face_encodings:
            return {
                "matches": [],
                "message": "Could not extract face encoding"
            }
        
        face_encoding = face_encodings[0]
        
        # Match against database
        matches = []
        for suspect_id, suspect_encoding in suspect_database.items():
            # Calculate distance
            distance = face_recognition.face_distance([suspect_encoding], face_encoding)[0]
            confidence = 1 - distance  # Convert distance to confidence
            
            if confidence > 0.6:  # Threshold
                matches.append({
                    "suspect_id": suspect_id,
                    "confidence": float(confidence),
                    "distance": float(distance)
                })
        
        # Sort by confidence
        matches.sort(key=lambda x: x["confidence"], reverse=True)
        
        return {
            "matches": matches[:10],  # Top 10 matches
            "faces_detected": len(face_locations)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/add-suspect")
async def add_suspect(
    suspect_id: str,
    image: UploadFile = File(...)
):
    """Add a suspect to the database"""
    try:
        image_data = await image.read()
        image_pil = Image.open(io.BytesIO(image_data))
        
        if image_pil.mode != 'RGB':
            image_pil = image_pil.convert('RGB')
        
        image_array = np.array(image_pil)
        face_encodings = face_recognition.face_encodings(image_array)
        
        if not face_encodings:
            raise HTTPException(status_code=400, detail="No face detected in image")
        
        suspect_database[suspect_id] = face_encodings[0]
        
        return {
            "message": "Suspect added successfully",
            "suspect_id": suspect_id
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "healthy", "suspects_count": len(suspect_database)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

