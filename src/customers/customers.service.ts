import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
  ) {}

  async create(
    createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerDocument> {
    const created = new this.customerModel(createCustomerDto);
    return created.save();
  }

  async findAll(): Promise<CustomerDocument[]> {
    return this.customerModel.find().exec();
  }

  async findOne(id: Types.ObjectId): Promise<CustomerDocument> {
    const customer = await this.customerModel.findById(id).exec();
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async update(
    id: Types.ObjectId,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerDocument> {
    const customer = await this.customerModel
      .findByIdAndUpdate(id, updateCustomerDto, { new: true })
      .exec();
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async remove(id: Types.ObjectId): Promise<void> {
    const result = await this.customerModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
  }

  async findByIdentity(
    email?: string,
    phone?: string,
  ): Promise<CustomerDocument | null> {
    if (!email && !phone) {
      throw new BadRequestException(
        'Provide email or phone to look up customer',
      );
    }
    if (email) {
      return this.customerModel.findOne({ email }).exec();
    }
    return this.customerModel.findOne({ phone }).exec();
  }

  async recordTradeStats(
    customerId: Types.ObjectId,
    amountPaid: number,
  ): Promise<void> {
    await this.customerModel
      .updateOne(
        { _id: customerId },
        { $inc: { totalPaid: amountPaid, timesVisited: 1 } },
      )
      .exec();
    await this.customerModel
      .updateOne(
        { _id: customerId, firstSaleDate: { $exists: false } },
        { $set: { firstSaleDate: new Date() } },
      )
      .exec();
  }
}
