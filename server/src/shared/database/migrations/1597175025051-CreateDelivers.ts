import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateDelivers1597175025051 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table(
      {
        name: 'delivers',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: "uuid",
            default: 'uuid_generate_v4()'
          },
          {
            name: 'key',
            type: 'varchar',
            isNullable: false,
            isUnique: false
          },
          {
            name: 'amount',
            type: 'integer',
            isNullable: false
          },
          {
            name: 'store_id',
            type: 'uuid',
            isNullable: false
          },
          {
            name: 'driver_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()'
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()'
          }
        ]
      }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('delivers');
  }

}
