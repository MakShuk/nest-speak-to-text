import { Controller, Get, HttpException, HttpStatus, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController implements OnModuleInit {
	onModuleInit() {
		this.appService.keyAction();
	}
	constructor(private readonly appService: AppService) {}

	@Get('record-and-convert-to-text')
	async recordAndConvertToText(): Promise<string> {
		try {
			await this.appService.recordAndConvertToText();
			return 'recorded and converted to text!';
		} catch (error) {
			console.error(error);
			throw new HttpException(
				{
					status: HttpStatus.INTERNAL_SERVER_ERROR,
					error: 'There was a problem executing recordAndConvertToText',
				},
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Get('key-action')
	async keyAction(): Promise<void> {
		try {
			this.appService.keyAction();
		} catch (error) {
			console.error(error);
			throw new HttpException(
				{
					status: HttpStatus.INTERNAL_SERVER_ERROR,
					error: 'There was a problem executing keyAction',
				},
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Get('paste-key-action')
	async pasteKeyAction(): Promise<void> {
		try {
			await new Promise(resolve => setTimeout(resolve, 1000));
			this.appService.pasteKeyAction();
		} catch (error) {
			console.error(error);
			throw new HttpException(
				{
					status: HttpStatus.INTERNAL_SERVER_ERROR,
					error: 'There was a problem executing pasteKeyAction',
				},
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
