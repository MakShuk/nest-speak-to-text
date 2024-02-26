import { Injectable } from '@nestjs/common';
import { RecordService } from './record/record.service';
import { OpenaiService } from './openai/openai.service';
import { GlobalKeyboardListener } from 'node-global-key-listener';
import * as copyPaste from 'copy-paste';
import * as fs from 'fs';
import * as robot from 'robotjs';

@Injectable()
export class AppService {
	textInBuffer: string;
	constructor(
		private readonly recordService: RecordService,
		private readonly openaiService: OpenaiService,
	) {}
	recordAndConvertToText = async (): Promise<string> => {
		await this.recordService.recordVoiceNew();
		await this.recordService.convertToWav();
		const stream = fs.createReadStream('C:/development/NestJS/speak-to-text/output.wav');
		const result = await this.openaiService.transcriptionAudio(stream);
		const text = result.content || 'Ошибка при чтении файла';
		this.textInBuffer = text;
		return text;
	};

	keyAction(): void {
		const v = new GlobalKeyboardListener();

		v.addListener(e => {
			if (e.state == 'DOWN' && e.name == 'F19') {
				this.recordAndConvertToText().then(() => {
					this.pasteKeyAction();
				});
			}
		});
	}

	async pasteKeyAction(): Promise<void> {
		console.log('textInBuffer', this.textInBuffer);
		await new Promise((resolve, reject) => {
			copyPaste.copy(this.textInBuffer, error => {
				if (error) {
					reject(error);
				} else {
					resolve('Text copied to clipboard');
				}
			});
		});
		robot.keyToggle('control', 'down');
		robot.keyTap('v');
		robot.keyToggle('control', 'up');
	}
}
