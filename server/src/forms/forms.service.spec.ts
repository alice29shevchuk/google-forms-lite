import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FormsService } from './forms.service';
import { QuestionType } from './enums/question-type.enum';

describe('FormsService', () => {
  let service: FormsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormsService],
    }).compile();

    service = module.get<FormsService>(FormsService);
  });

  it('deleteForm removes form and its responses', () => {
    const form = service.createForm({
      title: 'T',
      questions: [
        {
          order: 0,
          prompt: 'Q?',
          type: QuestionType.TEXT,
        },
      ],
    });

    service.submitResponse(form.id, [{ questionId: form.questions[0].id, textValue: 'a' }]);
    expect(service.findResponsesByFormId(form.id)).toHaveLength(1);

    expect(service.deleteForm(form.id)).toBe(true);
    expect(service.findFormById(form.id)).toBeNull();
    expect(service.findAllForms()).toHaveLength(0);
    expect(() => service.findResponsesByFormId(form.id)).toThrow(NotFoundException);
  });

  it('deleteForm throws when id unknown', () => {
    expect(() => service.deleteForm('00000000-0000-0000-0000-000000000000')).toThrow(NotFoundException);
  });
});
