import { Project } from './project.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectStatus } from './project-status.enum';
import { GetProjectsFilterDto } from './dto/get-projects-filter.dto';
import { User } from '../auth/user.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(Project)
export class ProjectRepository extends Repository<Project> {
  private logger = new Logger('ProjectRepository');

  async getProjects(
    getProjectsFilterDto: GetProjectsFilterDto,
    user: User,
  ): Promise<Project[]> {
    const { status, search } = getProjectsFilterDto;
    // createQueryBuilder is a method of Repository class
    const query = this.createQueryBuilder('project');

    query.where('project.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('project.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(project.title LIKE :search OR project.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    try {
      const projects = await query.getMany();
      return projects;
    } catch (error) {
      this.logger.error(
        `Failed to get projects for user "${
          user.username
        }". Filters: ${JSON.stringify(getProjectsFilterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createProject(
    createProjectDto: CreateProjectDto,
    user: User,
  ): Promise<Project> {
    const { title, description } = createProjectDto;

    const project = new Project();
    project.title = title;
    project.description = description;
    project.status = ProjectStatus.OPEN;
    project.user = user;

    try {
      await project.save();
    } catch (error) {
      this.logger.error(
        `Failed to create a project for user "${user.username}". Data: ${createProjectDto}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    delete project.user;

    return project;
  }
}
