import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Types } from 'mongoose';

describe('CustomersController', () => {
  let controller: CustomersController;

  const mockCustomer = {
    _id: new Types.ObjectId(),
    name: 'Test Customer',
    email: 'test@example.com',
    phone: '+1234567890',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCustomersService = {
    create: jest.fn().mockResolvedValue(mockCustomer),
    findAll: jest.fn().mockResolvedValue([mockCustomer]),
    findOne: jest.fn().mockResolvedValue(mockCustomer),
    update: jest.fn().mockResolvedValue({ ...mockCustomer, name: 'Updated' }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: mockCustomersService,
        },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a customer', async () => {
      const dto: CreateCustomerDto = {
        name: 'Test Customer',
        email: 'test@example.com',
      };
      const result = await controller.create(dto);
      expect(result).toStrictEqual(mockCustomer);
      expect(mockCustomersService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of customers', async () => {
      const result = await controller.findAll();
      expect(result).toStrictEqual([mockCustomer]);
      expect(mockCustomersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a customer by id', async () => {
      const id = mockCustomer._id;
      const result = await controller.findOne(id);
      expect(result).toStrictEqual(mockCustomer);
      expect(mockCustomersService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const dto: UpdateCustomerDto = { name: 'Updated' };
      const id = mockCustomer._id;
      const result = await controller.update(id, dto);
      expect(result).toStrictEqual({ ...mockCustomer, name: 'Updated' });
      expect(mockCustomersService.update).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('remove', () => {
    it('should remove a customer', async () => {
      const id = mockCustomer._id;
      await controller.remove(id);
      expect(mockCustomersService.remove).toHaveBeenCalledWith(id);
    });
  });
});
