import {
  Controller,
  Param,
  ParseIntPipe,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  Delete,
  Patch,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectStatus } from './project-status.enum';
import { ProjectStatusValidationPipe } from './pipes/project-status-validation.pipe';
import { GetProjectsFilterDto } from './dto/get-projects-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('projects')
@UseGuards(AuthGuard())
export class ProjectsController {
  private logger = new Logger('ProjectsController');
  constructor(private projectsService: ProjectsService) {}

  @Get()
  getProjects(
    @Query(ValidationPipe) getProjectsFilterDto: GetProjectsFilterDto,
    @GetUser() user: User,
  ): Promise<Project[]> {
    this.logger.verbose(
      `User "${
        user.username
      }" retrieving all projects. Filters: ${JSON.stringify(
        getProjectsFilterDto,
      )}`,
    );
    return this.projectsService.getProjects(getProjectsFilterDto, user);
  }

  @Get('/:id')
  getprojectById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Project> {
    return this.projectsService.getProjectById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createproject(
    @Body() createprojectDto: CreateProjectDto,
    @GetUser() user: User,
  ): Promise<Project> {
    this.logger.verbose(
      `User "${user.username}" creating a new project. Data: ${JSON.stringify(
        CreateProjectDto,
      )}`,
    );
    return this.projectsService.createProject(createprojectDto, user);
  }

  @Patch('/:id/status')
  updateProjectStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', ProjectStatusValidationPipe) status: ProjectStatus,
    @GetUser() user: User,
  ): Promise<Project> {
    return this.projectsService.updateProjectStatus(id, status, user);
  }

  @Delete('/:id')
  deleteproject(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.projectsService.deleteProject(id, user);
  }
}
