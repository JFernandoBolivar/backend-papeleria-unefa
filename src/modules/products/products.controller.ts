import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth } from 'src/modules/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // MÉTODO PÚBLICO: No tiene el decorador @Auth
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // MÉTODO PÚBLICO: No tiene el decorador @Auth
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOneBy(id);
  }

  // MÉTODO PROTEGIDO: Solo Supervisor
  @ApiBasicAuth()
  @Auth(Role.SUPERVISOR)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // MÉTODO PROTEGIDO: Solo Supervisor
  @ApiBasicAuth()
  @Auth(Role.SUPERVISOR)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }
}
