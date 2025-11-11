import os
import tempfile
import cv2
from ultralytics import YOLO


# ---------------------------------------------------------------------
# 🧩 Model paths (relative to backend/)
# ---------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ML_MODELS_DIR = os.path.join(BASE_DIR, "..", "ml_Models")

OIL_MODEL_PATH = os.path.join(ML_MODELS_DIR, "oilspill_detector.pt")

# Verify path before loading
if not os.path.exists(OIL_MODEL_PATH):
    raise FileNotFoundError(f"❌ Oil-spill model not found at {OIL_MODEL_PATH}")

# ---------------------------------------------------------------------
# ⚙️ Load YOLO (oil spill) model
# ---------------------------------------------------------------------
print("🔹 Loading Oil-Spill YOLO model...")
oil_model = YOLO(OIL_MODEL_PATH)


# ---------------------------------------------------------------------
# 🧠 Detection function
# ---------------------------------------------------------------------
def run_oil_detection(image_path: str):
    """Run YOLOv8 oil-spill detection."""
    results = oil_model(image_path)
    conf = max([r.boxes.conf.max().item() for r in results if len(r.boxes) > 0], default=0.0)
    output_path = results[0].save(filename="oil_detection_output.jpg")
    return str(output_path), conf


# ---------------------------------------------------------------------
# 🚀 Combined detection (temporary single-model)
# ---------------------------------------------------------------------
def run_detection(image_file):
    """
    For now, only runs oil-spill YOLO model.
    Later we'll merge debris model when available.
    """
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
        image_file.save(tmp.name)
        temp_path = tmp.name

    # Run YOLO detection
    output_path, oil_conf = run_oil_detection(temp_path)

    # For now, no debris model, so debris_conf = 0.0
    debris_conf = 0.0

    # Decide classification result
    if oil_conf > 0.5:
        detected_type = "oil_spill"
    else:
        detected_type = "none"

    return output_path, detected_type, {"oil": oil_conf, "debris": debris_conf}
