Here’s a polished `README.md` file tailored for your **Speech Detector App** that uses a custom **FFT-based Gaussian DFT Speech Detection algorithm** with file uploads, drag-and-drop, and Chart.js visualizations:

---

```markdown
# 🎙️ Speech Detector App

A lightweight, client-side web app that detects speech segments from audio files using a **Gaussian-based DFT (Fast Fourier Transform)** algorithm.

<p align="center">
  <img src="https://img.shields.io/badge/tech-stack-blue?style=flat-square"/>
  <img src="https://img.shields.io/badge/react-18.x-blue?logo=react"/>
  <img src="https://img.shields.io/badge/typescript-4.x-blue?logo=typescript"/>
  <img src="https://img.shields.io/badge/chart.js-v4-red?logo=chartdotjs"/>
  <img src="https://img.shields.io/badge/vite-dev-yellow?logo=vite"/>
</p>

---

## ✨ Features

- 🎧 Upload or drag & drop audio files (`.wav`, `.mp3`, etc.)
- ⚡ Detects speech using optimized **Cooley-Tukey FFT**
- 📈 Visualizes log-likelihood and speech frames with Chart.js
- 🌙 Dark/light theme toggle (auto-saved)
- 🧠 Accurate noise vs. speech separation using Gaussian modeling

---

## 🖼️ Demo

> Coming soon: hosted link or demo GIF

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/speech-detector.git
cd speech-detector
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the App

```bash
npm run dev
```

Then open `http://localhost:5173` in your browser.

---

## 🧠 How It Works

- Splits audio into frames
- Applies optimized **Radix-2 Cooley-Tukey FFT**
- Calculates **Gaussian log-likelihood ratios**
- Detects frames with speech vs. non-speech based on likelihood threshold
- Visualizes the results

---

## 📁 Project Structure

```
├── public/              # Static files
├── src/
│   ├── lib/
│   │   └── AudioDetector.ts  # Gaussian DFT speech detector class
│   │   └── FFT.ts            # Custom FFT implementation
│   ├── App.tsx          # Main UI with Chart.js
│   └── index.tsx        # Entry point
├── package.json
└── README.md
```

---

## 📊 Visual Output

- **Log-Likelihood Plot**  
  Shows the Gaussian likelihood over time
- **Speech Frame Plot**  
  Indicates 0/1 for each frame — speech or not

---

## 🛠️ Built With

- [React](https://reactjs.org/)
- [Chart.js](https://www.chartjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)

---

## 🤝 Contributing

Pull requests and suggestions are welcome!

```bash
git checkout -b feature/yourFeature
git commit -m "Add your feature"
git push origin feature/yourFeature
```

---

## 🧪 TODO

- [ ] Add microphone input (real-time detection)
- [ ] Add exportable report / download of results
- [ ] Support longer audio file chunking
- [ ] Deploy with Vercel or Netlify

---

## 📜 License

MIT License © 2025 [Your Name]
```

---

Let me know if you'd like to add badges, a deployment guide (e.g., Netlify/Vercel), or images to the README. I can also generate a GIF preview or embed a live recording walkthrough!
