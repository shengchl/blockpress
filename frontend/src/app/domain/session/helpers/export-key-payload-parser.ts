
import { ExportKeyInfo } from '../models/export-key-info.interface';

export function exportKeyPayloadParser(rawPayload): ExportKeyInfo {
  return {
    wif: rawPayload.wif,
    phrase: rawPayload.phrase,
    errorCode: rawPayload.errorCode ? rawPayload.errorCode : null,
    success: rawPayload.success
  };
}
