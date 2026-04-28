import { Link } from 'react-router-dom';
import { useCallback, useState, type ReactNode } from 'react';
import './pageStyles.css';
import { useFormsQuery } from '../store/generated/graphql';
import { useDeleteFormWithFormsRefetch } from '../services/useDeleteFormWithFormsRefetch';
import { TrashIcon } from '../components/icons/TrashIcon';
import { SubmitSuccessToast } from '../components/SubmitSuccessToast';
import { clearSubmitSuccessFlash, getSubmitSuccessFlash } from '../services/submitSuccessFlash';

function graphqlError(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string') {
    return err.message;
  }
  return 'Сталася помилка при завантаженні.';
}

export function HomePage() {
  const { data, isLoading, isError, error } = useFormsQuery();
  const [deleteForm, { isLoading: isDeleting }] = useDeleteFormWithFormsRefetch();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(() => getSubmitSuccessFlash());

  const dismissToast = useCallback(() => {
    clearSubmitSuccessFlash();
    setToastMessage(null);
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (
      !window.confirm(
        `Видалити форму «${title}»? Усі відповіді також буде видалено. Цю дію неможливо скасувати.`,
      )
    ) {
      return;
    }
    setDeleteError(null);
    setDeletingId(id);
    try {
      await deleteForm({ id });
    } catch (e) {
      setDeleteError(graphqlError(e));
    } finally {
      setDeletingId(null);
    }
  };

  let main: ReactNode;

  if (isLoading) {
    main = <p className="loading">Завантаження форм…</p>;
  } else if (isError || !data) {
    main = (
      <div className="error-banner" role="alert">
        {graphqlError(error)}
      </div>
    );
  } else {
    const forms = data.forms;

    if (forms.length === 0) {
      main = (
        <section>
          <h1 className="page-title">Ваші форми</h1>
          {deleteError ? (
            <div className="error-banner" role="alert">
              {deleteError}
            </div>
          ) : null}
          <p className="muted">Поки що немає жодної форми.</p>
          <p style={{ marginTop: '1rem' }}>
            <Link to="/forms/new" className="primary-btn" style={{ display: 'inline-block' }}>
              Створити форму
            </Link>
          </p>
        </section>
      );
    } else {
      main = (
        <section>
          <h1 className="page-title">Ваші форми</h1>
          {deleteError ? (
            <div className="error-banner" role="alert">
              {deleteError}
            </div>
          ) : null}
          <p className="muted" style={{ marginBottom: '1.25rem' }}>
            Оберіть дію для кожної форми або{' '}
            <Link to="/forms/new">створіть нову</Link>.
          </p>
          <ul className="forms-list">
            {forms.map((f) => (
              <li key={f.id} className="card">
                <div className="forms-list-card-head">
                  <h2 style={{ margin: '0 0 0.35rem', fontSize: '1.2rem', color: '#1c2740' }}>
                    {f.title}
                  </h2>
                  <button
                    type="button"
                    className="ghost-btn forms-list-delete"
                    aria-label="Видалити форму"
                    title="Видалити форму"
                    disabled={isDeleting}
                    onClick={() => void handleDelete(f.id, f.title)}
                  >
                    {deletingId === f.id ? (
                      <span className="forms-list-delete-spinner" aria-hidden />
                    ) : (
                      <TrashIcon />
                    )}
                  </button>
                </div>
                {f.description ? (
                  <p className="muted" style={{ margin: '0 0 1rem' }}>
                    {f.description}
                  </p>
                ) : (
                  <p className="muted" style={{ margin: '0 0 1rem' }}>
                    Без опису
                  </p>
                )}
                <div className="link-row">
                  <Link to={`/forms/${f.id}/fill`}>Заповнити</Link>
                  <Link to={`/forms/${f.id}/responses`}>Відповіді</Link>
                </div>
              </li>
            ))}
          </ul>
        </section>
      );
    }
  }

  return (
    <>
      {main}
      <SubmitSuccessToast message={toastMessage} onDismiss={dismissToast} />
    </>
  );
}
