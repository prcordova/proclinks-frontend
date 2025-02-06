declare module 'next/navigation' {
  export const useRouter: () => {
    push: (url: string) => void
    // ... outros métodos necessários
  }
} 