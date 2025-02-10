export const getImageUrl = (path: string | null) => {
  if (!path) return null;
  
  // Se a URL já começa com https://, é uma URL do S3
  if (path.startsWith('https://')) {
    return path;
  }
  
  // Se começa com /uploads/, é uma URL antiga
  if (path.startsWith('/uploads/')) {
    return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
  }
  
  // Para outros casos, assume que é um path do S3
  return `${process.env.NEXT_PUBLIC_S3_URL}${path}`;
}; 