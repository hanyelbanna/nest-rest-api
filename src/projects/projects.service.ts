import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectRepository } from './project.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { ProjectStatus } from './project-status.enum';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetProjectsFilterDto } from './dto/get-projects-filter.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectRepository)
    private projectRepository: ProjectRepository,
  ) {}

  async getProjects(
    getProjectsFilterDto: GetProjectsFilterDto,
    user: User,
  ): Promise<Project[]> {
    return this.projectRepository.getProjects(getProjectsFilterDto, user);
  }

  async getProjectById(id: number, user: User): Promise<Project> {
    const found = await this.projectRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!found) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }

    return found;
  }

  async createProject(
    createProjectDto: CreateProjectDto,
    user: User,
  ): Promise<Project> {
    return this.projectRepository.createProject(createProjectDto, user);
  }

  async updateProjectStatus(
    id: number,
    status: ProjectStatus,
    user: User,
  ): Promise<Project> {
    const project = await this.getProjectById(id, user);
    project.status = status;
    await project.save();
    return project;
  }

  async deleteProject(id: number, user: User): Promise<void> {
    const result = await this.projectRepository.delete({ id, userId: user.id });

    if (result.affected === 0) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }
  }
}
