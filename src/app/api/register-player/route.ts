import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { playerId, nickname, deviceDetails } = await request.json();

    if (!playerId || !nickname) {
      return NextResponse.json(
        { error: 'Missing playerId or nickname' },
        { status: 400 }
      );
    }

    // 1. Get the ghost-whisperer story
    const story = await prisma.story.findUnique({
      where: { slug: 'ghost-whisperer' },
    });

    if (!story) {
      return NextResponse.json(
        { error: 'Ghost Whisperer story not seeded' },
        { status: 404 }
      );
    }

    // 2. Find the first quest step to initialize the progress correctly
    const firstQuest = await prisma.quest.findFirst({
      where: { storyId: story.id },
      orderBy: { order: 'asc' },
      include: {
        steps: {
          orderBy: { order: 'asc' },
          take: 1,
        },
      },
    });

    const firstStepId = firstQuest?.steps[0]?.id || null;

    // 3. Upsert player progress
    const progress = await prisma.playerProgress.upsert({
      where: {
        playerId_storyId: {
          playerId,
          storyId: story.id,
        },
      },
      update: {
        nickname,
        deviceOs: deviceDetails?.os || null,
        deviceModel: deviceDetails?.model || null,
        browser: deviceDetails?.browser || null,
        resolution: deviceDetails?.resolution || null,
        userAgent: deviceDetails?.userAgent || null,
        lastSavedAt: new Date(),
      },
      create: {
        playerId,
        storyId: story.id,
        nickname,
        deviceOs: deviceDetails?.os || null,
        deviceModel: deviceDetails?.model || null,
        browser: deviceDetails?.browser || null,
        resolution: deviceDetails?.resolution || null,
        userAgent: deviceDetails?.userAgent || null,
        currentStepId: firstStepId,
      },
    });

    return NextResponse.json({
      success: true,
      progressId: progress.id,
      storySlug: story.slug,
    });
  } catch (error: unknown) {
    console.error('Error in register-player API:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal Server Error', details: message },
      { status: 500 }
    );
  }
}
