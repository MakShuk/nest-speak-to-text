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
		await this.recordService.startRecording();
		if (this.recordService.recordingStatus !== 'end') {
			await this.recordService.convertToWav();
			const stream = fs.createReadStream('C:/development/NestJS/speak-to-text/output.wav');
			const result = await this.openaiService.transcriptionAudio(stream);
			const text = result.content || 'Ошибка при чтении файла';
			this.textInBuffer = text;
			console.log('Распознан текст ', text);
			return 'no action';
		} else {
			return 'action';
		}
	};

	keyAction(): void {
		const v = new GlobalKeyboardListener();

		v.addListener(e => {
			if (e.state == 'DOWN' && e.name == 'F19') {
				this.recordAndConvertToText().then(value => {
					if (value === 'no action') {
						this.copyAndPasteText();
					}
				});
			}
		});
	}

	async copyAndPasteText(): Promise<void> {
		try {
			await this.copyTextInBuffer();
			await this.pasteKeyAction();
		} catch (error) {
			console.error('Error occurred while copying and pasting text:', error);
		}
	}

	async copyTextInBuffer(): Promise<void> {
		await new Promise((resolve, reject) => {
			copyPaste.copy(this.textInBuffer, error => {
				if (error) {
					console.error('Error occurred while copying text to clipboard:', error);
					reject(error);
				} else {
					console.log('Text copied to clipboard');
					resolve(null);
				}
			});
		});
	}

	async pasteKeyAction(): Promise<void> {
		try {
			await this.copyTextInBuffer();
			await new Promise((resolve, reject) => {
				setTimeout(() => {
					try {
						robot.keyTap('v', 'control');
						resolve('Text pasted');
					} catch (error) {
						console.error('Error occurred while pasting text:', error);
						reject(error);
					}
				}, 200);
			});
		} catch (error) {
			console.error('Error occurred in pasteKeyAction:', error);
		}
	}
}
