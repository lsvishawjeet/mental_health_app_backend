import tensorflow as tf
import cv2
import pathlib
import numpy as np
import keyboard
import sys
import json 

path = str(sys.argv[1])
# Load the pre-trained face detector
face_cascade_path = pathlib.Path(cv2.__file__).parent.absolute() / "data/haarcascade_frontalface_default.xml"
print(face_cascade_path)
face_detect_classifier = cv2.CascadeClassifier(str(face_cascade_path))

# Load the pre-trained emotion detection model
emotion_model_path = 'D:\AIIMS_Project\V1\\ai\Eideo.h5'  
emotion_model = tf.keras.models.load_model(emotion_model_path)

# Read the video
video_capture = cv2.VideoCapture(path)

# Set a confidence threshold (adjust as needed)
confidence_threshold = 0.8

# Collect emotion predictions for each frame
emotion_predictions = []

while True:
    # Read a frame from the video
    ret, frame = video_capture.read()

    # Check if the frame is empty
    if not ret or frame is None:
        print("Error reading frame. Exiting...")
        break

    # Convert the frame to grayscale for face detection
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detect faces in the frame
    faces = face_detect_classifier.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    # Process each detected face
    for (x, y, w, h) in faces:
        # Extract the face region
        face_roi = gray[y:y+h, x:x+w]

        # Resize the face region to match the input size of the emotion model
        resized_face = cv2.resize(face_roi, (48, 48))

        # Normalize the pixel values
        normalized_face = resized_face / 255.0

        # Reshape the input for the emotion model
        input_face = tf.expand_dims(tf.expand_dims(normalized_face, 0), -1)

        # Perform emotion prediction
        emotion_probabilities = emotion_model.predict(input_face)[0]
        
        # Get the emotion with the highest probability
        predicted_emotion = tf.argmax(emotion_probabilities).numpy()

        # Get the confidence of the prediction
        confidence = emotion_probabilities[predicted_emotion]

        # Check if confidence is above the threshold
        if confidence > confidence_threshold:
            emotion_predictions.append(predicted_emotion)

            # Draw rectangles around the detected faces and display the predicted emotion
            cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
            cv2.putText(frame, f"{predicted_emotion} ({confidence:.2f})", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 0, 0), 2)

    # Display the frame, Uncomment this if you want to test the visual output
    # cv2.imshow('Video', frame)

    # Break the loop if q key is pressed
    if keyboard.is_pressed('q'):
        break

# Release the video capture object
video_capture.release()
cv2.destroyAllWindows()

# Determine the most dominant emotion after processing all frames
if emotion_predictions:
    dominant_emotion = np.bincount(emotion_predictions).argmax()
    emotion_labels = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]
    dominant_emotion_label = emotion_labels[dominant_emotion]
    print(f"The most dominant emotion expressed throughout the video: {dominant_emotion_label}")
else:
    print("No faces detected in the video.")
 
sys.stdout.flush()
