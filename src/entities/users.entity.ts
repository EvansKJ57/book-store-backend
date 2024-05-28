import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum TProvider {
  local = 'LOCAL',
  google = 'GOOGLE',
}

@Entity()
export class UsersModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  nickname: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  // @Column('enum', { enum: TProvider, default: TProvider.local })
  // provider: TProvider;

  // @Column({ default: null })
  // provider_sub: string | null;
}
