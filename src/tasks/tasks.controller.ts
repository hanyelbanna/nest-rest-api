import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe) getTasksFilterDto: GetTasksFilterDto,
  ): Task[] {
    if (Object.keys(getTasksFilterDto).length) {
      return this.tasksService.getTasksWithFilters(getTasksFilterDto);
    } else {
      return this.tasksService.getAllTasks();
    }
  }

  @Get('/:id')
  gettaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createtask(@Body() createtaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createtaskDto);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Task {
    return this.tasksService.updateTaskStatus(id, status);
  }

  @Delete('/:id')
  deletetask(@Param('id') id: string): void {
    this.tasksService.deleteTask(id);
  }
}
