import { api } from '@/shared/configs/api';

export interface PageSettings {
  primary_color: string;
  title: string;
  subtitle: string;
  brand_image: string;
}

export async function updatePageSettings(settings: PageSettings): Promise<PageSettings> {
  const response = await api.post('users/save-page-settings', { 
    json: {
      settings: JSON.stringify(settings)
    } 
  }).json<{ data: PageSettings }>();
  return response.data;
}

export async function uploadBrandImage(file: File): Promise<string> {
  try {
    // Gerar um nome único para o arquivo
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const fileType = file.type;
    
    // Obter URL pré-assinada do S3 através da API
    const presignedResponse = await api.post('upload/presigned', { 
      json: { fileName, fileType } 
    }).json<{ 
      presignedUrl: string;
      fileUrl: string;
    }>();
    
    // Fazer upload direto para o S3 usando a URL pré-assinada
    await fetch(presignedResponse.presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': fileType,
      },
    });
    
    // Retornar a URL pública do arquivo
    return presignedResponse.fileUrl;
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    throw new Error('Falha ao fazer upload da imagem');
  }
} 