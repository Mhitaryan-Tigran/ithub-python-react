import { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import UploadResult from './components/UploadResult';
import './app.css';

export default function App() {
  const [result, setResult] = useState(null);

  return (
    <main className="page wide">
      <p className="eyebrow">Тема 3.3 · FastAPI + Pillow + StaticFiles</p>
      <h1>Загрузка изображений</h1>
      <p className="lead">Выбор с предпросмотром, отправка через FormData и Axios с прогрессом, миниатюра от сервера по полному URL.</p>
      <div className="grid">
        <ImageUploader onUploaded={setResult} />
        <UploadResult result={result} />
      </div>
    </main>
  );
}
