import { Injectable } from '@nestjs/common';
import fs from 'fs';
import recorder from 'node-record-lpcm16';

@Injectable()
export class RecordService {
	findAll() {
		const file = fs.createWriteStream('test.wav', { encoding: 'binary' });

		recorder
			.record({
				sampleRate: 16000, // Sample rate in Hz
				threshold: 0.5, // Silence threshold (recording will stop if it falls below this)
				recordProgram: 'rec', // Try also "arecord" or "sox"
				silence: '1.0', // Silence duration before it stops recording (in seconds)
			})
			.stream()
			.on('data', function (data) {
				file.write(data);
			});
	}
}
