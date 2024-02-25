import { Injectable } from '@nestjs/common';
import { RecordService } from './record/record.service';
import { OpenaiService } from './openai/openai.service';
import * as copyPaste from 'copy-paste';
import * as fs from 'fs';

@Injectable()
export class AppService {
	constructor(
		private readonly recordService: RecordService,
		private readonly openaiService: OpenaiService,
	) {}
	async recordAndConvertToText(): Promise<string> {
		await this.recordService.recordVoice();
		await this.recordService.convertToWav();
		const stream = fs.createReadStream('C:/development/NestJS/speak-to-text/output.wav');
		const result = await this.openaiService.transcriptionAudio(stream);
		const text = result.content || 'Ошибка при чтении файла';
		copyPaste.copy(text);
		return text;
	}

	keyAction(): void {}
}
