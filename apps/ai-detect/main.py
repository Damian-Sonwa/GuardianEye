from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import io
import json
from typing import List, Dict

app = FastAPI(title="Weapon Detection Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load YOLO model (pre-trained on COCO, can be fine-tuned for weapons)
# For production, use a custom-trained model for weapons
model = None

def load_model():
    """Load YOLO model"""
    global model
    try:
        # Using YOLOv8n (nano) for speed, can upgrade to larger models
        model = YOLO('yolov8n.pt')
        print("Model loaded successfully")
    except Exception as e:
        print(f"Error loading model: {e}")
        model = None

# Weapon-related classes in COCO dataset
WEAPON_CLASSES = {
    'knife': 43,  # COCO class ID for knife
    'gun': None,  # Not in COCO, would need custom training
}

@app.on_event("startup")
async def startup_event():
    load_model()
    print("Weapon Detection Service started")

@app.post("/detect")
async def detect_weapons(image: UploadFile = File(...)):
    """
    Detect weapons in an image.
    Returns bounding boxes and labels.
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Read image
        image_data = await image.read()
        image_pil = Image.open(io.BytesIO(image_data))
        
        # Convert to RGB if needed
        if image_pil.mode != 'RGB':
            image_pil = image_pil.convert('RGB')
        
        # Run detection
        results = model(image_pil)
        
        detections = []
        for result in results:
            boxes = result.boxes
            for box in boxes:
                # Get class name
                class_id = int(box.cls[0])
                class_name = model.names[class_id]
                confidence = float(box.conf[0])
                
                # Check if it's a weapon-related object
                is_weapon = (
                    'knife' in class_name.lower() or
                    'gun' in class_name.lower() or
                    'weapon' in class_name.lower()
                )
                
                if is_weapon or confidence > 0.5:  # Include all high-confidence detections
                    x1, y1, x2, y2 = box.xyxy[0].tolist()
                    detections.append({
                        "label": class_name,
                        "confidence": confidence,
                        "bbox": {
                            "x1": x1,
                            "y1": y1,
                            "x2": x2,
                            "y2": y2
                        },
                        "is_weapon": is_weapon
                    })
        
        return {
            "detections": detections,
            "weapons_detected": len([d for d in detections if d["is_weapon"]])
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "model_loaded": model is not None
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

