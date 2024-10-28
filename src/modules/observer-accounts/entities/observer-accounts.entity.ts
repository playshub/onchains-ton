import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'observer_accounts' })
export class ObserverAccountsEntity {
  @PrimaryColumn()
  address: string;

  @Column()
  name: string;

  @Column()
  lastTxLt: string;

  @Column()
  lastTxHash: string;

  @Column()
  stopped: boolean;
}
