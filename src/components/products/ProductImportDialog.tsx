
'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, File, Loader2, ListChecks, Info } from 'lucide-react';
import type { ProductTemplate, ProductBatch } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ProductImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newTemplates: ProductTemplate[], newBatches: ProductBatch[]) => void;
  existingTemplates: ProductTemplate[];
}

type ParsedRow = {
  productName: string;
  metrcPackageId: string;
  thcPercentage: number;
  cbdPercentage: number;
  wholesalePricePerUnit: number;
  currentStockQuantity: number;
  expirationDate?: string;
  strainType?: ProductTemplate['strainType'];
  productCategory?: ProductTemplate['productCategory'];
  unitOfMeasure?: ProductTemplate['unitOfMeasure'];
  supplier?: string;
};

// Define expected CSV headers
const EXPECTED_HEADERS = [
  "productName", "metrcPackageId", "thcPercentage", "cbdPercentage", "wholesalePricePerUnit", "currentStockQuantity"
];
const OPTIONAL_HEADERS = [
    "expirationDate", "strainType", "productCategory", "unitOfMeasure", "supplier"
];

export function ProductImportDialog({ isOpen, onClose, onImport, existingTemplates }: ProductImportDialogProps) {
  const { toast } = useToast();
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setParsedData([]);
    setFileName(null);
    setIsLoading(false);
    setError(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      return;
    }
    const file = acceptedFiles[0];
    setFileName(file.name);
    setIsLoading(true);
    setError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || [];
        const missingHeaders = EXPECTED_HEADERS.filter(h => !headers.includes(h));
        if (missingHeaders.length > 0) {
            setError(`CSV is missing required headers: ${missingHeaders.join(', ')}`);
            setIsLoading(false);
            return;
        }

        const data: ParsedRow[] = results.data.map((row: any) => ({
          productName: row.productName?.trim() || 'Unnamed Product',
          metrcPackageId: row.metrcPackageId?.trim() || '',
          thcPercentage: parseFloat(row.thcPercentage) || 0,
          cbdPercentage: parseFloat(row.cbdPercentage) || 0,
          wholesalePricePerUnit: parseFloat(row.wholesalePricePerUnit) || 0,
          currentStockQuantity: parseInt(row.currentStockQuantity, 10) || 0,
          expirationDate: row.expirationDate?.trim() || undefined,
          strainType: row.strainType?.trim() || 'Other',
          productCategory: row.productCategory?.trim() || 'Other',
          unitOfMeasure: row.unitOfMeasure?.trim() || 'Each',
          supplier: row.supplier?.trim() || 'Unknown Supplier',
        })).filter(row => row.metrcPackageId); // Filter out rows without a METRC ID

        if(data.length === 0) {
            setError("No valid data rows found in the CSV. Make sure 'metrcPackageId' is present for each row.");
        }

        setParsedData(data);
        setIsLoading(false);
      },
      error: (err: any) => {
        setError(`Error parsing CSV file: ${err.message}`);
        setIsLoading(false);
      },
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
  });

  const handleImportClick = () => {
    const newTemplates: ProductTemplate[] = [];
    const newBatches: ProductBatch[] = [];

    const templateMap = new Map<string, ProductTemplate>();
    existingTemplates.forEach(t => templateMap.set(t.productName.toLowerCase(), t));

    parsedData.forEach(row => {
      let template = templateMap.get(row.productName.toLowerCase());

      if (!template) {
        template = {
          id: `pt_imported_${Date.now()}_${newTemplates.length}`,
          productName: row.productName,
          strainType: row.strainType || 'Other',
          productCategory: row.productCategory || 'Other',
          unitOfMeasure: row.unitOfMeasure || 'Each',
          supplier: row.supplier || 'Imported Supplier',
          activeStatus: true,
        };
        newTemplates.push(template);
        templateMap.set(row.productName.toLowerCase(), template);
      }

      const newBatch: ProductBatch = {
        id: `batch_imported_${Date.now()}_${newBatches.length}`,
        productTemplateId: template.id,
        metrcPackageId: row.metrcPackageId,
        thcPercentage: row.thcPercentage,
        cbdPercentage: row.cbdPercentage,
        wholesalePricePerUnit: row.wholesalePricePerUnit,
        currentStockQuantity: row.currentStockQuantity,
        unitOfMeasure: template.unitOfMeasure,
        productionDate: new Date().toISOString(),
        expirationDate: row.expirationDate ? new Date(row.expirationDate).toISOString() : undefined,
        activeStatus: true,
      };
      newBatches.push(newBatch);
    });

    onImport(newTemplates, newBatches);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="sm:max-w-4xl bg-card max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-headline">Import Products from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file with product batch data. New product templates will be created automatically if they don't exist.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto p-1">
          {!fileName ? (
            <div
              {...getRootProps()}
              className={`mt-4 flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-border'}`}
            >
              <input {...getInputProps()} />
              <UploadCloud className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-semibold">
                {isDragActive ? 'Drop the file here...' : 'Drag & drop a CSV file here, or click to select'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Required headers: {EXPECTED_HEADERS.join(', ')}
              </p>
               <p className="text-sm text-muted-foreground mt-1">
                Optional headers: {OPTIONAL_HEADERS.join(', ')}
              </p>
            </div>
          ) : (
            <div className="mt-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                <File className="h-6 w-6 text-primary" />
                <span className="font-medium">{fileName}</span>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
              <p className="mt-2 text-muted-foreground">Parsing file...</p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-md">
              <h4 className="font-semibold">Error</h4>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {parsedData.length > 0 && (
            <div className="mt-6">
                <div className="flex items-center gap-3 p-3 text-sm text-primary bg-primary/10 rounded-md border border-primary/20 mb-4">
                    <ListChecks className="h-5 w-5 flex-shrink-0" />
                    <p>Review the parsed data below. New product templates will be created for unrecognized product names. Click "Import Data" to confirm.</p>
                </div>
              <div className="max-h-96 overflow-y-auto border rounded-md">
                <Table>
                  <TableHeader className="sticky top-0 bg-card">
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>METRC ID</TableHead>
                      <TableHead className="text-right">THC%</TableHead>
                      <TableHead className="text-right">CBD%</TableHead>
                      <TableHead className="text-right">Price/Unit</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{row.productName}</TableCell>
                        <TableCell>{row.metrcPackageId}</TableCell>
                        <TableCell className="text-right">{row.thcPercentage.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{row.cbdPercentage.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${row.wholesalePricePerUnit.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{row.currentStockQuantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
          <Button
            type="button"
            onClick={handleImportClick}
            disabled={parsedData.length === 0 || isLoading || !!error}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Import Data ({parsedData.length} batches)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

