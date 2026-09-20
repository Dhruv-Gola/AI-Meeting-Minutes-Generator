import { useEffect, useState } from "react";
import API from "../services/api";

function AdminDashboard({ user, onLogout }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [systemConfig, setSystemConfig] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [configValues, setConfigValues] = useState({});
  const [promptTemplates, setPromptTemplates] = useState([]);
  const [promptValues, setPromptValues] = useState({});

  useEffect(() => {
    const loadAdminDashboard = async () => {
      try {
        const response = await API.get("/admin/dashboard");

        if (response.data.success) {
          setMessage(response.data.message);
        } else {
          setError("Unable to load admin dashboard.");
        }

        const configResponse = await API.get("/admin/system-config");

        if (configResponse.data.success) {
          setSystemConfig(configResponse.data.data);
        }

        const templateResponse = await API.get(
  "/admin/prompt-templates"
);

if (templateResponse.data.success) {
  setPromptTemplates(templateResponse.data.data);
}


      } catch (error) {
        setError(
          error.response?.data?.message ||
            "You are not authorized to access the Admin Portal."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAdminDashboard();
  }, []);

  return (
    <div className="admin-dashboard">
      <header className="app-header">
        <div>
          <h1>AI Meeting Minutes Generator</h1>
          <p>Admin Portal</p>
        </div>

        <button onClick={onLogout}>Logout</button>
      </header>

      <main className="admin-content">
        <h2>Admin Dashboard</h2>

        <p>
          Welcome, <strong>{user.name}</strong>
        </p>

        {loading && <p>Loading admin dashboard...</p>}

        {message && <p>{message}</p>}

        {error && <p className="login-error">{error}</p>}

        <div className="admin-card">
          <h3>Administrator</h3>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>

        <div className="admin-card">
  <h3>System Configuration</h3>

  {systemConfig.length === 0 ? (
    <p>No system configuration found.</p>
  ) : (
    systemConfig.map((config) => (
      <div key={config.config_id}>
        <p>
  <strong>{config.config_key}</strong>:{" "}
  <input
    type="text"
    value={
      configValues[config.config_key] ?? config.config_value
    }
    onChange={(e) =>
      setConfigValues({
        ...configValues,
        [config.config_key]: e.target.value
      })
    }
  />
</p>


        {config.description && <p>{config.description}</p>}
      </div>
    ))
  )}

  <button
    onClick={async () => {
      try {
        setSaving(true);
        setSaveMessage("");

        const settings = {};

        systemConfig.forEach((config) => {
          settings[config.config_key] =
            configValues[config.config_key] ?? config.config_value;
        });

        const response = await API.put(
          "/admin/system-config",
          settings
        );

        if (response.data.success) {
          setSystemConfig(response.data.data);
          setSaveMessage("Settings saved successfully.");
        }
      } catch (error) {
        setSaveMessage(
          error.response?.data?.message ||
            "Failed to save settings."
        );
      } finally {
        setSaving(false);
      }
    }}
    disabled={saving}
  >
    {saving ? "Saving..." : "Save Settings"}
  </button>

  {saveMessage && <p>{saveMessage}</p>}
</div> 

<div className="admin-card">
  <h3>Prompt Templates</h3>

  {promptTemplates.length === 0 ? (
    <p>No prompt templates found.</p>
  ) : (
    promptTemplates.map((template) => (
      <div key={template.template_id}>
        <p>
          <strong>{template.name}</strong>
        </p>

        <textarea
  rows="6"
  value={promptValues[template.template_id] ?? template.prompt}
  onChange={(e) =>
    setPromptValues({
      ...promptValues,
      [template.template_id]: e.target.value
    })
  }
/>

        <p>Template used for AI meeting minutes generation.</p>
        <button
  onClick={async () => {
    try {
      const response = await API.put(
        `/admin/prompt-templates/${template.template_id}`,
        {
          prompt:
            promptValues[template.template_id] ?? template.prompt
        }
      );

      if (response.data.success) {
        setPromptTemplates(
          promptTemplates.map((item) =>
            item.template_id === template.template_id
              ? response.data.data
              : item
          )
        );

        setPromptValues({
          ...promptValues,
          [template.template_id]: response.data.data.prompt
        });
      }
    } catch (error) {
      console.error("Failed to save prompt template:", error);
    }
  }}
>
  Save Template
</button>
      </div>
    ))
  )}
</div>

      </main>
    </div>
  );
}

export default AdminDashboard;