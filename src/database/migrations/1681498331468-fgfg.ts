import { MigrationInterface, QueryRunner } from "typeorm";

export class fgfg1681498331468 implements MigrationInterface {
    name = 'fgfg1681498331468'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_order" DROP CONSTRAINT "FK_717057f3f11a007030181422152"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "photo"`);
        await queryRunner.query(`ALTER TABLE "file" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "file" ADD "size" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "file" ADD "type" character varying`);
        await queryRunner.query(`ALTER TABLE "file" ADD "uploadedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "file" ADD "productId" uuid`);
        await queryRunner.query(`ALTER TABLE "product_order" ADD CONSTRAINT "FK_717057f3f11a007030181422152" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "FK_eae532e4ae79b4fc1ff7d1197ad" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "FK_eae532e4ae79b4fc1ff7d1197ad"`);
        await queryRunner.query(`ALTER TABLE "product_order" DROP CONSTRAINT "FK_717057f3f11a007030181422152"`);
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "uploadedAt"`);
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "size"`);
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "photo" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_order" ADD CONSTRAINT "FK_717057f3f11a007030181422152" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
