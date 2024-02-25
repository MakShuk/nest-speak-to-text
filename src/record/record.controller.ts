import { Controller, Get } from '@nestjs/common';
import { RecordService } from './record.service';

@Controller('record')
export class RecordController {
	constructor(private readonly recordService: RecordService) {}

	@Get('convert')
	convertToWav() {
		return this.recordService.convertToWav();
	}

	@Get('record')
	RecordVoice() {
		return this.recordService.recordVoice();
	}

	@Get('record-and-convert')
	async transcribe() {
		await this.recordService.recordVoice();
		await this.recordService.convertToWav();
		return 'recorded and converted to wav!';
	}
}
