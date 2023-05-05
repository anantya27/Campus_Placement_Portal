

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
from keras.models import load_model

import cv2 # new

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MODEL = tf.keras.models.load_model("../saved_models/1")
MODEL = load_model("model.h5")
# face_classifier = cv2.CascadeClassifier(r'C:\Users\Admin\Desktop\PythonProject\EmotionDetectionCNN\haarcascade_frontalface_default.xml')
face_classifier = cv2.CascadeClassifier("haarcascade_frontalface_default.xml")

# MODEL = load_model("../potatoes.h5")

# CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]
CLASS_NAMES = ['Angry','Disgust','Fear','Happy','Neutral', 'Sad', 'Surprise']

@app.get("/ping")
async def ping():
    return "Hello, I am alive"

def read_file_as_image(data) -> np.ndarray:
    
    # frame = Image.open(BytesIO(data))
    # print("frame: ",frame); 

    # image = np.array(Image.open(BytesIO(data)))
    # print("img shape: ",image.shape); 
    
    # Through OpenCv library--------------------------
    # frameCV=cv2.imread(BytesIO(data));
    # test = np.asarray(BytesIO(data))
    # test1 = np.asarray(Image.open(BytesIO(data)))
    
    # test4 = np.asarray(bytearray(data))
    # test5 = np.array(BytesIO(data))
    # imageCV = cv2.imdecode(test1, cv2.IMREAD_GRAYSCALE)
    

    test2 = np.asarray(bytearray(data), dtype="uint8")
    print("test2 shape: ",test2.shape); 
    imageCV = cv2.imdecode(test2, 0)

    # may work with video----------------
    # imageCV = cv2.imdecode(test2, cv2.IMREAD_COLOR)
    # imageCV = cv2.cvtColor(imageCV,cv2.COLOR_BGR2GRAY)
    faces = face_classifier.detectMultiScale(imageCV)
    for (x,y,w,h) in faces:
        # cv2.rectangle(frame,(x,y),(x+w,y+h),(0,255,255),2)
        roi_gray = imageCV[y:y+h,x:x+w]
        roi_gray = cv2.resize(roi_gray,(48,48),interpolation=cv2.INTER_AREA)
        roi = roi_gray.astype('float')/255.0
        a = np.array(roi)
        return a
    
    # ------------------------------------------------------------------

    roi_gray = cv2.resize(imageCV,(48,48),interpolation=cv2.INTER_AREA)
    roi = roi_gray.astype('float')/255.0
    a = np.array(roi)
    print("openCv : ",a.shape); 
    # cv2.imwrite("result.jpg", imageCV)
    # ----------------------------------------------------------

    # Through pil library--------------------------
    # frame = Image.open(BytesIO(data))
    # imgGray = frame.convert('L')
    # imgGray = imgGray.resize((48,48))
    # # imgGray = imgGray.astype('float')/255.0
    # arr = np.array(imgGray)
    # arr = arr.astype('float')/255.0 # accuracy problem
    # print(arr.shape); 
    # return arr
    # ---------------------------------------

    return a

@app.post("/predict")
async def predict(  file: UploadFile = File(...)  ):
    image = read_file_as_image(await file.read())
    print("img shape: ",image.shape); 
    # potato model expected shape - (256, 256, 3)
    # emotion model expected shape - (48, 48) + grayscale image
    img_batch = np.expand_dims(image, 0)
    
    predictions = MODEL.predict(img_batch)
    predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
    
    # print(img_batch);

    confidence = np.max(predictions[0])
    return {
        'class': predicted_class,
        'confidence': float(confidence)
    }

if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)

