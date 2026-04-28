import { Link, useParams } from 'react-router-dom';
import './pageStyles.css';
import { useResponsesQuery, useFormQuery } from '../store/generated/graphql';
import { serializeRequestError } from '../services/errorMessage';

export function FormResponsesPage() {
  const { id } = useParams<{ id: string }>();
  const formId = id ?? '';

  const {
    data: formData,
    isLoading: formLoading,
  } = useFormQuery({ id: formId }, { skip: !formId });
  const form = formData?.form;

  const {
    data,
    isLoading: respLoading,
    isError,
    error,
  } = useResponsesQuery({ formId }, { skip: !formId });

  if (!formId) {
    return <div className="error-banner">Некоректне посилання.</div>;
  }

  if (respLoading || formLoading) {
    return <p className="loading">Завантаження…</p>;
  }

  if (isError || !data) {
    return (
      <div className="error-banner" role="alert">
        {serializeRequestError(error)}
      </div>
    );
  }

  const responses = data.responses;

  const questionPrompt = (qid: string): string =>
    form?.questions.find((q) => q.id === qid)?.prompt ?? qid.slice(0, 8);

  return (
    <section>
      <h1 className="page-title">Відповіді</h1>
      {form?.title ? <p className="muted">{form.title}</p> : null}
      <p className="muted" style={{ marginBottom: '1rem' }}>
        <Link to={`/forms/${formId}/fill`}>Заповнити форму</Link>
        {' · '}
        <Link to="/">Усі форми</Link>
      </p>

      {responses.length === 0 ? (
        <div className="card">
          <p className="muted">Ще немає жодної відповіді.</p>
        </div>
      ) : null}

      {responses.map((r) => (
        <article key={r.id} className="card">
          <h2 style={{ fontSize: '1rem', margin: '0 0 1rem', color: '#394352' }}>
            Відповідь <span className="muted">#{r.id.slice(0, 8)}</span>
          </h2>
          <ul className="resp-list">
            {[...r.answers].map((a) => (
              <li key={a.questionId}>
                <div className="resp-q">{questionPrompt(a.questionId)}</div>
                <div className="resp-a">
                  {a.textValue
                    ? a.textValue
                    : a.dateValue
                      ? a.dateValue
                      : a.selectedOptions?.length
                        ? a.selectedOptions.join(', ')
                        : '—'}
                </div>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}
