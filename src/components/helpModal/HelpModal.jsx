import React from "react";
import "./HelpModal.css";

export const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="help-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Справка по приложению</h2>
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
        <button className="close-button" onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  );
};