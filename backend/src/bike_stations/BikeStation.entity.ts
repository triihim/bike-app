import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'bike_stations' })
export class BikeStation {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  operator: string;

  @Column()
  capacity: number;

  @Column({ type: 'float' })
  x: number;

  @Column({ type: 'float' })
  y: number;
}
