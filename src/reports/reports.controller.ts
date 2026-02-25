import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import {
  CustomersByDateRangeQueryDto,
  TopCustomersQueryDto,
  SummaryQueryDto,
  SalesByPeriodQueryDto,
  TopDevicesQueryDto,
} from './dto/reports-query.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('top-customers')
  getTopCustomers(@Query() query: TopCustomersQueryDto) {
    return this.reportsService.getTopCustomers(query.limit);
  }

  @Get('summary')
  getSummary(@Query() query: SummaryQueryDto) {
    return this.reportsService.getSummary(query.days);
  }

  @Get('sales-by-period')
  getSalesByPeriod(@Query() query: SalesByPeriodQueryDto) {
    return this.reportsService.getSalesByPeriod(
      query.startDate,
      query.endDate,
      query.groupBy,
    );
  }

  @Get('top-devices')
  getTopDevices(@Query() query: TopDevicesQueryDto) {
    return this.reportsService.getTopDevices(query.limit);
  }

  @Get()
  getCustomersByDateRange(@Query() query: CustomersByDateRangeQueryDto) {
    return this.reportsService.getCustomersByDateRange(
      query.startDate,
      query.endDate,
      query.limit,
    );
  }
}
