/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

const mic = require('mic');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

@Injectable()
export class RecordService {
	async recordVoice() {
		const micInstance = mic({
			rate: '16000',
			channels: '1',
			encoding: 'signed-integer',
			debug: true,
			exitOnSilence: 'silence',
			fileType: 'wav',
		});

		const micInputStream = micInstance.getAudioStream();
		const outputFileStream = fs.createWriteStream('output.raw');

		micInputStream.pipe(outputFileStream);

		micInputStream.on('data', function (data) {
			console.log('Recieved Input Stream: ' + data.length);
		});

		micInputStream.on('error', function (err) {
			console.log('Error in Input Stream: ' + err);
		});

		micInstance.start();

		return new Promise(resolve => {
			setTimeout(() => {
				micInstance.stop();
				resolve('Recording stopped');
			}, 5000);
		});
	}

	async convertToWav() {
		return new Promise((resolve, reject) => {
			ffmpeg.setFfmpegPath(ffmpegPath);
			ffmpeg('output.raw')
				.inputFormat('s16le')
				.audioChannels(1)
				.audioFrequency(16000)
				.audioFilters('highpass=f=200')
				.audioFilters('atempo=0.8')
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
}
