import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Roles } from './roles.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;
  @Column({ unique: true, nullable: false })
  cedula: string;
  @Column()
  name: string;
  @Column()
  lastname: string;
  @Column({ nullable: true })
  phone: string;
  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: false, select: false })
  password: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Roles, (role) => role.users, {
    eager: true,
  })
  @JoinColumn({ name: 'roleId' })
  role: Roles;
}
