import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { DataSource } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { Client } from '../clients/entities/client.entity';
import { Product } from '../products/entities/product.entity';
import { SaleDetail } from './entities/sale-detail.entity';

@Injectable()
export class SalesService {
  constructor(private readonly dataSource: DataSource) {}

  async create(
    createSaleDto: CreateSaleDto,
    user: { sub: number; cedula: string; role: string },
  ) {
    console.log('Usuario del JWT:', user);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { clientId, paymentMethod, items } = createSaleDto;
      let totalSale = 0;
      const saleDetails: SaleDetail[] = [];

      const client = await queryRunner.manager.findOne(Client, {
        where: { id: clientId },
        relations: ['creditProfile'],
      });

      if (!client) throw new NotFoundException('Cliente no encontrado');

      for (const item of items) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.productId },
        });
        if (!product) throw new NotFoundException('Producto no encontrado');

        if (product.stock < item.quantity) {
          throw new BadRequestException('No hay suficiente stock del producto');
        }

        product.stock -= item.quantity;
        await queryRunner.manager.save(product);

        const subtotal = Number(product.price) * item.quantity;
        totalSale += subtotal;

        const detail = new SaleDetail();
        detail.product = product;
        detail.quantity = item.quantity;
        detail.priceAtSale = product.price;
        saleDetails.push(detail);
      }

      if (paymentMethod === 'CREDIT') {
        const profile = client.creditProfile;

        if (!profile || !profile.isActive) {
          throw new BadRequestException(
            'El credito del cliente no esta activo',
          );
        }
        const currentDabt = Number(profile.currentDebt);
        const creditLimit = Number(profile.creditLimit);

        if (currentDabt + totalSale > creditLimit) {
          throw new BadRequestException(
            'Credito insuficiente para realizar la compra',
          );
        }

        profile.currentDebt = currentDabt + totalSale;
        await queryRunner.manager.save(profile);
      }

      const sale = queryRunner.manager.create(Sale, {
        client,
        paymentMethod,
        total: totalSale,
        saleDetails: saleDetails,
        user: { id: user.sub },
      });
      console.log(user.sub);

      const savedSale = await queryRunner.manager.save(sale);
      await queryRunner.commitTransaction();
      return {
        message: 'Venta realizada con exito',
        sale: savedSale,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.dataSource.getRepository(Sale).find({
      relations: [
        'client',
        'user', // Ahora sí funcionará porque es ManyToOne
        'saleDetails', // Asegúrate que coincida con el nombre en la Entity
        'saleDetails.product',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const sale = await this.dataSource.getRepository(Sale).findOne({
      where: { id },
      relations: [
        'client',
        'client.creditProfile',
        'user',
        'saleDetails',
        'saleDetails.product',
      ],
    });

    if (!sale) {
      throw new NotFoundException(`La venta con ID ${id} no existe`);
    }

    return sale;
  }

  update(id: number, updateSaleDto: UpdateSaleDto) {
    return `This action updates a #${id} sale`;
  }

  remove(id: number) {
    return `This action removes a #${id} sale`;
  }
}
