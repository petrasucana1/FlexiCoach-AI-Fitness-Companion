# FlexiCoach – AI-Enhanced Modular Fitness App 🏋️‍♀️🤖

**FlexiCoach** is a modular fitness application developed as part of a Bachelor's thesis project. It allows users to train freely, without depending on a specific location, trainer schedule, or specialized equipment. By offering personalized workout plans, instructional videos, and real-time posture feedback powered by AI, the app provides a smart, accessible, and flexible training experience – anytime, anywhere.

## 🧠 Overview

The system is split into three main components:
1. A mobile frontend built in React Native, responsible for user interaction.
2. A GraphQL backend powered by StepZen, which aggregates data from Firebase, API Ninjas, and YouTube.
3. A separate real-time feedback module using computer vision to detect posture errors via the webcam and guide the user during exercises.

---

## 🎯 Key Functionalities

- 📋 Two training modes: manual or auto-generated based on a fitness questionnaire
- 🧍‍♀️ Real-time posture analysis via OpenCV + MediaPipe
- 🔁 Repetition and set counting
- 📹 Instructional videos for each exercise
- 🗃️ Personalized plans saved to Firebase
- 📡 Live feedback through WebSocket
- 📈 Progress tracking
- 👥 User registration and profile modes (beginner vs experienced)

---

## 🧩 Architecture
<img width="1386" height="701" alt="image" src="https://github.com/user-attachments/assets/f292909d-cac1-431a-9c30-0214b97db678" />

## 🧩 UseCase Diagram
<img width="787" height="1152" alt="DiagramaUseCase" src="https://github.com/user-attachments/assets/c48186d9-8c77-4eb8-8ee5-8624605e9b22" />

## 🧩 App:

<img width="952" height="710" alt="ecran1" src="https://github.com/user-attachments/assets/d7b1dbcd-e760-4e18-b3de-f1cd0b8b1ba7" />
<img width="1140" height="718" alt="ecran3" src="https://github.com/user-attachments/assets/2c8bc0c1-d66b-4b54-8e0c-f846553fcdb7" />
<img width="858" height="686" alt="ecran4" src="https://github.com/user-attachments/assets/672d6dce-6279-424a-befb-b1afead998a0" />
<img width="1174" height="671" alt="ecran6" src="https://github.com/user-attachments/assets/ba635fae-198d-4f61-a3ea-c51928620a14" />
<img width="1673" height="911" alt="ecran8" src="https://github.com/user-attachments/assets/49115866-c745-4e48-8c15-4e173bbe8b6b" />
<img width="1382" height="1097" alt="ecran9" src="https://github.com/user-attachments/assets/2103e21e-905b-4107-b72b-194411e54b78" />
<img width="2080" height="1876" alt="ecran10" src="https://github.com/user-attachments/assets/ba2f69c1-2154-4d25-8f69-8334d68a3fdc" />



