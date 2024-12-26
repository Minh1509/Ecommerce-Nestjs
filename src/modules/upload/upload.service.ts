import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import * as ExcelJS from 'exceljs';
import { AwsService } from '../../base/aws/aws.service';


@Injectable()
export class UploadService {
  constructor(
    private productService: ProductsService,
   private awsService: AwsService

  ) {}

  async uploadFile(file : Express.Multer.File) {
    return await this.awsService.uploadFile(file)
  }
  async readExcelFile(file: Express.Multer.File): Promise<any> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file.buffer);
    const worksheet = workbook.worksheets[0];
    const rows = [];

    // Assuming the first row is the header
    const headerRow = worksheet.getRow(1);
    const headers = headerRow.values as string[];

    // Start from the second row
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return;
      const rowData = {};
      headers.forEach((header, index) => {
        rowData[header] = row.getCell(index).value;
      });
      rows.push(rowData);
    });

    const createProducts = rows.map(async (data) => {
      const createProductDto = plainToInstance(CreateProductDto, data);

      const errors = await validate(createProductDto);

      if (errors.length > 0)
        throw new BadRequestException('File excel thiếu dữ liệu');

      const createProduct = await this.productService.createProduct(createProductDto);

      return createProduct;
    });
    return await Promise.all(createProducts);
  }

  async exportProductData() {
    const products = await this.productService.findAll();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');

    // Add header row
    const headerRow = worksheet.addRow([
      'name',
      'price',
      'quantity',
      'description',
      'thumb',
    ]);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'bbf7d0' }, // Gray background
      };
    });

    // Add data rows with alternating row colors
    products.forEach((product, index) => {
      const row = worksheet.addRow([
        product.name,
        product.price,
        product.quantity,
        product.description,
        product.thumb,
      ]);
      const bgColor = index % 2 === 0 ? 'f6f6f9' : 'eeeeee';
      row.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: bgColor },
        };
      });
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
}
