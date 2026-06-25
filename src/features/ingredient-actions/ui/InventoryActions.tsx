"use client";

import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Button, PlusIcon, UploadIcon } from "@/shared/ui";
import { createIngredientApi, useIngredientStore } from "@/entities/ingredient";
import type { CreateIngredientPayload } from "@/entities/ingredient";
import { IngredientFormModal } from "./IngredientFormModal";

type ParsedRow = CreateIngredientPayload;

function parseSheet(data: unknown[][]): ParsedRow[] {
  if (!data.length) return [];
  const headers = (data[0] as string[]).map((h) => String(h ?? "").trim().toLowerCase());
  const nameIdx = headers.findIndex((h) => h === "이름" || h === "name");
  const catIdx = headers.findIndex((h) => h === "카테고리" || h === "category");
  const qtyIdx = headers.findIndex((h) => h === "수량" || h === "quantity");
  const unitIdx = headers.findIndex((h) => h === "단위" || h === "unit");
  const expIdx = headers.findIndex((h) => h.includes("유통") || h.startsWith("exp"));

  const ni = nameIdx >= 0 ? nameIdx : 0;
  const ci = catIdx >= 0 ? catIdx : 1;
  const qi = qtyIdx >= 0 ? qtyIdx : 2;
  const ui = unitIdx >= 0 ? unitIdx : 3;
  const ei = expIdx >= 0 ? expIdx : 4;
  const start = nameIdx >= 0 ? 1 : 0;

  return (data.slice(start) as string[][]).flatMap((row) => {
    const name = String(row[ni] ?? "").trim();
    if (!name) return [];
    const qty = parseFloat(String(row[qi] ?? ""));
    const exp = String(row[ei] ?? "").trim();
    return [
      {
        name,
        category: String(row[ci] ?? "농산물").trim() || "농산물",
        quantity: isNaN(qty) ? undefined : qty,
        unit: String(row[ui] ?? "개").trim() || "개",
        expirationDate: exp ? `${exp}T00:00:00` : undefined,
      },
    ];
  });
}

async function parseCSV(file: File): Promise<ParsedRow[]> {
  const text = await file.text();
  const rows = text
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split(",").map((cell) => cell.trim().replace(/^"|"$/g, "")));
  return parseSheet(rows);
}

async function parseExcel(file: File): Promise<ParsedRow[]> {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 });
  return parseSheet(data);
}

export function InventoryActions() {
  const [addOpen, setAddOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const csvRef = useRef<HTMLInputElement>(null);
  const xlsxRef = useRef<HTMLInputElement>(null);

  async function handleUpload(rows: ParsedRow[]) {
    if (!rows.length) {
      toast.error("파일에 데이터가 없습니다.");
      return;
    }
    setUploading(true);
    const results = await Promise.allSettled(rows.map((row) => createIngredientApi(row)));
    await useIngredientStore.getState().fetchIngredients();
    setUploading(false);
    const ok = results.filter((r) => r.status === "fulfilled").length;
    const fail = results.filter((r) => r.status === "rejected").length;
    if (fail === 0) toast.success(`${ok}개 항목이 등록되었습니다.`);
    else toast.warning(`${ok}개 등록 완료, ${fail}개 실패.`);
  }

  async function handleCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      await handleUpload(await parseCSV(file));
    } catch {
      toast.error("CSV 파일을 읽는 중 오류가 발생했습니다.");
    }
  }

  async function handleExcel(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      await handleUpload(await parseExcel(file));
    } catch {
      toast.error("엑셀 파일을 읽는 중 오류가 발생했습니다.");
    }
  }

  return (
    <>
      <input ref={csvRef} type="file" accept=".csv" className="hidden" onChange={handleCSV} />
      <input ref={xlsxRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleExcel} />

      <Button variant="secondary" size="sm" disabled={uploading} onClick={() => xlsxRef.current?.click()}>
        <UploadIcon size={14} />
        엑셀 업로드
      </Button>
      <Button variant="secondary" size="sm" disabled={uploading} onClick={() => csvRef.current?.click()}>
        <UploadIcon size={14} />
        CSV 업로드
      </Button>
      <Button variant="primary" size="sm" onClick={() => setAddOpen(true)}>
        <PlusIcon size={14} />
        재고 추가
      </Button>

      <IngredientFormModal open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}
