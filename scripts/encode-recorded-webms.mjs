import ffmpegPath from 'ffmpeg-static';
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const tmpDir = 'C:/Users/ZETICUZ/Documents/portfolio netflix/Portfolio_series/.tmp-recordings';
const outDir = 'C:/Users/ZETICUZ/Documents/portfolio netflix/Portfolio_series/public/trailers';

const ids = [
  'nexus-v2',
  'nexus-streaming',
  'zetflix-tv',
  'careerform-ph',
  'lifecoach-v1',
  'lifecoach-v2',
  'nwanganga-shields',
  'sws-skeptrons',
  'dekaron-stampede',
];

for (const id of ids) {
  const dir = path.join(tmpDir, id);
  if (!fs.existsSync(dir)) continue;
  const webms = fs.readdirSync(dir).filter(f => f.endsWith('.webm'));
  if (!webms.length) continue;
  const rawWebm = path.join(dir, webms[0]);
  if (fs.statSync(rawWebm).size < 15000) continue;

  const outMp4 = path.join(outDir, `${id}.mp4`);
  console.log(`Encoding 62s live-recorded 5-act trailer (trimming initial load) for ${id}...`);

  const filter = [
    `[0:v]trim=start=2.5,setpts=PTS-STARTPTS,fps=30,scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,setsar=1,eq=contrast=1.05:saturation=1.08,split=5[v1][v2][v3][v4][v5];`,
    `[v2]crop=1120:630:80:45,scale=1280:720,setsar=1[v2z];`,
    `[v3]reverse,setsar=1[v3r];`,
    `[v4]crop=1184:666:48:24,scale=1280:720,setsar=1[v4z];`,
    `[v5]crop=1088:612:96:54,scale=1280:720,setsar=1[v5z];`,
    `[v1][v2z][v3r][v4z][v5z]concat=n=5:v=1:a=0,format=yuv420p[outv]`
  ].join('');

  execFileSync(ffmpegPath, [
    '-y',
    '-i', rawWebm,
    '-filter_complex', filter,
    '-map', '[outv]',
    '-t', '62',
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-crf', '24',
    '-movflags', '+faststart',
    outMp4,
  ]);
  const mb = (fs.statSync(outMp4).size / (1024 * 1024)).toFixed(2);
  console.log(`  [OK] ${id}.mp4 (${mb} MB)`);
}
