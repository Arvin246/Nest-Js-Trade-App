import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Customer } from './schemas/customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Types } from 'mongoose';

describe('CustomersService', () => {
  let service: CustomersService;
  let mockCustomerModel: any;

  const mockCustomer = {
    _id: new Types.ObjectId(),
    name: 'Test Customer',
    email: 'test@example.com',
    phone: '+1234567890',
  };

  beforeEach(async () => {
    mockCustomerModel = jest
      .fn()
      .mockImplementation((dto: CreateCustomerDto) => ({
        ...mockCustomer,
        ...dto,
        save: jest.fn().mockResolvedValue({ ...mockCustomer, ...dto }),
      }));
    mockCustomerModel.find = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockCustomer]),
    });
    mockCustomerModel.findById = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockCustomer),
    });
    mockCustomerModel.findByIdAndUpdate = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockCustomer),
    });
    mockCustomerModel.findByIdAndDelete = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockCustomer),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getModelToken(Customer.name),
          useValue: mockCustomerModel,
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a customer', async () => {
      const dto: CreateCustomerDto = {
        name: 'Test',
        email: 'test@example.com',
      };
      const result = await service.create(dto);
      expect(mockCustomerModel).toHaveBeenCalledWith(dto);
      expect(result).toBeDefined();
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException when customer does not exist', async () => {
      mockCustomerModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.findOne(new Types.ObjectId())).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
