import mongoose from "mongoose";

const measureSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    department: {
        type: String,
        required: [true, "Lütfen bir birim seçiniz."],
        enum: ["Bilgi Güvenliği", "Bilişim Altyapı", "Elektronik", "Koruma Güvenlik", "Sunucu", "Teknik", "Yazılım"]
    },
    measureNumber: {
        type: String,
        required: [true, "Tedbir numarası zorunludur (Örn: 3.1.1.1)."],
        trim: true
    },
    status2025: {
        type: String,
        required: true,
        enum: ["Uygulanabilir Değil", "Uygulanmadı", "Kısmen Uygulandı", "Çoğunlukla Uygulandı", "Uygulandı"]
    },
    status2026: {
        type: String,
        required: true,
        enum: ["Uygulanabilir Değil", "Uygulanmadı", "Kısmen Uygulandı", "Çoğunlukla Uygulandı", "Uygulandı"]
    },
    changes: { type: String, default: "" },
    deficiencies: { type: String, default: "" },
    todo: { type: String, default: "" },
    policy: { type: String, default: "" }
}, { timestamps: true });

const Measure = mongoose.model("Measure", measureSchema);

export default Measure;