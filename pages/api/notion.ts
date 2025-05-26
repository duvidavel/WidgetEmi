import type { NextApiRequest, NextApiResponse } from 'next';
import notion from '@/lib/notion'; // Assumindo que @/lib/notion configura e exporta o cliente Notion

// Defina um tipo para o item processado para melhor clareza
type ProcessedItem = {
  id: string; // Adicionando o ID da página, útil para chaves no React
  name: string | null;
  date: string | null;
  description: string | null;
  media: string[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProcessedItem[] | { error: string }> // Tipo de resposta atualizado
) {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;
    if (!databaseId) {
      // É uma boa prática verificar se a variável de ambiente existe
      console.error('NOTION_DATABASE_ID não está definido.');
      return res.status(500).json({ error: 'Configuração do servidor incompleta: NOTION_DATABASE_ID não definido.' });
    }

    const response = await notion.databases.query({
      database_id: databaseId,
      // Você pode adicionar sorts aqui se quiser que o Notion já traga ordenado
      // por exemplo, para ordenar pela propriedade "Data" descendentemente:
      // sorts: [
      //   {
      //     property: 'Data',
      //     direction: 'descending',
      //   },
      // ],
    });

    const items = response.results.map((page: any): ProcessedItem | null => {
      // Adicionando verificação para garantir que 'page.properties' existe
      if (!page.properties) return null;

      const nameProp = page.properties["Nome"]; // Assumindo que a propriedade se chama "Nome"
      const dateProp = page.properties["Data"];
      const descriptionProp = page.properties["Descricao"]; // Assumindo que a propriedade se chama "Descricao"
      const mediaProp = page.properties["Media"];

      // 🖼️ Pega todas as imagens
      let mediaUrls: string[] = [];
      if (mediaProp) { // Verifica se mediaProp existe
        if (mediaProp.type === "files" && mediaProp.files) {
          mediaUrls = mediaProp.files
            .filter((file: any) => file.type === "file" && file.file?.url) // Verifica se é do tipo 'file' e tem url
            .map((file: any) => file.file.url);
        } else if (mediaProp.type === "url" && mediaProp.url) {
          mediaUrls = [mediaProp.url];
        }
        // Adicione mais lógica aqui se suas mídias puderem vir de outros tipos de propriedade
      }


      // 📅 Formata a data
      let dateString: string | null = null;
      if (dateProp && dateProp.type === "date" && dateProp.date?.start) {
        const date = new Date(dateProp.date.start);
        dateString = date.toLocaleDateString("pt-BR", { timeZone: 'UTC' }); // Formato DD/MM/AAAA. Adicionado timeZone para consistência.
      }

      // ✍️ Pega o Nome (Título)
      let nameString: string | null = null;
      if (nameProp && nameProp.type === "title" && nameProp.title?.length > 0) {
        nameString = nameProp.title[0].plain_text;
      }

      // 📝 Pega a Descrição
      let descriptionString: string | null = null;
      if (descriptionProp && descriptionProp.type === "rich_text" && descriptionProp.rich_text?.length > 0) {
        descriptionString = descriptionProp.rich_text.map((text: any) => text.plain_text).join("");
      }

      // Só retorna o item se tivermos pelo menos uma data ou mídia para exibir
      // Você pode ajustar essa lógica conforme necessário
      if (!dateString && mediaUrls.length === 0) {
          // return null; // Ou talvez você queira itens mesmo sem data/mídia, dependendo do caso
      }

      return {
        id: page.id, // Incluindo o ID da página
        name: nameString,
        date: dateString,
        description: descriptionString,
        media: mediaUrls,
      };
    });

    // Remove nulos e responde
    const validItems = items.filter((item): item is ProcessedItem => item !== null);
    res.status(200).json(validItems);

  } catch (error: any) {
    console.error('Erro ao buscar dados do Notion:', error);
    // Fornece uma mensagem de erro mais detalhada se possível
    const errorMessage = error.message || 'Ocorreu um erro desconhecido ao processar sua solicitação.';
    res.status(500).json({ error: `Falha ao buscar dados do Notion: ${errorMessage}` });
  }
}