import fs from 'fs';
import opn from 'opn';
import XLSX from 'xlsx-plus';

export default class DaffMergeXLSX {
  constructor(paths) {
    this.paths = paths;

    this.onSuccess = null;
    this.onFail = null;
  }

  async run() {
    try {
      if (this.paths.length === 2) {
        await this.diff(this.paths[0], this.paths[1]);
      } else {
        await this.merge(this.paths[0], this.paths[1], this.paths[2], this.paths[3]);
      }
      this.callOnSuccess();
    } catch (e) {
      this.callOnFail(e.message);
    }
  }

  async diff(basePath, modifiedPath) {
    const modifiedData = DaffMergeXLSX.readData(modifiedPath);

    // TODO diff with daff
    const dataDiff = modifiedData;

    const diffPath = `${modifiedPath}_DIFF.xlsx`;
    DaffMergeXLSX.writeData(dataDiff, diffPath);

    await this.startProcess(diffPath);

    // TODO patch

    fs.unlinkSync(diffPath);
  }

  async merge(base, local, remote, merged) {
    // TODO merge with daff

    // TODO create xlsx
    const xlsx = merged;

    await this.startProcess(xlsx);

    // TODO check and save merged
  }

  async startProcess(path) {
    const c = await opn(path);
    this.exitCode = c.exitCode;
    if (this.exitCode !== 0) {
      throw new Error(`error code: ${c.exitCode}`);
    }
  }

  callOnSuccess() {
    if (this.onSuccess != null) {
      this.onSuccess();
    }
  }

  callOnFail(message) {
    if (this.onFail != null) {
      this.onFail(message);
    }
  }

  static readData(filePath) {
    return XLSX.readFileSync(filePath).toArray()[0];
  }

  static writeData(data, filePath) {
    const workbook = new XLSX.Workbook();
    workbook.addSheet(new XLSX.Worksheet(data, 'sheet'));
    XLSX.writeFileSync(workbook, filePath);
  }
}
