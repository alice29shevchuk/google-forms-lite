import { useNavigate } from 'react-router-dom';
import './pageStyles.css';
import '../components/builder/formBuilderQuestions.css';
import { formBuilderActions } from '../features/formBuilder/formBuilderSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { draftQuestionsToInputs } from '../services/formBuilderMap';
import { validateBuilderDraft } from '../services/validateBuilderDraft';
import { isChoiceQuestionType, QUESTION_TYPE_OPTIONS } from '../domain/questionType';
import { useCreateFormWithFormsRefetch } from '../services/useCreateFormWithFormsRefetch';
import type { QuestionType } from '../store/generated/graphql';
import { useState } from 'react';
import { TrashIcon } from '../components/icons/TrashIcon';
import { ignoreError } from '../utils/ignoreError';

export function FormBuilderPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const builder = useAppSelector((s) => s.formBuilder);
  const [clientError, setClientError] = useState<string | null>(null);
  const [createForm, { isLoading, error: saveError }] = useCreateFormWithFormsRefetch();

  const validationMessage = validateBuilderDraft(builder);

  const onSave = async () => {
    setClientError(null);
    const v = validateBuilderDraft(builder);
    if (v) {
      setClientError(v);
      return;
    }
    try {
      await createForm({
        title: builder.title.trim(),
        description: builder.description.trim() || undefined,
        questions: draftQuestionsToInputs(builder.questions),
      });
      dispatch(formBuilderActions.resetBuilder());
      navigate('/');
    } catch (err: unknown) {
      ignoreError(err);
    }
  };

  const errMsg =
    clientError ||
    (saveError && typeof saveError === 'object' && 'message' in saveError && typeof saveError.message === 'string'
      ? saveError.message
      : null);

  return (
    <section>
      <h1 className="page-title">Нова форма</h1>
      {errMsg ? (
        <div className="error-banner" role="alert">
          {errMsg}
        </div>
      ) : null}
      <div className="card">
        <div className="form-row">
          <label htmlFor="ftitle">Заголовок</label>
          <input
            id="ftitle"
            type="text"
            value={builder.title}
            onChange={(e) => dispatch(formBuilderActions.setTitle(e.target.value))}
            placeholder="Наприклад, Опитування задоволеності"
          />
        </div>
        <div className="form-row">
          <label htmlFor="fdesc">Опис</label>
          <textarea
            id="fdesc"
            value={builder.description}
            onChange={(e) => dispatch(formBuilderActions.setDescription(e.target.value))}
            placeholder="Коротко опишіть форму…"
          />
        </div>
      </div>

      <div className="toolbar builder-add-question">
        <button
          type="button"
          className="primary-btn"
          onClick={() => dispatch(formBuilderActions.addQuestion(undefined))}
        >
          Додати питання
        </button>
      </div>

      {builder.questions.map((q) => (
        <div key={q.localId} className="question-block builder-q">
          <div className="builder-q-head">
            <span className="muted">Питання {q.order + 1}</span>
            <div className="inline-actions">
              <button
                type="button"
                className="ghost-btn"
                aria-label="Вгору"
                onClick={() =>
                  dispatch(formBuilderActions.moveQuestion({ localId: q.localId, direction: 'up' }))
                }
              >
                ↑
              </button>
              <button
                type="button"
                className="ghost-btn"
                aria-label="Вниз"
                onClick={() =>
                  dispatch(formBuilderActions.moveQuestion({ localId: q.localId, direction: 'down' }))
                }
              >
                ↓
              </button>
              <button
                type="button"
                className="ghost-btn builder-q-delete"
                aria-label="Видалити питання"
                title="Видалити питання"
                onClick={() => dispatch(formBuilderActions.removeQuestion(q.localId))}
              >
                <TrashIcon />
              </button>
            </div>
          </div>

          <div className="form-row builder-q-type-row">
            <label htmlFor={`t-${q.localId}`}>Тип відповіді</label>
            <select
              id={`t-${q.localId}`}
              value={q.type ?? ''}
              onChange={(e) => {
                const v = e.target.value;
                dispatch(
                  formBuilderActions.setQuestionType({
                    localId: q.localId,
                    type: v === '' ? null : (v as QuestionType),
                  }),
                );
              }}
            >
              <option value="">— Оберіть тип відповіді —</option>
              {QUESTION_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label htmlFor={`p-${q.localId}`}>Текст запитання</label>
            <input
              id={`p-${q.localId}`}
              type="text"
              value={q.prompt}
              onChange={(e) =>
                dispatch(
                  formBuilderActions.updateQuestion({
                    localId: q.localId,
                    patch: { prompt: e.target.value },
                  }),
                )
              }
            />
          </div>

          {isChoiceQuestionType(q.type) && (
            <>
              {q.options.map((opt, idx) => {
                const deleteDisabled = q.options.length <= 2;
                return (
                  <div key={`${q.localId}-o-${idx}`} className="option-row">
                    <input
                      type="text"
                      value={opt}
                      aria-label={`Варіант ${idx + 1}`}
                      onChange={(e) =>
                        dispatch(
                          formBuilderActions.updateOption({
                            localId: q.localId,
                            optionIndex: idx,
                            value: e.target.value,
                          }),
                        )
                      }
                    />
                    <button
                      type="button"
                      className="ghost-btn builder-option-delete"
                      title={
                        deleteDisabled ? 'Потрібно щонайменше два варіанти' : 'Видалити варіант'
                      }
                      aria-label="Видалити варіант"
                      disabled={deleteDisabled}
                      onClick={() =>
                        dispatch(
                          formBuilderActions.removeOption({
                            localId: q.localId,
                            optionIndex: idx,
                          }),
                        )
                      }
                    >
                      <TrashIcon />
                    </button>
                  </div>
                );
              })}
              <button
                type="button"
                className="ghost-btn builder-add-variant-btn"
                onClick={() => dispatch(formBuilderActions.addOption({ localId: q.localId }))}
              >
                + Варіант
              </button>
            </>
          )}
        </div>
      ))}

      <button
        type="button"
        className="primary-btn"
        disabled={isLoading || validationMessage !== null}
        onClick={() => void onSave()}
      >
        {isLoading ? 'Збереження…' : 'Зберегти форму'}
      </button>
    </section>
  );
}
