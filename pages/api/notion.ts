import type { NextApiRequest, NextApiResponse } from 'next';
import notion from '@/lib/notion';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const databaseId = process.env.NOTION_DATABASE_ID!;
  const response = await notion.databases.query({ database_id: databaseId });

  const items = response.results.map((page: any) => {
    const mediaProp = page.properties["Media"];
    const dateProp = page.properties["Data"];

    // Verifica se ambos existem
    if (!mediaProp || !dateProp) return null;

    // 🖼️ Pega todas as imagens
    let mediaUrls: string[] = [];

    if (mediaProp.type === "files") {
      mediaUrls = mediaProp.files
        .filter((file: any) => file.file?.url)
        .map((file: any) => file.file.url);
    } else if (mediaProp.type === "url" && mediaProp.url) {
      mediaUrls = [mediaProp.url];
    }

    // 📅 Formata a data
    let dateString = '';
    if (dateProp.type === "date" && dateProp.date?.start) {
      const date = new Date(dateProp.date.start);
      dateString = date.toLocaleDateString("pt-BR"); // Formato 20/05/2025
    }

    return {
      date: dateString,
      media: mediaUrls,
    };
  });

  // Remove nulos e responde
  res.status(200).json(items.filter(Boolean));
}
