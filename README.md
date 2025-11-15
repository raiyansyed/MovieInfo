# 🎬 MovieInfo  

A clean and beginner-friendly **movie search web app** built using **React**, **TailwindCSS**, and the **OMDb API**.  
Users can search for movies, view important details, and save their favorite titles — all inside a modern **dark-mode UI**.

🌐 **Live Demo:** https://movie-info-smoky-one.vercel.app/
📦 **Repository:** https://github.com/raiyansyed/MovieInfo

---

## 🚀 Features

- 🔍 **Search Movies** using the OMDb API  
- ⭐ **Favorites System** (persistent using LocalStorage)  
- 🌙 **Dark Mode UI** built with TailwindCSS  
- 📱 Fully **responsive** on all screen sizes  
- ⚡ **Fast and lightweight** React app deployed on Vercel  

---

## 🛠️ Tech Stack

| Technology     | Purpose                     |
|----------------|-----------------------------|
| **React.js**   | Frontend framework          |
| **TailwindCSS**| UI styling & dark mode      |
| **OMDb API**   | Movie data source           |
| **LocalStorage** | Save favorite movies     |
| **Vercel**     | Hosting & deployment        |

---

## 📸 Screenshots

> *(Add screenshots here later)*  
![Home Page](#)
![Favorites Page](#)






---

## 📂 Project Structure

```bash
MovieInfo/
├─ public/
├─ src/
│  ├─ assets/           # Static assets
│  ├─ components/       # Reusable components
│  │   ├─ MovieCard.jsx
│  │   └─ NavBar.jsx
│  ├─ context/          # Favorites context
│  │   └─ FavContext.jsx
│  ├─ pages/            # Home, Favorites pages
│  │   ├─ Home.jsx
│  │   └─ Favs.jsx
│  ├─ service/          # API utilities & suggestions
│  │   ├─ api.js
│  │   └─ suggestions.js
│  ├─ App.jsx           # Root App component
│  ├─ main.jsx          # Entry point
│  ├─ App.css
│  └─ index.css         # TailwindCSS imports
├─ .env
├─ .gitignore
├─ vite.config.js
├─ tailwind.config.js
├─ package.json
└─ README.md


```

---

## ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/raiyansyed/MovieInfo

# Navigate into the project
cd MovieInfo

# Install dependencies
npm install

# Run the development server
npm run dev

```

---


## Create a .env file in the project root and add:

```bash

VITE_API_KEY= #your_api_key_here

# You can request a free API key from: 
https://www.omdbapi.com/

```


