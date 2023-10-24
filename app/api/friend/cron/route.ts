import { NextResponse } from 'next/server';

let lastCronRun: Date | null = null;

export async function GET() {
    try {
        // Test if last run was before 55min
        if (lastCronRun != null && lastCronRun.valueOf() > (Date.now() - 55 * 60000))
            return NextResponse.json(
                {
                    message: `Last run was at ${lastCronRun.toLocaleDateString()}.`,
                },
                { status: 400 });

        console.log("CRON RUN");
        return NextResponse.json(
            {
                message: "CRON RUN.",
            },
            { status: 200 }
        );

    } catch (err: any) {
        return NextResponse.json(
            { message: 'Server Error', error: err },
            { status: 500 }
        );
    }
}
