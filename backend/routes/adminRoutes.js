const express = require("express");
const pool = require("../config/db");

const router = express.Router();

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

router.get(
    "/dashboard",
    authenticateToken,
    authorizeRoles("admin"),
    (req, res) => {
        res.json({
            success: true,
            message: "Welcome to the Admin Portal",
            user: req.user
        });
    }
);

router.get(
    "/prompt-templates",
    authenticateToken,
    authorizeRoles("admin"),
    async (req, res) => {
        try {
            const result = await pool.query(
                "SELECT template_id, name, prompt FROM prompt_templates ORDER BY template_id"
            );

            res.json({
                success: true,
                data: result.rows
            });
        } catch (error) {
            console.error("Failed to load prompt templates:", error);

            res.status(500).json({
                success: false,
                message: "Failed to load prompt templates"
            });
        }
    }
);

router.put(
    "/prompt-templates/:id",
    authenticateToken,
    authorizeRoles("admin"),
    async (req, res) => {
        try {
            const { id } = req.params;
            const { prompt } = req.body;

            if (!prompt || !prompt.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Prompt is required"
                });
            }

            const result = await pool.query(
                `UPDATE prompt_templates
                 SET prompt = $1
                 WHERE template_id = $2
                 RETURNING template_id, name, prompt`,
                [prompt.trim(), id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Prompt template not found"
                });
            }

            res.json({
                success: true,
                message: "Prompt template updated successfully",
                data: result.rows[0]
            });
        } catch (error) {
            console.error("Failed to update prompt template:", error);

            res.status(500).json({
                success: false,
                message: "Failed to update prompt template"
            });
        }
    }
);

router.get(
    "/system-config",
    authenticateToken,
    authorizeRoles("admin"),
    async (req, res) => {
        try {
            const result = await pool.query(
                "SELECT config_id, config_key, config_value, description, updated_at FROM system_config ORDER BY config_id"
            );

            res.json({
                success: true,
                data: result.rows
            });
        } catch (error) {
            console.error("Failed to load system config:", error);

            res.status(500).json({
                success: false,
                message: "Failed to load system configuration"
            });
        }
    }
);

router.put(
    "/system-config",
    authenticateToken,
    authorizeRoles("admin"),
    async (req, res) => {
        try {
            const { ai_provider, ai_model, max_transcript_size_mb } = req.body;

            const settings = {
                ai_provider,
                ai_model,
                max_transcript_size_mb
            };

            for (const [key, value] of Object.entries(settings)) {
                if (value !== undefined) {
                    await pool.query(
                        `UPDATE system_config
                         SET config_value = $1,
                             updated_at = CURRENT_TIMESTAMP
                         WHERE config_key = $2`,
                        [String(value), key]
                    );
                }
            }

            const result = await pool.query(
                "SELECT config_id, config_key, config_value, description, updated_at FROM system_config ORDER BY config_id"
            );

            res.json({
                success: true,
                message: "System configuration updated successfully",
                data: result.rows
            });
        } catch (error) {
            console.error("Failed to update system config:", error);

            res.status(500).json({
                success: false,
                message: "Failed to update system configuration"
            });
        }
    }
);

module.exports = router;
