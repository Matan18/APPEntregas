import {MigrationInterface, QueryRunner} from "typeorm";

export class StoreMigration1594059617314 implements MigrationInterface {
    name = 'StoreMigration1594059617314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "driver" ("id" character varying NOT NULL, "name" character varying NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "storeId" character varying, CONSTRAINT "PK_61de71a8d217d585ecd5ee3d065" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "store" ("id" character varying NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f3172007d4de5ae8e7692759d79" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "package" ("id" SERIAL NOT NULL, "product" character varying NOT NULL, "latitude" real NOT NULL, "longitude" real NOT NULL, "deliverId" integer, CONSTRAINT "PK_308364c66df656295bc4ec467c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "deliver" ("id" SERIAL NOT NULL, "key" character varying NOT NULL, "amount" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "storeId" character varying, "driverId" character varying, CONSTRAINT "PK_4c71d3cf83816acf309a256350c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "driver" ADD CONSTRAINT "FK_a76a15cb4f72377dc244193f690" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "package" ADD CONSTRAINT "FK_1d225e66032538290e4c47ee20f" FOREIGN KEY ("deliverId") REFERENCES "deliver"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deliver" ADD CONSTRAINT "FK_7523964863e37223fb1635ec330" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deliver" ADD CONSTRAINT "FK_5b6d9a4d1d69b68501de747433c" FOREIGN KEY ("driverId") REFERENCES "driver"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deliver" DROP CONSTRAINT "FK_5b6d9a4d1d69b68501de747433c"`);
        await queryRunner.query(`ALTER TABLE "deliver" DROP CONSTRAINT "FK_7523964863e37223fb1635ec330"`);
        await queryRunner.query(`ALTER TABLE "package" DROP CONSTRAINT "FK_1d225e66032538290e4c47ee20f"`);
        await queryRunner.query(`ALTER TABLE "driver" DROP CONSTRAINT "FK_a76a15cb4f72377dc244193f690"`);
        await queryRunner.query(`DROP TABLE "deliver"`);
        await queryRunner.query(`DROP TABLE "package"`);
        await queryRunner.query(`DROP TABLE "store"`);
        await queryRunner.query(`DROP TABLE "driver"`);
    }

}
