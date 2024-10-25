import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum WebhookStatusType {
  Pending = 'pending',
  Success = 'success',
  Failed = 'failed',
}

@Entity({ name: 'webhook_status' })
export class WebhookStatusEntity {
  @PrimaryColumn()
  hash: string;

  @Column({
    type: 'enum',
    enum: WebhookStatusType,
    default: WebhookStatusType.Pending,
  })
  status: WebhookStatusType;

  @Column({ type: 'int', default: 1 })
  attempts: number;
}
