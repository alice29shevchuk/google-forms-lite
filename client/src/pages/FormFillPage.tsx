import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import './pageStyles.css';
import { QT } from '../domain/questionType';
import { useFormQuery, type FormQuery } from '../store/generated/graphql';
import { useFillFormState } from '../hooks/useFillFormState';
import { validateFillAnswers } from '../features/formFill/validateFormFill';
import { buildAnswerInputs } from '../services/buildAnswerInputs';
import { useSubmitResponseWithRefetch } from '../services/useSubmitResponseWithRefetch';
import { serializeRequestError } from '../services/errorMessage';
import { setSubmitSuccessFlash } from '../services/submitSuccessFlash';

type FormLoaded = NonNullable<FormQuery['form']>;

function FormFillLoaded({
  form,
  formId,
}: {
  form: FormLoaded;
  formId: string;
}) {
  const navigate = useNavigate();
  const fill = useFillFormState(form);
  const [submitResponse, { isLoading: submitting, error: submitErr }] =
    useSubmitResponseWithRefetch(formId);
  const [clientErr, setClientErr] = useState<string | null>(null);

  const onSubmit = async () => {
    setClientErr(null);
    const questions = [...form.questions].sort((a, b) => a.order - b.order);
    const err = validateFillAnswers(
      questions,
      (qid) => fill.textById[qid] ?? '',
      (qid) => fill.dateById[qid] ?? '',
      (qid) => fill.singleById[qid],
      (qid) => fill.multiById[qid] ?? [],
    );
    if (err) {
      setClientErr(err);
      return;
    }
    try {
      const answers = buildAnswerInputs(
        form,
        fill.textById,
        fill.dateById,
        fill.singleById,
        fill.multiById,
      );
      await submitResponse({ formId, answers });
      fill.reset();
      setSubmitSuccessFlash('Форму успішно надіслано. Дякуємо!');
      navigate('/', { replace: true });
    } catch (e) {
      setClientErr(serializeRequestError(e));
    }
  };

  const serverMsg = submitErr ? serializeRequestError(submitErr) : null;

  return (
    <section>
      <h1 className="page-title">{form.title}</h1>
      {form.description ? <p className="muted">{form.description}</p> : null}

      {clientErr ? (
        <div className="error-banner" role="alert">
          {clientErr}
        </div>
      ) : null}
      {serverMsg ? (
        <div className="error-banner" role="alert">
          {serverMsg}
        </div>
      ) : null}

      <div className="card" style={{ marginTop: '1rem' }}>
        {[...form.questions]
          .sort((a, b) => a.order - b.order)
          .map((q) => (
            <div key={q.id} className="question-block">
              <div className="form-row">
                <label>{q.prompt}</label>
              </div>
              {q.type === QT.Text ? (
                <input
                  type="text"
                  value={fill.textById[q.id] ?? ''}
                  onChange={(e) => fill.setText(q.id, e.target.value)}
                  aria-required
                />
              ) : null}
              {q.type === QT.Date ? (
                <input
                  type="date"
                  value={fill.dateById[q.id] ?? ''}
                  onChange={(e) => fill.setDate(q.id, e.target.value)}
                  aria-required
                />
              ) : null}
              {q.type === QT.MultipleChoice && q.options ? (
                <div>
                  {q.options.map((opt) => (
                    <div key={opt} className="option-row">
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={opt}
                        checked={(fill.singleById[q.id] ?? '') === opt}
                        onChange={() => fill.setSingle(q.id, opt)}
                      />
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              ) : null}
              {q.type === QT.Checkbox && q.options ? (
                <div>
                  {q.options.map((opt) => (
                    <div key={opt} className="option-row">
                      <input
                        type="checkbox"
                        checked={(fill.multiById[q.id] ?? []).includes(opt)}
                        onChange={(e) => fill.toggleMulti(q.id, opt, e.target.checked)}
                      />
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
      </div>

      <button
        type="button"
        className="primary-btn"
        disabled={submitting}
        onClick={() => void onSubmit()}
      >
        {submitting ? 'Надсилання…' : 'Надіслати'}
      </button>
    </section>
  );
}

export function FormFillPage() {
  const { id } = useParams<{ id: string }>();
  const formId = id ?? '';
  const { data, isLoading, isError, error } = useFormQuery({ id: formId }, { skip: !formId });
  const form = data?.form ?? null;

  if (!formId) {
    return <div className="error-banner">Некоректне посилання.</div>;
  }

  if (isLoading) {
    return <p className="loading">Завантаження форми…</p>;
  }

  if (isError || !form) {
    return (
      <div className="error-banner" role="alert">
        {serializeRequestError(error)}
      </div>
    );
  }

  return <FormFillLoaded key={form.id} form={form} formId={formId} />;
}
