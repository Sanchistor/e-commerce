import { MigrationInterface, QueryRunner } from "typeorm";

export class fgfg1679254689299 implements MigrationInterface {
    name = 'fgfg1679254689299'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_attributes_to_products" DROP CONSTRAINT "FK_23933fbc2e52d571b4b87b359dc"`);
        await queryRunner.query(`CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "price" double precision NOT NULL DEFAULT '0', "date" character varying NOT NULL, "address" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "orderId" uuid, "productId" uuid, CONSTRAINT "PK_9849f0d8ce095e50e752616f691" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_attributes_to_products" ADD CONSTRAINT "FK_23933fbc2e52d571b4b87b359dc" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_order" ADD CONSTRAINT "FK_42291ebe165058deecb017e652b" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_order" ADD CONSTRAINT "FK_717057f3f11a007030181422152" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_order" DROP CONSTRAINT "FK_717057f3f11a007030181422152"`);
        await queryRunner.query(`ALTER TABLE "product_order" DROP CONSTRAINT "FK_42291ebe165058deecb017e652b"`);
        await queryRunner.query(`ALTER TABLE "product_attributes_to_products" DROP CONSTRAINT "FK_23933fbc2e52d571b4b87b359dc"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`);
        await queryRunner.query(`DROP TABLE "product_order"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`ALTER TABLE "product_attributes_to_products" ADD CONSTRAINT "FK_23933fbc2e52d571b4b87b359dc" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
