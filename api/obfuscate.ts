import { VercelRequest, VercelResponse } from '@vercel/node';
// Mengambil fungsi utama dari folder lib yang kamu copy
import { Obfuscator } from '../lib/obfuscator'; 

export default function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'POST') {
        try {
            const { code, settings } = req.body;
            
            if (!code) {
                return res.status(400).json({ error: 'Kode Lua tidak boleh kosong' });
            }

            // Inisialisasi mesin obfuscator dengan settingan dari UI kita
            const obfuscator = new Obfuscator(settings);
            
            // Menjalankan proses obfuscate
            const result = obfuscator.obfuscate(code);
            
            // Mengirimkan hasil kembali ke script.js kita
            return res.status(200).json({ obfuscatedCode: result });
            
        } catch (error: any) {
            console.error("Obfuscation Error:", error);
            return res.status(500).json({ error: error.message || 'Gagal memproses kode.' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
