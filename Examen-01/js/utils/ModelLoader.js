// Utilidad para cargar modelos GLB
const ModelLoader = {
  async cargarModelo(path, filename, scene) {
    try {
      const result = await BABYLON.SceneLoader.ImportMeshAsync("", path, filename, scene);
      return result.meshes[0];
    } catch (error) {
      console.error(`Error cargando ${filename}:`, error);
      return null;
    }
  }
};
