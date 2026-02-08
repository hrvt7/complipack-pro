import { backendFetch } from "@/lib/backendClient";

export type CsvImportRow = {
  product_name: string;
  length_cm: number;
  width_cm: number;
  height_cm: number;
  weight_kg?: number;
  materials?: string;
  description?: string;
  isValid: boolean;
  errors: string[];
};

export type CsvImportPreview = {
  rows: CsvImportRow[];
  validCount: number;
  invalidCount: number;
  errors: string[];
};

export type CsvImportCommit = {
  success: number;
  failed: number;
  errors: string[];
};

const CSV_IMPORT_ENDPOINT = "/api/compliance/products/import";

const toNumber = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const normalizeRows = (rows: any[]): CsvImportRow[] =>
  rows.map((row) => ({
    product_name:
      row?.product_name ?? row?.productName ?? row?.name ?? row?.title ?? "",
    length_cm: toNumber(row?.length_cm ?? row?.lengthCm ?? row?.length),
    width_cm: toNumber(row?.width_cm ?? row?.widthCm ?? row?.width),
    height_cm: toNumber(row?.height_cm ?? row?.heightCm ?? row?.height),
    weight_kg:
      row?.weight_kg !== undefined || row?.weightKg !== undefined
        ? toNumber(row?.weight_kg ?? row?.weightKg)
        : undefined,
    materials: row?.materials ?? row?.material ?? undefined,
    description: row?.description ?? row?.desc ?? undefined,
    isValid: Boolean(row?.isValid ?? row?.valid ?? row?.ok ?? row?.passed),
    errors: Array.isArray(row?.errors)
      ? row.errors
      : Array.isArray(row?.issues)
      ? row.issues
      : [],
  }));

const normalizePreview = (payload: any): CsvImportPreview => {
  const previewPayload = payload?.preview ?? payload?.result ?? payload ?? {};
  const rowsRaw =
    (Array.isArray(previewPayload?.rows) && previewPayload.rows) ||
    (Array.isArray(previewPayload?.data) && previewPayload.data) ||
    (Array.isArray(previewPayload?.items) && previewPayload.items) ||
    (Array.isArray(previewPayload?.records) && previewPayload.records) ||
    [];

  const rows = normalizeRows(rowsRaw);

  const validCount =
    typeof previewPayload?.validCount === "number"
      ? previewPayload.validCount
      : typeof previewPayload?.valid_count === "number"
      ? previewPayload.valid_count
      : typeof previewPayload?.valid === "number"
      ? previewPayload.valid
      : typeof previewPayload?.summary?.valid === "number"
      ? previewPayload.summary.valid
      : typeof previewPayload?.counts?.valid === "number"
      ? previewPayload.counts.valid
      : rows.filter((row) => row.isValid).length;

  const invalidCount =
    typeof previewPayload?.invalidCount === "number"
      ? previewPayload.invalidCount
      : typeof previewPayload?.invalid_count === "number"
      ? previewPayload.invalid_count
      : typeof previewPayload?.invalid === "number"
      ? previewPayload.invalid
      : typeof previewPayload?.summary?.invalid === "number"
      ? previewPayload.summary.invalid
      : typeof previewPayload?.counts?.invalid === "number"
      ? previewPayload.counts.invalid
      : rows.filter((row) => !row.isValid).length;

  const errors = Array.isArray(previewPayload?.errors)
    ? previewPayload.errors
    : Array.isArray(previewPayload?.validationErrors)
    ? previewPayload.validationErrors
    : Array.isArray(previewPayload?.issues)
    ? previewPayload.issues
    : [];

  return { rows, validCount, invalidCount, errors };
};

const normalizeCommit = (payload: any): CsvImportCommit => {
  const commitPayload = payload?.result ?? payload ?? {};
  const success =
    typeof commitPayload?.success === "number"
      ? commitPayload.success
      : typeof commitPayload?.imported === "number"
      ? commitPayload.imported
      : typeof commitPayload?.inserted === "number"
      ? commitPayload.inserted
      : 0;

  const failed =
    typeof commitPayload?.failed === "number"
      ? commitPayload.failed
      : typeof commitPayload?.errorsCount === "number"
      ? commitPayload.errorsCount
      : typeof commitPayload?.errorCount === "number"
      ? commitPayload.errorCount
      : 0;

  const errors = Array.isArray(commitPayload?.errors)
    ? commitPayload.errors
    : Array.isArray(commitPayload?.validationErrors)
    ? commitPayload.validationErrors
    : [];

  return { success, failed, errors };
};

export async function previewCsvImport(file: File): Promise<CsvImportPreview> {
  const csv = await file.text();
  const payload = await backendFetch<any>(CSV_IMPORT_ENDPOINT, {
    method: "POST",
    json: { csv, dry_run: true },
  });
  return normalizePreview(payload);
}

export async function commitCsvImport(file: File): Promise<CsvImportCommit> {
  const csv = await file.text();
  const payload = await backendFetch<any>(CSV_IMPORT_ENDPOINT, {
    method: "POST",
    json: { csv, dry_run: false },
  });
  return normalizeCommit(payload);
}
