import fs from "fs";
import path from "path";
export class JsonFileWriter {
  private _writeStream;
  constructor(filename: string) {
    const dirname = path.dirname(filename);
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }
    this._writeStream = fs.createWriteStream(filename);
    this._writeStream.write("[");
  }

  append(row: any) {
    this._writeStream.write(JSON.stringify(row) + ",");
  }

  close() {
    this._writeStream.write("]");
    this._writeStream.end();
  }
}
