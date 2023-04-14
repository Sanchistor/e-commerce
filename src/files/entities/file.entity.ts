import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  AfterInsert,
  CreateDateColumn, ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';
import appConfig from '../../config/app.config';
import {Product} from "../../products/entities/product.entity";

@Entity({ name: 'file' })
export class FileEntity {
  @ApiProperty({ example: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Allow()
  @Column()
  path: string;

  @Column()
  name: string;

  @Column()
  size: string;

  @AfterInsert()
  async afterInsert() {
    if (this.path.indexOf('/') === 0) {
      this.path = appConfig().backendDomain + this.path;
    }
  }

  @Column({ nullable: true })
  type: string;

  @CreateDateColumn()
  uploadedAt: Date;

  @ManyToOne(() => Product, (product) => product.photo, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
