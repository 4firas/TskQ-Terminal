import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const dataFile = path.join(process.cwd(), 'data', 'artworks.json')
const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

async function readData() {
  try {
    const json = await fs.readFile(dataFile, 'utf8')
    return JSON.parse(json)
  } catch {
    return []
  }
}

async function writeData(data: any) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true })
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2))
}

export async function GET() {
  try {
    const data = await readData()
    return NextResponse.json(data)
  } catch (e) {
    return new NextResponse('Failed to read data', { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const title = formData.get('title') as string | null
  const description = formData.get('description') as string | null
  const file = formData.get('file') as File | null

  if (!title || !description || !file) {
    return new NextResponse('Invalid form data', { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  await fs.mkdir(uploadsDir, { recursive: true })
  const filename = `${Date.now()}-${file.name}`
  const filepath = path.join(uploadsDir, filename)
  await fs.writeFile(filepath, buffer)

  const newArtwork = {
    id: Date.now(),
    title,
    description,
    filename: path.join('uploads', filename),
  }
  const data = await readData()
  data.push(newArtwork)
  await writeData(data)

  return NextResponse.json(newArtwork)
}
