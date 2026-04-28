import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLBoolean } from 'graphql';
import { AnswerInput } from './dto/answer.input';
import { QuestionInput } from './dto/question.input';
import { FormEntity } from './entities/form.entity';
import { ResponseEntity } from './entities/response.entity';
import { FormsService } from './forms.service';

@Resolver()
export class FormsResolver {
  constructor(private readonly formsService: FormsService) {}

  @Query(() => [FormEntity])
  forms(): FormEntity[] {
    return this.formsService.findAllForms();
  }

  @Query(() => FormEntity, { nullable: true })
  form(@Args('id', { type: () => ID }) id: string): FormEntity | null {
    return this.formsService.findFormById(id);
  }

  @Query(() => [ResponseEntity])
  responses(@Args('formId', { type: () => ID }) formId: string): ResponseEntity[] {
    return this.formsService.findResponsesByFormId(formId);
  }

  @Mutation(() => FormEntity)
  createForm(
    @Args('title', { type: () => String }) title: string,
    @Args('description', { type: () => String, nullable: true }) description?: string,
    @Args('questions', { type: () => [QuestionInput], nullable: true })
    questions?: QuestionInput[] | null,
  ): FormEntity {
    return this.formsService.createForm({ title, description, questions });
  }

  @Mutation(() => GraphQLBoolean)
  deleteForm(@Args('id', { type: () => ID }) id: string): boolean {
    return this.formsService.deleteForm(id);
  }

  @Mutation(() => ResponseEntity)
  submitResponse(
    @Args('formId', { type: () => ID }) formId: string,
    @Args('answers', { type: () => [AnswerInput], nullable: true })
    answers?: AnswerInput[] | null,
  ): ResponseEntity {
    return this.formsService.submitResponse(formId, answers ?? []);
  }
}
