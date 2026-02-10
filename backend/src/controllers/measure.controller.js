import Measure from "../models/Measure.js";

export const getMeasureById = async (req, res) => {
    try {
        const measure = await Measure.findById(req.params.id);

        if (!measure) return res.status(404).json({ message: "Tedbir bulunamadı." });

        res.status(200).json(measure);
    } catch (error) {
        res.status(500).json({ message: "Veri getirilemedi." });
    }
};

export const updateMeasure = async (req, res) => {
    try {
        const measure = await Measure.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!measure) return res.status(404).json({ message: "Tedbir bulunamadı." });

        res.status(200).json(measure);
    } catch (error) {
        res.status(500).json({ message: "Güncelleme başarısız." });
    }
};

export const createMeasure = async (req, res) => {
    try {
        const newMeasure = new Measure({
            user: req.user.id,
            ...req.body
        });

        const savedMeasure = await newMeasure.save();

        res.status(201).json(savedMeasure);
    } catch (error) {
        res.status(500).json({ message: error.message || "Tedbir oluşturulurken hata oluştu." });
    }
};

export const getMeasures = async (_, res) => {
    try {
        const measures = await Measure.find().sort({ createdAt: -1 });

        res.status(200).json(measures);
    } catch (error) {
        res.status(500).json({ message: "Veriler getirilemedi." });
    }
};

export const deleteMeasure = async (req, res) => {
    try {
        await Measure.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Tedbir silindi." });
    } catch (error) {
        res.status(500).json({ message: "Silme işlemi başarısız." });
    }
};