import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BikeStation } from '../bike_stations/BikeStation.entity';

@Entity({ name: 'journeys' })
export class Journey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  departure: Date;

  @Column()
  return: Date;

  @Column({ name: 'departure_station_id' })
  @ManyToOne(() => BikeStation, (bikeStation) => bikeStation.id, {
    createForeignKeyConstraints: false,
    orphanedRowAction: 'delete',
  })
  departureStationId: number;

  @Column({ name: 'departure_station_name' })
  departureStationName: string;

  @Column({ name: 'return_station_id' })
  @ManyToOne(() => BikeStation, (bikeStation) => bikeStation.id, {
    createForeignKeyConstraints: false,
    orphanedRowAction: 'delete',
  })
  returnStationId: number;

  @Column({ name: 'return_station_name' })
  returnStationName: string;

  @Column({ name: 'covered_distance_in_meters' })
  coveredDistanceInMeters: number;

  @Column({ name: 'duration_in_seconds' })
  durationInSeconds: number;
}
