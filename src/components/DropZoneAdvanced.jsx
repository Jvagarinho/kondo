import React, { useState, useCallback, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// Basic icons
const Icons = {
  upload: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-label="upload">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  file: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-label="file">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  image: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-label="image">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  pdf: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-label="pdf">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M9 13v6M12 13v6M15 13v6" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-label="close">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-label="check">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-label="error">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  )
};

const formatFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return '';
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

const DropZoneAdvanced = ({ onUpload, acceptedTypes = ['*'], maxSize = 10 * 1024 * 1024, maxFiles = 5, multiple = true, disabled = false }) => {
  const { t } = useLanguage();
  const [files, setFiles] = useState([]); // { id, file, preview, status, progress, controller }
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState([]);
  const inputRef = useRef(null);

  const addFiles = (newFiles) => {
    const errs = [];
    if (files.length + newFiles.length > maxFiles) errs.push(t('upload.error.maxFiles', { max: maxFiles }));
    const toAdd = Array.from(newFiles).slice(0, maxFiles - files.length).map((f) => {
      // tipo (suporta tanto MIME quanto extensões como ".ext")
      const isMimeMatch = acceptedTypes[0] === '*' || acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return f.name.toLowerCase().endsWith(type.toLowerCase());
        }
        if (type.includes('*')) return f.type.startsWith(type.replace('/*',''));
        return f.type === type;
      });
      if (!isMimeMatch) {
        errs.push(t('upload.error.type', { name: f.name }));
        return null;
      }
      if (f.size > maxSize) {
        errs.push(t('upload.error.size', { name: f.name, size: formatFileSize(maxSize) }));
        return null;
      }
      return {
        id: Math.random().toString(36).slice(2,9),
        file: f,
        preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
        status: 'pending',
        progress: 0,
        controller: new AbortController()
      };
    }).filter(Boolean);
    if (toAdd.length) setFiles(prev => [...prev, ...toAdd]);
    if (errs.length) setErrors(errs);
  };

  const removeFile = (id) => {
    setFiles(prev => {
      const item = prev.find(p => p.id === id);
      if (item?.preview) URL.revokeObjectURL(item.preview);
      return prev.filter(p => p.id !== id);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragging(false);
    if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const onUploadClick = async (file, { signal } = {}) => {
    // Implemented by parent via onUpload, this is a placeholder for API compatibility
    if (typeof onUpload === 'function') {
      return onUpload(file, { signal });
    }
  };

  const handleUploadAll = async () => {
    if (files.length === 0 || uploading) return;
    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.status === 'completed') continue;
      try {
        const signal = f.controller.signal;
        // simple progress loop
        const interval = setInterval(() => {
          setFiles(prev => prev.map(p => p.id === f.id ? { ...p, progress: Math.min((p.progress||0)+10, 90) } : p));
        }, 150);
        await onUpload?.(f.file, { signal });
        clearInterval(interval);
        setFiles(prev => prev.map(p => p.id === f.id ? { ...p, status: 'completed', progress: 100 } : p));
      } catch (err) {
        if (f.controller?.signal?.aborted) {
          setFiles(prev => prev.map(p => p.id === f.id ? { ...p, status: 'cancelled', progress: 0 } : p));
        } else {
          setFiles(prev => prev.map(p => p.id === f.id ? { ...p, status: 'error', progress: 0 } : p));
        }
      }
    }
    setUploading(false);
  };

  return (
    <div className="dropzone-advanced" aria-label={t('upload.dropArea')}>
      <div className={`dropzone-area ${dragging ? 'dragging' : ''}`} onClick={handleClick} onDragEnter={() => setDragging(true)} onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleDrop}>
        <input ref={inputRef} type="file" multiple={multiple} accept={acceptedTypes.join(',')} onChange={(e) => { if (e.target.files?.length) addFiles(e.target.files); }} style={{ display: 'none' }} />
        <div className="dropzone-content">
          <div className="dropzone-icon"><span aria-label="upload icon">{Icons.upload}</span></div>
          <div className="dropzone-text">{dragging ? t('upload.dropHere') : t('upload.dragDrop')}</div>
          <div className="dropzone-hint">{t('upload.orClick')} • {t('upload.maxSize', { size: formatFileSize(maxSize) })}</div>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="dropzone-errors" role="alert">{errors.map((er, idx) => <div key={idx} className="dropzone-error">{ er }</div>)}</div>
      )}

      {files.length > 0 && (
        <div className="dropzone-files">
          {files.map((f) => (
            <div key={f.id} className={`dropzone-file ${f.status}`}>
              <div className="dropzone-file-preview">{f.preview ? <img src={f.preview} alt={f.file.name}/> : Icons.file}</div>
              <div className="dropzone-file-info" style={{ minWidth: 0 }}>
                <p className="dropzone-file-name" title={f.file.name}>{f.file.name}</p>
                <p className="dropzone-file-size">{formatFileSize(f.file.size)}</p>
                {f.progress !== undefined && (
                  <div className="dropzone-progress" aria-valuenow={f.progress} aria-valuemin={0} aria-valuemax={100}>
                    <div className="dropzone-progress-bar" style={{ width: `${f.progress || 0}%` }} />
                  </div>
                )}
              </div>
              <div className="dropzone-file-actions">
                {f.status !== 'completed' && (
                  <button className="dropzone-file-remove" onClick={() => f.controller?.abort()} title={t('upload.cancel')}>
                    {Icons.close}
                  </button>
                )}
                {f.status === 'completed' && (
                  <span className="dropzone-file-success" aria-label={t('upload.completed')}>{Icons.check}</span>
                )}
              </div>
            </div>
          ))}
          <button type="button" className="btn-primary dropzone-upload-btn" onClick={handleUploadAll} disabled={uploading || files.length === 0}>
            {uploading ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="spinner-small" /> {t('upload.uploading')}
              </span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                {Icons.upload} {t('upload.upload')} ({files.length})
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default DropZoneAdvanced;
