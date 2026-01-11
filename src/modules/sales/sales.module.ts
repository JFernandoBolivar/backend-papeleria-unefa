import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleDetail } from './entities/sale-detail.entity';
import { Sale } from './entities/sale.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Sale, SaleDetail])],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
