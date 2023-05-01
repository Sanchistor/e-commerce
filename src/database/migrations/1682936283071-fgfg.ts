import { MigrationInterface, QueryRunner } from "typeorm";

export class fgfg1682936283071 implements MigrationInterface {
    name = 'fgfg1682936283071'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "author" character varying NOT NULL DEFAULT ' '`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "author"`);
    }

}
