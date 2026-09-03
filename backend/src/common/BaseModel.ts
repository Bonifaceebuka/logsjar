import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Generated,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

export abstract class BaseModel {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column({unique: true})
    @Generated('uuid')
    uuid!: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn({ nullable: true })
    updated_at?: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at?: Date;
}