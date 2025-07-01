import { api } from '@/shared/configs/api';

export interface PageSettings {
  primary_color: string;
  title: string;
  subtitle: string;
  brand_image: string;
}

export async function updatePageSettings(settings: PageSettings): Promise<PageSettings> {
  const response = await api
    .post('users/save-page-settings', {
      json: {
        settings: JSON.stringify(settings),
      },
    })
    .json<{ data: PageSettings }>();
  return response.data;
}

export async function uploadBrandImage(file: File): Promise<string> {
  try {
    // Criar um FormData para enviar o arquivo diretamente para o backend
    const formData = new FormData();
    formData.append('file', file);
    
    // Enviar o arquivo diretamente para o backend, que cuidará do upload para o S3
    const response = await api
      .post('upload/brand-image', {
        body: formData,
        timeout: 30000, // Aumentar timeout para 30 segundos
      })
      .json<{ fileUrl: string }>();
    
    // Retornar a URL pública do arquivo
    return response.fileUrl;
  } catch (error) {
    // Verificar se é um erro de timeout
    if (error instanceof Error && error.name === 'TimeoutError') {
      throw new Error('A requisição demorou muito para responder. Tente novamente mais tarde.');
    }
    
    // Erro genérico
    throw new Error('Falha ao fazer upload da imagem: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
  }
}
