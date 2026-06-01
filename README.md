# Meetudy

**Meet + Study**

Meetudy is a study group matching platform where users can create and join study groups with multiple people.

---

# Main Features

* Create study posts
* View other users’ profiles
* Apply to join study groups
* Chat with group members

---

# How to Run Meetudy

## 1. Clone the Project

```bash
git clone https://github.com/mayam5/Meetudy.git
cd Meetudy
```

---

## 2. Run the Backend Server

Run the backend server using the following commands:

```bash
cd backend
gradlew.bat bootRun
```

If the server runs successfully, the following message will appear:

```bash
Started DemoApplication
```

---

## 3. Run the Frontend Server

Open a new terminal and run the frontend server:

```bash
cd frontend
npm install
npm run dev
```

If the frontend runs successfully, the following address will appear:

```bash
http://localhost:5173/
```

---

## 4. Access the Website

Open the following address in your browser:

```bash
http://localhost:5173/
```

---

# Before Running the Project

* Check the database connection settings in `application.properties`.
* Kakao REST API Key configuration is required for the place search feature. (in `application.properties`)
* The backend server must be running before starting the frontend server.

---

# Project Structure

```text
Meetudy/
├ backend/
├ frontend/
├ docs/
└ README.md
```

# docs

Additional project resources and documents can be found in the docs directory.
