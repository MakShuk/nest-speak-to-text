/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

const Mic = require('node-microphone');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

@Injectable()
export class RecordService {
	recordingStatus: 'recording' | 'stops' | 'end' = 'end';

	async convertToWav() {
		return new Promise((resolve, reject) => {
			ffmpeg.setFfmpegPath(ffmpegPath);
			ffmpeg('output.raw')
				.inputFormat('s16le')
				.audioChannels(1)
				.audioFrequency(16000)
				.audioFilters('highpass=f=200')
				.audioFilters('atempo=0.6')
				.audioFilters('loudnorm')
				.audioFilters('equalizer=f=1000:t=h:width=200:g=-10')
				.output('output.wav')
				.on('end', () => {
					console.log('File has been converted succesfully');
					resolve('File has been converted succesfully');
				})
				.on('error', err => {
					console.log('an error happened: ' + err.message);
					reject(err);
				})
				.run();
		});
	}

	async recordVoice() {
		const outputFileStream = fs.createWriteStream('output.raw');
		const mic = new Mic();
		const micStream = mic.startRecording();

		micStream.pipe(outputFileStream);

		this.recordingStatus = 'recording';
		await new Promise(resolve => {
			const interval = setInterval(() => {
				console.log('Запущен цикл');
				console.log('recordingStatus', this.recordingStatus);
				if (this.recordingStatus === 'stops') {
					mic.stopRecording();
					this.recordingStatus = 'end';
					clearInterval(interval);
					resolve('Recording stopped recordVoiceNew');
				}
			}, 200);
		});
	}

	async startRecording() {
		if (this.recordingStatus === 'recording') {
			this.recordingStatus = 'stops';
		} else if (this.recordingStatus === 'end') {
			console.log('startRecording запущена');
			await this.recordVoice();
		}
	}
}
