The app I am thinking of is Lightning.io. What it does is it is a website for user to upload any files/texts. After uploaded it will create a QRcode/Link. The user can give this link/QR code to their friends, after that they friends can open the link and they can download the file/text. It is really convinient for people who want to send something to their friends instantly, without using any specific apps, only using websites. After the target download the file, the link and the file will be vanish within 2 hours.


Key features: 
Secure transfer through HTTPS server
Easy to use UI, drag and drop
Multi files upload
Text input and send to others
Multi platform(Windows, MacOS, IOS, Android,Linux) PWA application
Web socket for sending data about received file.


!!!!!File Structure!!!!!

├─ deployReact.sh              # React specific deployment
├─ package.json                # React-FrontEnd json
├─ package-lock.json           # React-FrontEnd json
├─ public                      # index.html and other stuff
│   ├─ index.html
│   ├─ logo192.png
│   ├─ logo512.png
│   ├─ manifest.json
│   └─ favicon.ico
├─ service                     # Backend service code
│   ├─ database.js
│   ├─ index.js
│   ├─ package-lock.json
│   ├─ package.json
│   └─ peerProxy.js
└─ src                         # Frontend React code
    ├─ App.js                 # Top level component
    ├─ App.css
    ├─ downloadAndDelete.jst
    ├─ index.css
    ├─ index.js
    ├─ logo.svg
    ├─ about                   # About component
    │   └─ about.jsx
    ├─ login                   # Login component
    │   ├─ login.jsx           # Renders auth sub-components
    │   ├─ authState.js        # Enum for auth state
    │   ├─ unauthenticated.jsx # Renders if unauthenticated
    │   ├─ authenticated.jsx   # Renders if authenticated
    │   ├─ authenticated.css
    │   └─ messageDialog.jsx
    ├─ history                 # history component
    │   ├─ history.jsx
    ├─ explore                 # explore component
    │   ├─ explore.jsx
    └─ generate                 # generate component
        └─ generate.jsx
