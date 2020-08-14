import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreatePackages1597175757143 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'packages',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: "uuid",
          default: 'uuid_generate_v4()'
        },
        {
          name: 'product',
          type: 'varchar',
          isNullable: false
        },
        {
          name: 'latitude',
          type: 'real',
          scale: 7,
          isNullable: false,
        },
        {
          name: 'longitude',
          type: 'real',
          scale: 7,
          isNullable: false,
        },
        {
          name: 'deliver_id',
          type: 'uuid',
          isNullable: false
        }
      ]
    }));
    await queryRunner.createForeignKey('packages', new TableForeignKey({
      name: 'PackagesDeliver',
      columnNames: ['deliver_id'],
      referencedTableName: 'delivers',
      referencedColumnNames: ['id']
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('packages', 'PackagesDeliver');
    await queryRunner.dropTable('packages');
  }

}
