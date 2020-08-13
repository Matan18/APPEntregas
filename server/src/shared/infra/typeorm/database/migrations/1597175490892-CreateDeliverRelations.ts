import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class CreateDeliverRelations1597175490892 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKeys('delivers',
      [
        new TableForeignKey({
          name: 'DeliversStore',
          columnNames: ['store_id'],
          referencedTableName: 'stores',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        }),
        new TableForeignKey({
          name: 'DeliversDriver',
          columnNames: ['driver_id'],
          referencedTableName: 'drivers',
          referencedColumnNames: ['id'],
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        })
      ]
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('delivers','DeliversDriver');
    await queryRunner.dropForeignKey('delivers','DeliversStore');
  }

}
