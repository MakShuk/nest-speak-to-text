import { Controller, Get, Res } from '@nestjs/common';
import { OpenaiService, ExtendedChatCompletionMessage } from './openai.service';
import * as fs from 'fs';
import { Stream } from 'openai/streaming';
import { Response } from 'express';
import { ChatCompletionChunk } from 'openai/resources/chat';

@Controller('openai')
export class OpenaiController {
	constructor(private readonly openaiService: OpenaiService) {}

	@Get('response')
	async response(): Promise<ExtendedChatCompletionMessage> {
		const messages = [];
		messages.push(this.openaiService.createUserMessage('1 афоризм'));
		const response = await this.openaiService.response(messages);
		if (response.error) console.log('Ошибка');
		return response;
	}

	@Get('stream-response')
	async streamResponse(@Res() res: Response): Promise<Stream<ChatCompletionChunk> | string> {
		const message = this.openaiService.createUserMessage('Расскажи подробно он докер compose');
		const yourStream = await this.openaiService.streamResponse([message]);
		if (yourStream instanceof Stream) {
			res.setHeader('Content-Type', 'application/octet-stream');
			res.setHeader('Content-Disposition', 'attachment; filename=stream.txt');
			for await (const part of yourStream) {
				process.stdout.write(part.choices[0]?.delta?.content || '');
			}
			return yourStream;
		} else {
			return yourStream.content || 'Нет данных';
		}
	}

	@Get('file-uploads')
	fileUploads(): Promise<void> {
		return this.openaiService.fileUploads();
	}

	@Get('transcription-audio')
	async transcriptionAudio(@Res() res: Response): Promise<ExtendedChatCompletionMessage | string> {
		try {
			const stream: fs.ReadStream = fs.createReadStream(
				'C:/development/NestJS/speak-to-text/output.wav',
			);
			const response = await this.openaiService.transcriptionAudio(stream);
			if (response.error) {
				res.status(500).send(`Ошибка при чтении файла аудио: ${response.content}`);
				return;
			}
			res.send(response);
		} catch (error) {
			res.status(500).send(`Ошибка при чтении файла аудио: ${error}`);
			return 'Ошибка при чтении файла';
		}
	}
}
