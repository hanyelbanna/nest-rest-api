import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ProjectStatus } from '../project-status.enum';

export class ProjectStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    ProjectStatus.OPEN,
    ProjectStatus.IN_PROGRESS,
    ProjectStatus.DONE,
  ];

  transform(value: any) {
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`"${value}" is an invalid status`);
    }

    return value;
  }

  private isStatusValid(status: any) {
    const idx = this.allowedStatuses.indexOf(status); // if return -1 then index not found
    return idx !== -1;
  }
}
