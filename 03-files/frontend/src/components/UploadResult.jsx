export default function UploadResult({ result }) {
  if (!result) {
    return (
      <section className="card stack">
        <h2>2. Результат с сервера</h2>
        <p className="muted">Здесь появится миниатюра, которую создал Pillow.</p>
      </section>
    );
  }

  return (
    <section className="card stack">
      <h2>2. Результат с сервера</h2>
      <div className="notice ok">Файл загружен, миниатюра создана.</div>
      <img src={result.thumbnail_url} alt="Миниатюра с сервера" className="thumb" width={result.thumbnail_width} height={result.thumbnail_height} />
      <dl className="facts">
        <dt>Оригинал</dt>
        <dd>{result.width} × {result.height}</dd>
        <dt>Миниатюра</dt>
        <dd>{result.thumbnail_width} × {result.thumbnail_height}</dd>
        <dt>thumbnail_url</dt>
        <dd><a href={result.thumbnail_url} target="_blank" rel="noreferrer">{result.thumbnail_url}</a></dd>
        <dt>url</dt>
        <dd><a href={result.url} target="_blank" rel="noreferrer">{result.url}</a></dd>
      </dl>
    </section>
  );
}
