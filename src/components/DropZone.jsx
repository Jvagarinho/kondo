import React, { useState, useCallback, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// Ícones SVG
const Icons = {
  upload: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  file: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  image: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  pdf: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M9 13v6M12 13v6M15 13v6" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  )
};

// Helpers
const getFileIcon = (file) => {
  if (file.type.startsWith('image/')) return Icons.image;
  if (file.type === 'application/pdf') return Icons.pdf;
  return Icons.file;
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const DropZone = ({
  onUpload,
  acceptedTypes = ['*'],
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 5,
  multiple = true,
  disabled = false
}) => {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState([]);
  const inputRef = useRef(null);

  // Validação de arquivo
  const validateFile = (file) => {
    const newErrors = [];
    
    // Verificar tamanho
    if (file.size > maxSize) {
      newErrors.push(t('upload.error.size', { name: file.name, size: formatFileSize(maxSize) }));
    }
    
    // Verificar tipo
    if (acceptedTypes[0] !== '*' && !acceptedTypes.some(type => {
      if (type.includes('*')) {
        return file.type.startsWith(type.replace('/*', ''));
      }
      return file.type === type;
    })) {
      newErrors.push(t('upload.error.type', { name: file.name }));
    }
    
    return newErrors;
  };

  // Adicionar arquivos
  const addFiles = (newFiles) => {
    setErrors([]);
    const validFiles = [];
    const newErrors = [];

    // Verificar limite de arquivos
    if (files.length + newFiles.length > maxFiles) {
      newErrors.push(t('upload.error.maxFiles', { max: maxFiles }));
    }

    Array.from(newFiles).slice(0, maxFiles - files.length).forEach(file => {
      const fileErrors = validateFile(file);
      if (fileErrors.length === 0) {
        validFiles.push({
          file,
          id: Math.random().toString(36).substr(2, 9),
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
          status: 'pending'
        });
      } else {
        newErrors.push(...fileErrors);
      }
    });

    setFiles(prev => [...prev, ...validFiles]);
    if (newErrors.length > 0) {
      setErrors(newErrors);
    }
  };

  // Remover arquivo
  const removeFile = (id) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  // Upload de arquivos
  const handleUpload = async () => {
    if (files.length === 0 || uploading) return;

    setUploading(true);
    setUploadProgress({});

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Simular progresso
        setUploadProgress(prev => ({ ...prev, [file.id]: 0 }));
        
        // Simular upload progressivo
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => ({
            ...prev,
            [file.id]: Math.min((prev[file.id] || 0) + 10, 90)
          }));
        }, 100);

        await onUpload(file.file);

        clearInterval(progressInterval);
        setUploadProgress(prev => ({ ...prev, [file.id]: 100 }));
        
        // Marcar como completo
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'completed' } : f
        ));
      }

      // Limpar após sucesso
      setTimeout(() => {
        setFiles([]);
        setUploadProgress({});
      }, 1500);

    } catch (error) {
      console.error('Upload error:', error);
      setErrors([t('upload.error.generic')]);
    } finally {
      setUploading(false);
    }
  };

  // Eventos de drag and drop
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (!disabled && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  }, [disabled]);

  const handleInputChange = (e) => {
    if (e.target.files.length > 0) {
      addFiles(e.target.files);
    }
  };

  return (
    <div className="dropzone-container">
      {/* Área de Drop */}
      <div
        className={`dropzone-area ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''} ${files.length > 0 ? 'has-files' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleInputChange}
          disabled={disabled}
          style={{ display: 'none' }}
        />
        
        <div className="dropzone-content">
          <div className={`dropzone-icon ${isDragging ? 'bounce' : ''}`}>
            {Icons.upload}
          </div>
          <p className="dropzone-text">
            {isDragging 
              ? t('upload.dropHere') 
              : t('upload.dragDrop')
            }
          </p>
          <p className="dropzone-hint">
            {t('upload.orClick')} • {t('upload.maxSize', { size: formatFileSize(maxSize) })}
          </p>
        </div>
      </div>

      {/* Mensagens de erro */}
      {errors.length > 0 && (
        <div className="dropzone-errors">
          {errors.map((error, index) => (
            <div key={index} className="dropzone-error">
              <span className="dropzone-error-icon">{Icons.error}</span>
              {error}
            </div>
          ))}
        </div>
      )}

      {/* Lista de arquivos */}
      {files.length > 0 && (
        <div className="dropzone-files">
          <h4 className="dropzone-files-title">
            {t('upload.selectedFiles')} ({files.length})
          </h4>
          
          {files.map((file) => (
            <div key={file.id} className={`dropzone-file ${file.status}`}>
              {/* Preview ou Ícone */}
              <div className="dropzone-file-preview">
                {file.preview ? (
                  <img src={file.preview} alt={file.file.name} />
                ) : (
                  getFileIcon(file.file)
                )}
              </div>

              {/* Info */}
              <div className="dropzone-file-info">
                <p className="dropzone-file-name" title={file.file.name}>
                  {file.file.name}
                </p>
                <p className="dropzone-file-size">
                  {formatFileSize(file.file.size)}
                </p>
                
                {/* Barra de progresso */}
                {uploading && uploadProgress[file.id] !== undefined && (
                  <div className="dropzone-progress">
                    <div 
                      className="dropzone-progress-bar"
                      style={{ width: `${uploadProgress[file.id]}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Ações */}
              <div className="dropzone-file-actions">
                {file.status === 'completed' ? (
                  <span className="dropzone-file-success">{Icons.check}</span>
                ) : !uploading ? (
                  <button
                    type="button"
                    className="dropzone-file-remove"
                    onClick={() => removeFile(file.id)}
                    title={t('upload.remove')}
                  >
                    {Icons.close}
                  </button>
                ) : null}
              </div>
            </div>
          ))}

          {/* Botão de Upload */}
          <button
            type="button"
            className="btn-primary dropzone-upload-btn"
            onClick={handleUpload}
            disabled={uploading || files.every(f => f.status === 'completed')}
          >
            {uploading ? (
              <>
                <span className="spinner-small" />
                {t('upload.uploading')}
              </>
            ) : files.every(f => f.status === 'completed') ? (
              <>
                {Icons.check}
                {t('upload.completed')}
              </>
            ) : (
              <>
                {Icons.upload}
                {t('upload.upload')} ({files.length})
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default DropZone;
