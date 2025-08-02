# Product Requirements Document (PRD)

## Project Title
**“Bambu Status Check” Alexa Skill via OctoEverywhere**

---

## 🧭 Goal

Enable Alexa users to monitor the status of their **Bambu Lab printers** using voice commands. Leverage **OctoEverywhere’s cloud API** for real-time updates, multi-printer support, and print event notifications.

---

## 📡 Tech Stack

- **Voice Platform:** Alexa Skills Kit (ASK)
- **Backend:** AWS Lambda (Node.js)
- **Remote API:**  
  - App API: [OctoEverywhere API Docs](https://octoeverywhere.stoplight.io/docs/octoeverywhere-api-docs)  
  - Webhooks: [Webhook Notifications](https://docs.octoeverywhere.com/webhook-notifications/)  
- **Printer Plugin:** Bambu Connect  
  [Bambu Connect Overview](https://blog.octoeverywhere.com/bambu-connect-level-up-your-bambu-lab-3d-printer/)

---

## 🧩 Feature Set & Intents

### 🔄 Multi-Printer Support

- Alexa skill should query available printers via the API.
- If multiple printers are found, prompt:
  > “You have more than one printer. Which one would you like to check? For example, say ‘X1C’ or ‘Mini’.”

### 🎯 Intents

| Intent Name             | Sample Utterances                                                | Function                          |
|-------------------------|------------------------------------------------------------------|-----------------------------------|
| `GetPrintProgressIntent`| “Alexa, ask Bambu Status Check how far along X1C is.”           | Returns percent of current job   |
|                         | “What’s the progress on my Mini?”                               |                                   |
| `GetTimeRemainingIntent`| “Alexa, how much time is left on X1C?”                          | Returns time remaining           |
|                         | “When will Mini be done printing?”                              |                                   |
| `GetPrinterStatusIntent`| “Is Mini printing?”                                              | Returns current printer state    |
|                         | “What’s X1C doing right now?”                                   |                                   |
| `LaunchRequest`         | “Alexa, open Bambu Status Check.”                               | Skill intro & available commands |
| `HelpIntent`            | “Help”                                                           | Lists commands & examples        |
| `PrinterSelectionIntent`| “My X1C.”                                                        | Used in multi-printer selection  |
|                         | “The Mini.”                                                     |                                   |
| `CancelAndStopIntent`   | “Stop”, “Cancel”                                                 | Ends the session                 |

---

## 🔐 Authentication

- API requests require an `AppToken`:
  ```
  AppToken: <your-token>
  ```
- Use this to call:
  ```
  GET https://octoeverywhere.com/api/appconnection/v1/printer
  ```
  - This returns an array of user printers with IDs and names.
  - Use selected printer’s ID for subsequent state queries:
    ```
    GET /api/appconnection/v1/printer/<printerId>/state
    ```

---

## 📢 Required Features

### ✅ Print Completion Notifications (via Alexa)

- Use OctoEverywhere webhook subscription:
  - Subscribe to events like `PrintFinished`, `PrintFailed`, etc.
  - Use [Alexa Notifications API](https://developer.amazon.com/en-US/docs/alexa/smarthome/developer-notifications-for-smart-home-skills.html)

### 📷 Webcam Snapshot Support

- Endpoint: `GET /printer/<printerId>/webcam`
- Used to fetch a snapshot URL for printers with camera.
- Optional response: “Want to see a snapshot? I can send it to your phone.”

---

## 🧪 Test Cases

| Scenario                       | Expected Result                               |
|--------------------------------|-----------------------------------------------|
| 1 printer, “How much time?”    | Alexa: “Your X1C has 38 minutes left.”       |
| 2+ printers, “What’s status?”  | Alexa: “You have X1C and Mini. Which one?”   |
| Print finishes (webhook)       | Alexa: “X1C just finished printing!”         |
| Webcam snapshot request        | Alexa: “Here’s a snapshot from Mini.”        |

---

## 🛠 Implementation Notes

- All printer IDs must be cached per user session.
- Sample printer state response:
  ```json
  {
    "printer": {
      "state": "Printing",
      "progress": { "percent": 52 },
      "time_remaining": 1500
    }
  }
  ```
- Time remaining should be returned as natural speech (e.g., “25 minutes”).
- Use session attributes or dialog delegation for incomplete info.