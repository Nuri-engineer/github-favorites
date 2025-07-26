import React, { useEffect, useRef } from "react";
import "./HelpModal.css";

export const HelpModal = ({ isOpen, onClose }) => {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div className="help-modal" onClick={(e) => e.stopPropagation()}>
        <h2 id="help-modal-title">Справка по приложению</h2>
        <div className="help-content">
          <h3>Как использовать:</h3>
          <ul>
            <li>Введите запрос в поле поиска для поиска репозиториев</li>
            <li>Перетаскивайте репозитории в колонку "Избранное"</li>
            <li>Кликните на репозиторий для просмотра деталей</li>
          </ul>
          <h3>Горячие клавиши:</h3>
          <ul>
            <li>Enter - выполнить поиск</li>
            <li>Esc - закрыть модальное окно</li>
          </ul>
        </div>
        <button className="close-button" onClick={onClose} ref={closeButtonRef}>
          Закрыть
        </button>
      </div>
    </div>
  );
};
