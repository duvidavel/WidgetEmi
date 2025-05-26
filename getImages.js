import notion from "./notion";

export async function getImageUrlsFromDatabase(databaseId) {
  const response = await notion.databases.query({ database_id: databaseId });

  const urls = response.results.map((page) => {
    const imageProp = page.properties["Media"];
    if (!imageProp) return null;

    // Se for imagem enviada direto (tipo upload no Notion)
    if (imageProp.type === "Media" && imageProp.files.length > 0) {
      return imageProp.files[0]?.file?.url;
    }

    // Se for um campo de URL (link de imagem)
    if (imageProp.type === "url") {
      return imageProp.url;
    }

    return null;
  });

  return urls.filter(Boolean);
}
