import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Trade, TradeDocument } from './schemas/trade.schema';
import { CreateTradeDto } from './dto/create-trade.dto';
import { CustomersService } from '../customers/customers.service';

@Injectable()
export class TradesService {
  constructor(
    @InjectModel(Trade.name) private tradeModel: Model<TradeDocument>,
    private customersService: CustomersService,
  ) {}

  async create(createTradeDto: CreateTradeDto): Promise<TradeDocument> {
    const { email, phone, name, deviceName, amountPaid } = createTradeDto;

    if (!email && !phone) {
      throw new BadRequestException(
        'Provide email or phone to identify customer',
      );
    }

    let customer = await this.customersService.findByIdentity(email, phone);

    if (!customer) {
      if (!email || !name) {
        throw new BadRequestException(
          'Email and name are required to register a new customer',
        );
      }
      customer = await this.customersService.create({
        name,
        email,
        phone,
      });
    }

    const trade = await this.tradeModel.create({
      customerId: customer._id,
      deviceName,
      amountPaid,
    });

    await this.customersService.recordTradeStats(
      customer._id as unknown as Types.ObjectId,
      amountPaid,
    );

    return trade;
  }

  async findAll(customerId?: string): Promise<TradeDocument[]> {
    let filter: { customerId?: Types.ObjectId } = {};
    if (customerId && Types.ObjectId.isValid(customerId)) {
      filter = { customerId: new Types.ObjectId(customerId) };
    }
    return this.tradeModel.find(filter).sort({ createdAt: -1 }).exec();
  }
}
