import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import {
  Customer,
  CustomerDocument,
} from '../customers/schemas/customer.schema';
import { Trade, TradeDocument } from '../trades/schemas/trade.schema';

const DEFAULT_TOP_LIMIT = 10;
const MAX_TOP_LIMIT = 100;
const DEFAULT_DATE_RANGE_LIMIT = 100;
const MAX_DATE_RANGE_LIMIT = 500;

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
    @InjectModel(Trade.name) private tradeModel: Model<TradeDocument>,
  ) {}

  async getTopCustomers(limit: number = DEFAULT_TOP_LIMIT) {
    const capped = Math.min(Math.max(1, limit), MAX_TOP_LIMIT);
    const customers = await this.customerModel
      .find()
      .sort({ totalPaid: -1 })
      .limit(capped)
      .select('name totalPaid timesVisited firstSaleDate')
      .lean()
      .exec()
      .then((docs) =>
        docs.map((d) => ({
          name: d.name,
          totalPaid: d.totalPaid,
          devicesSold: d.timesVisited,
          firstSaleDate: d.firstSaleDate,
        })),
      );
    return customers;
  }

  async getCustomersByDateRange(
    startDate: string,
    endDate: string,
    limit: number = DEFAULT_DATE_RANGE_LIMIT,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start.getTime() > end.getTime()) {
      throw new BadRequestException(
        'startDate must be before or equal to endDate',
      );
    }
    const capped = Math.min(Math.max(1, limit), MAX_DATE_RANGE_LIMIT);

    const pipeline: PipelineStage[] = [
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: '$customerId',
          totalPaid: { $sum: '$amountPaid' },
          devicesSold: { $sum: 1 },
          firstSaleDateInRange: { $min: '$createdAt' },
        },
      },
      {
        $lookup: {
          from: 'customers',
          localField: '_id',
          foreignField: '_id',
          as: 'customer',
        },
      },
      { $unwind: '$customer' },
      {
        $sort: { totalPaid: -1 },
      },
      { $limit: capped },
      {
        $project: {
          name: '$customer.name',
          totalPaid: 1,
          devicesSold: 1,
          firstSaleDate: '$firstSaleDateInRange',
          _id: 0,
        },
      },
    ];

    return this.tradeModel.aggregate(pipeline).exec();
  }

  async getSummary(days?: number) {
    const matchStage: { createdAt?: { $gte: Date } } = {};
    if (days != null && days > 0) {
      const since = new Date();
      since.setDate(since.getDate() - days);
      matchStage.createdAt = { $gte: since };
    }

    const [tradeStats, totalCustomers] = await Promise.all([
      this.tradeModel
        .aggregate<{ totalRevenue: number; totalTrades: number }>([
          ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: '$amountPaid' },
              totalTrades: { $sum: 1 },
            },
          },
          { $project: { _id: 0, totalRevenue: 1, totalTrades: 1 } },
        ])
        .exec(),
      this.customerModel.countDocuments().exec(),
    ]);

    const stats = tradeStats[0];
    return {
      totalCustomers,
      totalRevenue: stats?.totalRevenue ?? 0,
      totalTrades: stats?.totalTrades ?? 0,
      ...(days != null && days > 0 ? { days } : {}),
    };
  }

  async getSalesByPeriod(
    startDate?: string,
    endDate?: string,
    groupBy: 'day' | 'month' = 'day',
  ) {
    const matchStage: { createdAt?: { $gte?: Date; $lte?: Date } } = {};
    if (startDate) {
      matchStage.createdAt = {
        ...matchStage.createdAt,
        $gte: new Date(startDate),
      };
    }
    if (endDate) {
      matchStage.createdAt = {
        ...matchStage.createdAt,
        $lte: new Date(endDate),
      };
    }

    const dateFormat = groupBy === 'month' ? '%Y-%m-01' : '%Y-%m-%d';
    const pipeline: PipelineStage[] = [
      ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
      {
        $group: {
          _id: {
            $dateToString: { format: dateFormat, date: '$createdAt' },
          },
          revenue: { $sum: '$amountPaid' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', revenue: 1, count: 1, _id: 0 } },
    ];

    return this.tradeModel.aggregate(pipeline).exec();
  }

  getTopDevices(limit: number = DEFAULT_TOP_LIMIT) {
    const capped = Math.min(Math.max(1, limit), MAX_TOP_LIMIT);
    return this.tradeModel
      .aggregate<{
        deviceName: string;
        count: number;
      }>([
        { $group: { _id: '$deviceName', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: capped },
        { $project: { deviceName: '$_id', count: 1, _id: 0 } },
      ])
      .exec();
  }
}
