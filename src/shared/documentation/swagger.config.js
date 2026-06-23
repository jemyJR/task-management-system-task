import fs from "fs";
import path from "path";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import { fileURLToPath } from "url";
import YAML from "yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function setupSwagger(app) {
  const mainSpecPath = path.join(__dirname, "openapi.yaml");
  const mainSpec = YAML.parse(fs.readFileSync(mainSpecPath, "utf8"));

  const loadAllYaml = (dir) => {
    const merged = {};
    fs.readdirSync(dir, { withFileTypes: true }).forEach((item) => {
      const full = path.join(dir, item.name);
      if (item.isDirectory()) {
        Object.assign(merged, loadAllYaml(full));
      } else if (/\.ya?ml$/.test(item.name)) {
        Object.assign(merged, YAML.parse(fs.readFileSync(full, "utf8")));
      }
    });
    return merged;
  };

  const schemasDir = path.join(__dirname, "schemas");
  if (fs.existsSync(schemasDir)) {
    mainSpec.components = mainSpec.components || {};
    mainSpec.components.schemas = {
      ...(mainSpec.components.schemas || {}),
      ...loadAllYaml(schemasDir),
    };
  }
  const pathsDir = path.join(__dirname, "paths");
  if (fs.existsSync(pathsDir)) {
    mainSpec.paths = {
      ...(mainSpec.paths || {}),
      ...loadAllYaml(pathsDir),
    };
  }

  const swaggerSpec = swaggerJSDoc({
    definition: mainSpec,
    apis: [],
  });

  const hideTopbarCss = `.swagger-ui .topbar { display: none !important; }`;

  app.use(
    "/api-docs",
    swaggerUI.serve,
    swaggerUI.setup(swaggerSpec, {
      customCss: hideTopbarCss,
      customSiteTitle: "Task Management API Docs",
      customfavIcon: "/favicon.ico",
      swaggerOptions: {
        filter: true,
      },
    }),
  );
}
