import {
  Injectable,
  BadGatewayException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryRepo.findOneBy({
      id: createProductDto.categoryId,
    });
    if (!category) {
      throw new NotFoundException('Categoria no valida');
    }
    try {
      const product = this.productRepo.create({
        ...createProductDto,
        category,
      });
      return await this.productRepo.save(product);
    } catch {
      throw new BadGatewayException('Error creating Products');
    }
  }

  async findAll() {
    return await this.productRepo.find();
  }

  async findOneBy(id: number) {
    const Oneproduct = await this.findOne(id);
    return Oneproduct;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const existProduct = await this.findOne(id);
      const updateProduct = this.productRepo.merge(
        existProduct,
        updateProductDto,
      );
      const saveProduct = await this.productRepo.save(updateProduct);
      return saveProduct;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadGatewayException(`Error update product with id ${id}`);
    }
  }

  private async findOne(id: number) {
    const Producto = await this.productRepo.findOne({
      where: { id },
    });
    if (!Producto) {
      throw new NotFoundException(`Producto with id ${id} not found`);
    }
    return Producto;
  }
}
