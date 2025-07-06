import StudioPage from '@/app/page'

interface PageProps {
  params: Promise<{ canvasId: string }>
}

export default function CanvasStudioPage({ params }: PageProps) {
  return <StudioPage params={params} />
}