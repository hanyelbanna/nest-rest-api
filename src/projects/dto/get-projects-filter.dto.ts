import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';
import { ProjectStatus } from '../project-status.enum';

export class GetProjectsFilterDto {
  @IsOptional()
  @IsIn([ProjectStatus.OPEN, ProjectStatus.IN_PROGRESS, ProjectStatus.DONE])
  status: ProjectStatus;

  @IsOptional() // you can not add it
  @IsNotEmpty() // if you add it, it should not be empty
  search: string;
}
