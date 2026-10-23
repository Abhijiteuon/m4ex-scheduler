# M4EX Scheduler — Mission for Excellence

A modern, fast, and responsive web application designed for **Mission for Excellence (M4EX)** to quickly build, format, and share coaching class schedules directly on **WhatsApp**.

---

## 🌟 Key Features

1. **Welcome Screen & Batch Selection**:
   - Greets users with **"Welcome to M4EX Scheduler"**.
   - Asks: *"Choose for which batch do you want to schedule classes for:"*
   - Pre-configured batches:
     - `12th A1 batch`
     - `12th A2 batch`
     - `11th B1 batch`
     - `11th B2 batch`
     - `10th C1 batch`
     - `10th C2 batch`
     - `9th class`
     - `8th class`

2. **Add Compulsory Class (+Add a compulsory class)**:
   - **Day**: Dropdown with all 7 days (Monday to Sunday)
   - **Duration**: Flexible text entry with quick-click presets (e.g., `4.00-5:10PM`, `5:15-7.00PM`)
   - **Subject**: Physics, Chemistry, Maths, Biology, or Custom
   - **Teacher's Name**: Nitin Sir, Neelam Ma'am, Ankit Sir, Shweta Mam, Sumit Sir, Abhijit Sir, or Custom
   - **Standard Mode**: `(OFFLINE + ONLINE)` is always included automatically!

3. **Add Extra Class (+Add an extra class)**:
   - Includes all compulsory class fields plus:
   - **Topic Name**: e.g., *Doubt Class*, *Electrochemistry Doubt Class*, *Wave Optics Class*, etc.
   - **Compulsory for**: Student name(s) (e.g. *Parth*, *Adhiraj*, *Khushi*)
   - **Format Options**:
     - `(Compulsory for *<Student>*) Others are also welcome.`
     - `(For *<Student>*)`

4. **Add Test (+Add Test)**:
   - **1. Day**: Dropdown menu for all 7 days
   - **2. Duration**: User types duration (e.g., `2.00-3.30PM`)
   - **3. Subject Name**: Physics, Chemistry, Maths, Biology, or Custom
   - **4. Topic (Optional)**: User types topic(s), separate multiple with comma (e.g., `AoI, Differential eq, LPP`)
   - **5. Optional Test (Checklist)**:
     - **Unchecked (Default)**: Classified as **Compulsory Test** (`🔰 Compulsory Test`), including official attendance guidelines and Ashwini Ma'am contact notice!
     - **Checked**: Classified as **Optional Test** (`🔰 Optional Test`).

5. **Exact WhatsApp Formatting (Matching Reference Images)**:
   - Header with batch and day: `🔸 Friday Schedule (*12th A2 Batch*)`
   - Emoji bullet markers: `⭕` for classes, `🔰` for section headers, `🔸` for schedule header
   - Bold syntax (`*text*`) for times, batches, and student names
   - Clean spacing with double line breaks
   - **Pinned Online Notice**: Automatically appends the pinned message at the end:
     `📌 If anyone needs to attend class in online mode, link is provided in the description of this group.`

5. **Direct WhatsApp Sharing & Export**:
   - 🟢 **Share on WhatsApp**: One-click sharing that opens WhatsApp Web or mobile app with pre-filled message
   - 📋 **Copy to Clipboard**: Quick copy with instant toast confirmation
   - 💾 **Download Text**: Save as a `.txt` file
   - 💬 **Live WhatsApp Chat Bubble Preview**: See how the message looks in WhatsApp dark/light theme before sending!
   - 🔄 **Load Sample**: Instantly load the example from the reference image with 1 click
   - 💾 **Auto-save**: Uses browser localStorage so drafts are never lost on reload

---

## 🚀 How to Run

### Method 1: Direct in Browser (No installation needed)
Simply double-click [`index.html`](file:///c:/Users/Euona/Desktop/M4EX%20Schedule%20maker/index.html) or right-click and choose **Open with Chrome / Edge / Firefox / Safari**.

### Method 2: Local Node.js Server
Open a terminal in this directory and run:
```bash
node server.js
```
Then visit:
```
http://localhost:3000
```
or with npm:
```bash
npm start
```

---

## 📱 Exact Output Format Example

```text
🔸 Friday Schedule (*12th A2 Batch*)

🔰 Extra Classes

⭕ *1–2 PM* Chemistry Doubt Class with Sumit Sir (Compulsory for *Parth*) Others are also welcome.

⭕ *2–4 PM* Chemistry Electrochemistry Doubt Class with Sumit Sir (Compulsory for *Adhiraj*) Others are also welcome.

⭕ *4–5 PM* Physics Wave Optics Class with Sumit Sir (For *Khushi*)

🔰 Compulsory Class

⭕ *4.00-5:10PM*  Maths Compulsory class with Nitin Sir (OFFLINE + ONLINE)

⭕ *5:15-7.00PM*  Physics Compulsory class with Nitin Sir (OFFLINE + ONLINE)

⭕ *7.00-8.00PM*  Chemistry compulsory class with Neelam Ma'am  (OFFLINE + ONLINE)

🔰 Compulsory Test

🔲 *2.00-3.30PM*  *Compulsory Math Test* Topic 🔲 *AoI* 🔲 *Differential eq* 🔲 *LPP*

‼️ Plz reply with "Offline / Online / No"  As per choice of mode of exam you wish to write tomorrow.

🔲  Greater Noida based students must give reason, if they are opting for Online by Calling Ashwini Ma'am (9999293920) , Else they will not be allowed to give the test in ONLINE MODE.

🔲  All students opting for "NO" must also give reason by Calling Ashwini Ma'am (9999293920).

📌 If anyone needs to attend class in online mode, link is provided in the description of this group.
```
