import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { ProjectStatus } from './project-status.enum';
import { User } from '../auth/user.entity';

@Entity()
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: ProjectStatus;

  @ManyToOne(type => User, user => user.projects, { eager: false })
  user: User;

  @Column()
  userId: number;
}
