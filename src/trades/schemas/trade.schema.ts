import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TradeDocument = Trade & Document;

@Schema({ timestamps: true })
export class Trade {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customerId: Types.ObjectId;

  @Prop({ required: true })
  deviceName: string;

  @Prop({ required: true })
  amountPaid: number;
}

export const TradeSchema = SchemaFactory.createForClass(Trade);
TradeSchema.index({ createdAt: 1 });
TradeSchema.index({ customerId: 1, createdAt: 1 });
