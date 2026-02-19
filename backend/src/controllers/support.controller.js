import { sendEmail } from "../libs/email.js";

export const sendSupportEmail = async (req, res) => {
    try {
        const { department, measureNumber, description } = req.body;
        const user = req.user;

        if (!department || !measureNumber || !description) {
            return res.status(400).json({ message: "Lütfen tüm alanları doldurun." });
        }

        const subject = `DDO Tracker - Yeni Hata Bildirimi (${measureNumber})`;
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h2 style="color: #ef4444; border-bottom: 2px solid #fee2e2; padding-bottom: 10px;">Yeni Destek / Hata Talebi</h2>
                <p><strong>Bildiren Kullanıcı:</strong> ${user.username} (${user.email})</p>
                <p><strong>İlgili Birim:</strong> ${department}</p>
                <p><strong>İlgili Tedbir No:</strong> ${measureNumber}</p>
                <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #ef4444; margin-top: 20px;">
                    <h4 style="margin-top: 0; color: #334155;">Hata Açıklaması:</h4>
                    <p style="color: #475569; white-space: pre-wrap;">${description}</p>
                </div>
                <p style="font-size: 12px; color: #94a3b8; margin-top: 30px; text-align: center;">Bu mail DDO Tracker sistemi tarafından otomatik gönderilmiştir.</p>
            </div>
        `;

        await sendEmail("acigir@iski.gov.tr", subject, htmlContent);

        res.status(200).json({ message: "Destek talebiniz başarıyla iletildi." });
    } catch (error) {
        console.error("Destek maili gönderim hatası:", error);

        res.status(500).json({ message: "Talebiniz gönderilirken bir sunucu hatası oluştu." });
    }
};