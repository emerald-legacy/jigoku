export const printedKeywords = [
    'ancestral',
    'corrupted',
    'courtesy',
    'covert',
    'eminent',
    'ephemeral',
    'limited',
    'no duels',
    'peaceful',
    'pride',
    'rally',
    'thriving',
    'restricted',
    'sincerity'
] as const;

export type PrintedKeyword = (typeof printedKeywords)[number];

const ValidKeywords = new Set<string>(printedKeywords);

export interface ParsedKeywords {
    keywords: PrintedKeyword[];
    disguisedTraits: string[];
    allowedAttachmentTraits: string[];
}

export function parseKeywords(text: string): ParsedKeywords {
    const potentialKeywords: string[] = [];
    for(const line of text.split('\n')) {
        for(const k of line.slice(0, -1).split('.')) {
            potentialKeywords.push(k.trim());
        }
    }

    const keywords: PrintedKeyword[] = [];
    const disguisedTraits: string[] = [];
    let allowedAttachmentTraits: string[] = [];

    for(const keyword of potentialKeywords) {
        if(ValidKeywords.has(keyword)) {
            keywords.push(keyword as PrintedKeyword);
        } else if(keyword.startsWith('disguised ')) {
            disguisedTraits.push(keyword.replace('disguised ', ''));
        } else if(keyword.startsWith('no attachments except')) {
            allowedAttachmentTraits = keyword.replace('no attachments except ', '').split(' or ');
        } else if(keyword.startsWith('no attachments,')) {
            // catch all for statements that are too hard to parse automatically
        } else if(keyword.startsWith('no attachments')) {
            allowedAttachmentTraits = ['none'];
        }
    }

    return { keywords, disguisedTraits, allowedAttachmentTraits };
}
