import { supabase } from '@/integrations/supabase/client';

/**
 * Project Codes:
 * E = Enterprise
 * S = Startup
 * M = Medium Business
 * P = Personal/Small
 */
export type ProjectCode = 'E' | 'S' | 'M' | 'P';

/**
 * Platform Codes:
 * A = App (Mobile)
 * W = Web
 * B = Both (App + Web)
 * H = Hybrid
 */
export type PlatformCode = 'A' | 'W' | 'B' | 'H';

/**
 * Convert month number (1-12) to hexadecimal (1-C)
 */
export function getHexMonth(month: number): string {
    if (month < 1 || month > 12) {
        throw new Error('Month must be between 1 and 12');
    }
    return month.toString(16).toUpperCase();
}

/**
 * Get fiscal year string (e.g., "2425" for FY 2024-25)
 * Assumes fiscal year starts on April 1st
 */
export function getFiscalYear(date: Date = new Date()): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 0-indexed

    if (month >= 4) {
        // April onwards - current FY
        return `${year.toString().slice(-2)}${(year + 1).toString().slice(-2)}`;
    } else {
        // Jan-Mar - previous FY
        return `${(year - 1).toString().slice(-2)}${year.toString().slice(-2)}`;
    }
}

/**
 * Get next sequence value from database
 */
async function getNextSequence(
    sequenceType: 'client' | 'quotation' | 'invoice',
    clientId?: string,
    fiscalYear?: string
): Promise<number> {
    try {
        // Call the database function directly
        const { data, error } = await supabase
            .from('id_sequences')
            .select('current_value')
            .eq('sequence_type', sequenceType)
            .eq('client_id', clientId || null)
            .eq('fiscal_year', fiscalYear || null)
            .maybeSingle();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
            throw error;
        }

        // If sequence doesn't exist, create it
        if (!data) {
            const { data: newData, error: insertError } = await supabase
                .from('id_sequences')
                .insert({
                    sequence_type: sequenceType,
                    client_id: clientId || null,
                    fiscal_year: fiscalYear || null,
                    current_value: 1,
                })
                .select('current_value')
                .single();

            if (insertError) throw insertError;
            return newData.current_value;
        }

        // Update existing sequence
        const newValue = data.current_value + 1;
        const { error: updateError } = await supabase
            .from('id_sequences')
            .update({ current_value: newValue, updated_at: new Date().toISOString() })
            .eq('sequence_type', sequenceType)
            .eq('client_id', clientId || null)
            .eq('fiscal_year', fiscalYear || null);

        if (updateError) throw updateError;
        return newValue;
    } catch (error: any) {
        console.error('Error getting sequence:', error);
        throw new Error(`Failed to generate sequence: ${error.message}`);
    }
}

/**
 * Generate Client ID
 * Format: <ProjectCode><PlatformCode><Constant><AutoIncrement>-<Country>-<Year><HexMonth>
 * Example: EA701-IND-25C
 */
export async function generateClientId(
    projectCode: ProjectCode,
    platformCode: PlatformCode,
    countryCode: string = 'IND'
): Promise<{ clientId: string; sequenceNumber: number }> {
    const sequenceNumber = await getNextSequence('client');
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const hexMonth = getHexMonth(now.getMonth() + 1);

    // Format: EA701-IND-25C
    const sequenceStr = sequenceNumber.toString().padStart(2, '0');
    const clientId = `${projectCode}${platformCode}7${sequenceStr}-${countryCode.toUpperCase()}-${year}${hexMonth}`;

    return { clientId, sequenceNumber };
}

/**
 * Generate Quotation ID
 * Format: QN<Version>-<ClientID>-<AutoIncrement>
 * Example: QN1-EA701-001
 */
export async function generateQuotationId(
    fullClientId: string,
    version: number = 1
): Promise<string> {
    // Extract base client ID (EA701 from EA701-IND-25C)
    const baseClientId = fullClientId.split('-')[0];

    const sequenceNumber = await getNextSequence('quotation', baseClientId);
    const sequenceStr = sequenceNumber.toString().padStart(3, '0');

    return `QN${version}-${baseClientId}-${sequenceStr}`;
}

/**
 * Generate Invoice ID
 * Format: IN<Version>-FY<FinancialYear>-<ClientID>-<AutoIncrement>
 * Example: IN1-FY25-EA701-001
 */
export async function generateInvoiceId(
    fullClientId: string,
    version: number = 1,
    date: Date = new Date()
): Promise<string> {
    // Extract base client ID (EA701 from EA701-IND-25C)
    const baseClientId = fullClientId.split('-')[0];

    const fiscalYear = getFiscalYear(date);
    const fyShort = fiscalYear.slice(0, 2); // "24" from "2425"

    const sequenceNumber = await getNextSequence('invoice', baseClientId, fiscalYear);
    const sequenceStr = sequenceNumber.toString().padStart(3, '0');

    return `IN${version}-FY${fyShort}-${baseClientId}-${sequenceStr}`;
}

/**
 * Parse Client ID to extract components
 */
export function parseClientId(clientId: string): {
    projectCode: string;
    platformCode: string;
    sequenceNumber: string;
    countryCode: string;
    year: string;
    month: string;
} | null {
    const match = clientId.match(/^([A-Z])([A-Z])7(\d{2})-([A-Z]{3})-(\d{2})([0-9A-C])$/);
    if (!match) return null;

    return {
        projectCode: match[1],
        platformCode: match[2],
        sequenceNumber: match[3],
        countryCode: match[4],
        year: match[5],
        month: match[6],
    };
}

/**
 * Validate Client ID format
 */
export function isValidClientId(clientId: string): boolean {
    return parseClientId(clientId) !== null;
}
