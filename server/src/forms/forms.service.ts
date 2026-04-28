import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { QuestionType } from './enums/question-type.enum';
import type { AnswerInput } from './dto/answer.input';
import type { QuestionInput } from './dto/question.input';
import type { FormEntity } from './entities/form.entity';
import type { ResponseEntity } from './entities/response.entity';
import type { StoredForm, StoredQuestion, StoredResponse } from './forms.types';

@Injectable()
export class FormsService {
  private readonly forms = new Map<string, StoredForm>();
  private readonly responses: StoredResponse[] = [];

  findAllForms(): FormEntity[] {
    return [...this.forms.values()].map((f) => this.toFormEntity(f));
  }

  findFormById(id: string): FormEntity | null {
    const form = this.forms.get(id);
    return form ? this.toFormEntity(form) : null;
  }

  findResponsesByFormId(formId: string): ResponseEntity[] {
    if (!this.forms.has(formId)) {
      throw new NotFoundException(`Form not found: ${formId}`);
    }
    return this.responses
      .filter((r) => r.formId === formId)
      .map((r) => this.toResponseEntity(r));
  }

  createForm(input: {
    title: string;
    description?: string | null;
    questions?: QuestionInput[] | null;
  }): FormEntity {
    const title = input.title.trim();
    if (!title) {
      throw new BadRequestException('Title is required');
    }

    const rawQuestions = input.questions ?? [];
    const questions = this.normalizeAndValidateQuestions(rawQuestions);

    const id = randomUUID();
    const stored: StoredForm = {
      id,
      title,
      description: input.description?.trim() || undefined,
      questions,
    };
    this.forms.set(id, stored);
    return this.toFormEntity(stored);
  }

  deleteForm(id: string): boolean {
    if (!this.forms.has(id)) {
      throw new NotFoundException(`Form not found: ${id}`);
    }
    this.forms.delete(id);
    let i = this.responses.length;
    while (i--) {
      if (this.responses[i].formId === id) {
        this.responses.splice(i, 1);
      }
    }
    return true;
  }

  submitResponse(formId: string, answers: AnswerInput[]): ResponseEntity {
    const storedForm = this.forms.get(formId);
    if (!storedForm) {
      throw new NotFoundException(`Form not found: ${formId}`);
    }

    const byQuestionId = new Map(storedForm.questions.map((q) => [q.id, q]));
    const storedAnswers: StoredResponse['answers'] = [];

    for (const answer of answers) {
      const q = byQuestionId.get(answer.questionId);
      if (!q) {
        throw new BadRequestException(`Unknown question id: ${answer.questionId}`);
      }
      storedAnswers.push(this.validateAnswerForQuestion(q, answer));
    }

    const response: StoredResponse = {
      id: randomUUID(),
      formId,
      answers: storedAnswers,
    };
    this.responses.push(response);
    return this.toResponseEntity(response);
  }

  private normalizeAndValidateQuestions(raw: QuestionInput[]): StoredQuestion[] {
    const sorted = [...raw].sort((a, b) => a.order - b.order);
    const result: StoredQuestion[] = [];

    for (const q of sorted) {
      const prompt = q.prompt.trim();
      if (!prompt) {
        throw new BadRequestException('Each question must have a non-empty prompt');
      }

      const options = q.options?.map((o) => o.trim()).filter((o) => o.length > 0) ?? [];

      if (q.type === QuestionType.MULTIPLE_CHOICE || q.type === QuestionType.CHECKBOX) {
        if (options.length < 2) {
          throw new BadRequestException(
            `${q.type} questions require at least two non-empty options`,
          );
        }
      } else if (options.length > 0) {
        throw new BadRequestException(`Options are not allowed for ${q.type} questions`);
      }

      result.push({
        id: randomUUID(),
        order: q.order,
        type: q.type,
        prompt,
        options: options.length > 0 ? options : undefined,
      });
    }

    return result;
  }

  private validateAnswerForQuestion(
    q: StoredQuestion,
    answer: AnswerInput,
  ): StoredResponse['answers'][number] {
    switch (q.type) {
      case QuestionType.TEXT: {
        const text = answer.textValue?.trim() ?? '';
        if (!text) {
          throw new BadRequestException(`Text answer required for question ${q.id}`);
        }
        if (answer.selectedOptions?.length || answer.dateValue) {
          throw new BadRequestException(`Invalid payload for TEXT question ${q.id}`);
        }
        return { questionId: q.id, textValue: text };
      }
      case QuestionType.DATE: {
        const dateValue = answer.dateValue?.trim() ?? '';
        if (!dateValue) {
          throw new BadRequestException(`Date answer required for question ${q.id}`);
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
          throw new BadRequestException(`Date must be YYYY-MM-DD for question ${q.id}`);
        }
        if (answer.textValue || answer.selectedOptions?.length) {
          throw new BadRequestException(`Invalid payload for DATE question ${q.id}`);
        }
        return { questionId: q.id, dateValue };
      }
      case QuestionType.MULTIPLE_CHOICE: {
        const opts = answer.selectedOptions ?? [];
        if (opts.length !== 1) {
          throw new BadRequestException(
            `Exactly one option required for MULTIPLE_CHOICE question ${q.id}`,
          );
        }
        const v = opts[0];
        if (!q.options?.includes(v)) {
          throw new BadRequestException(`Invalid option for question ${q.id}`);
        }
        if (answer.textValue || answer.dateValue) {
          throw new BadRequestException(`Invalid payload for MULTIPLE_CHOICE question ${q.id}`);
        }
        return { questionId: q.id, selectedOptions: [v] };
      }
      case QuestionType.CHECKBOX: {
        const opts = answer.selectedOptions ?? [];
        if (opts.length < 1) {
          throw new BadRequestException(
            `At least one option required for CHECKBOX question ${q.id}`,
          );
        }
        const set = new Set(q.options ?? []);
        for (const o of opts) {
          if (!set.has(o)) {
            throw new BadRequestException(`Invalid option for question ${q.id}`);
          }
        }
        if (answer.textValue || answer.dateValue) {
          throw new BadRequestException(`Invalid payload for CHECKBOX question ${q.id}`);
        }
        return { questionId: q.id, selectedOptions: [...opts] };
      }
      default: {
        const _exhaustive: never = q.type;
        throw new BadRequestException(`Unsupported question type: ${_exhaustive}`);
      }
    }
  }

  private toFormEntity(stored: StoredForm): FormEntity {
    const questions = [...stored.questions]
      .sort((a, b) => a.order - b.order)
      .map((q) => ({
        id: q.id,
        order: q.order,
        type: q.type,
        prompt: q.prompt,
        options: q.options ?? null,
      }));
    return {
      id: stored.id,
      title: stored.title,
      description: stored.description ?? null,
      questions,
    };
  }

  private toResponseEntity(stored: StoredResponse): ResponseEntity {
    return {
      id: stored.id,
      formId: stored.formId,
      answers: stored.answers.map((a) => ({
        questionId: a.questionId,
        textValue: a.textValue ?? null,
        selectedOptions: a.selectedOptions ?? null,
        dateValue: a.dateValue ?? null,
      })),
    };
  }
}
