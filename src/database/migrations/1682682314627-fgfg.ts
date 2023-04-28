import { MigrationInterface, QueryRunner } from "typeorm";

export class fgfg1682682314627 implements MigrationInterface {
    name = 'fgfg1682682314627'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "weight"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "language" character varying(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD "year" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "year"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "language"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "weight" character varying(10) NOT NULL`);
    }

}
