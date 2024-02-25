import { Controller, Get } from '@nestjs/common';
import { RecordService } from './record.service';

@Controller('record')
export class RecordController {
	constructor(private readonly recordService: RecordService) {}

	@Get()
	findAll() {
		return this.recordService.findAll();
	}
}
