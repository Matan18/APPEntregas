import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class CreateRelationDriverStore1597174881200 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey('drivers', new TableForeignKey(
      {
        name: 'DriversStore',
        columnNames: ['store_id'],
        referencedTableName: 'stores',
        referencedColumnNames: ['id']
      }
    ));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('drivers', 'DriversStore');
  }

}
