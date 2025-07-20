import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "./RepoModal.css";

const RepoModal = React.memo(function RepoModal({ isOpen, onRequestClose, repo }) {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (!repo) return;
    async function fetchDetails() {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${repo.owner.login}/${repo.name}`
        );
        const data = await res.json();
        setDetails(data);
      } catch (error) {
        console.error("Ошибка получения данных о репозитории", error);
        setDetails(null);
      }
    }
    fetchDetails();
  }, [repo]);

  if (!repo) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Информация о репозитории"
      className="repo-modal"
      overlayClassName="repo-modal__overlay"
    >
      <div className="repo-modal__content">
        <button className="repo-modal__close" onClick={onRequestClose}>
          Закрыть
        </button>
        <h2 className="repo-modal__title">{repo.full_name}</h2>
        <p className="repo-modal__desc">{repo.description}</p>
        {details ? (
          <ul className="repo-modal__list">
            <li>Владелец: {details.owner.login}</li>
            <li>Языки: {details.language}</li>
            <li>
              Дата создания: {new Date(details.created_at).toLocaleDateString()}
            </li>
            <li>Форки: {details.forks_count}</li>
            <li>Звёзды: {details.stargazers_count}</li>
          </ul>
        ) : (
          <p className="repo-modal__loading">Загрузка...</p>
        )}
      </div>
    </Modal>
  );
});

export default RepoModal;