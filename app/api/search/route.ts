import { NextResponse } from 'next/server';
import { generateSearchReport } from '@/lib/report/generateSearchReport';

export async function GET(req: Request) {
  try {
    const { keyword } = await req.json();

    const report = await generateSearchReport(keyword);

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('검색 api 에러', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : '검색 리포트 생성 실패',
    }, { status:400});
  }
}
