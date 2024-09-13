import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Report } from './reports.entity';
import { Repository } from 'typeorm';

describe('ReportsService', () => {
  let service: ReportsService;
  let repo: Repository<Report>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Report),
          useClass: Repository, 
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    repo = module.get<Repository<Report>>(getRepositoryToken(Report));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
