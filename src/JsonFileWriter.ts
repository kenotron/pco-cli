import fs from "fs";
import path from "path";
export class JsonFileWriter {
  private _writeStream;
  private _firstRow = true;
  constructor(filename: string) {
    const dirname = path.dirname(filename);
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }
    this._writeStream = fs.createWriteStream(filename);
    this._writeStream.write("[");
  }

  append(row: any) {
    if (!this._firstRow) {
      this._firstRow = false;
      this._writeStream.write(",");
    }

    this._writeStream.write(JSON.stringify(row));
  }

  close() {
    this._writeStream.write("]");
    this._writeStream.end();
  }
}
