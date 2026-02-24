import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { TradesService } from './trades.service';
import { CreateTradeDto } from './dto/create-trade.dto';

@Controller('trades')
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  @Post()
  create(@Body() createTradeDto: CreateTradeDto) {
    return this.tradesService.create(createTradeDto);
  }

  @Get()
  findAll(@Query('customerId') customerId?: string) {
    return this.tradesService.findAll(customerId);
  }
}
