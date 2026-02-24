import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TradesController } from './trades.controller';
import { TradesService } from './trades.service';
import { Trade, TradeSchema } from './schemas/trade.schema';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Trade.name, schema: TradeSchema }]),
    CustomersModule,
  ],
  controllers: [TradesController],
  providers: [TradesService],
})
export class TradesModule {}
