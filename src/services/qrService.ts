import QRCode from 'qrcode';
import { supabase } from "@/integrations/supabase/client";

export interface PPWRQRData {
  type: 'PPWR';
  reportId: string;
  boxName: string;
  voidSpace: number;
  compliant: boolean;
  verificationUrl: string;
}

export interface DPPQRData {
  type: 'DPP';
  reportId: string;
  productName: string;
  carbonKg: number;
  recyclability: number;
  verificationUrl: string;
}

// Generate QR code as data URL
export const generateQRCodeDataUrl = async (data: object): Promise<string> => {
  const options = {
    width: 512,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  };

  return QRCode.toDataURL(JSON.stringify(data), options);
};

// Convert data URL to Blob
const dataUrlToBlob = async (dataUrl: string): Promise<Blob> => {
  const response = await fetch(dataUrl);
  return response.blob();
};

// Upload QR code to Supabase Storage
export const uploadQRCode = async (
  dataUrl: string,
  userId: string,
  filename: string
): Promise<string> => {
  const blob = await dataUrlToBlob(dataUrl);
  const filePath = `${userId}/qr/${filename}.png`;

  const { error } = await supabase.storage
    .from('compliance-assets')
    .upload(filePath, blob, {
      contentType: 'image/png',
      upsert: true
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('compliance-assets')
    .getPublicUrl(filePath);

  return publicUrl;
};

// Generate and upload PPWR QR code
export const generatePPWRQR = async (
  reportId: string,
  userId: string,
  ppwrData: {
    boxName: string;
    voidSpace: number;
    compliant: boolean;
  }
): Promise<string> => {
  const baseUrl = window.location.origin;
  
  const qrData: PPWRQRData = {
    type: 'PPWR',
    reportId,
    boxName: ppwrData.boxName,
    voidSpace: ppwrData.voidSpace,
    compliant: ppwrData.compliant,
    verificationUrl: `${baseUrl}/verify/ppwr/${reportId}`
  };

  const dataUrl = await generateQRCodeDataUrl(qrData);
  return uploadQRCode(dataUrl, userId, `ppwr-${reportId}`);
};

// Generate and upload DPP QR code
export const generateDPPQR = async (
  reportId: string,
  userId: string,
  dppData: {
    productName: string;
    carbonKg: number;
    recyclability: number;
  }
): Promise<string> => {
  const baseUrl = window.location.origin;
  
  const qrData: DPPQRData = {
    type: 'DPP',
    reportId,
    productName: dppData.productName,
    carbonKg: dppData.carbonKg,
    recyclability: dppData.recyclability,
    verificationUrl: `${baseUrl}/verify/dpp/${reportId}`
  };

  const dataUrl = await generateQRCodeDataUrl(qrData);
  return uploadQRCode(dataUrl, userId, `dpp-${reportId}`);
};
