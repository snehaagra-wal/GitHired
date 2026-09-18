import React, { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  pulseOffset: number;
  pulseSpeed: number;
  isCyan: boolean;
}

interface DataPacket {
  nodeA: number;
  nodeB: number;
  progress: number;
  speed: number;
}

interface HighwayStreak {
  z: number;
  speed: number;
  angle: number;
  color: string;
}

export const NetworkCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    const handleResize = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Generate Nodes
    const nodeCount = Math.min(70, Math.max(40, Math.floor((width * height) / 20000)));
    const nodes: Node[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        baseRadius: Math.random() * 1.5 + 2.0,
        pulseOffset: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.015,
        isCyan: Math.random() > 0.65
      });
    }

    // Traveling Data Packets
    const packets: DataPacket[] = [];
    const maxPackets = 20;

    // Highway Speed Streaks (Forward road motion)
    const streaks: HighwayStreak[] = [];
    const streakCount = 35;
    for (let i = 0; i < streakCount; i++) {
      streaks.push({
        z: Math.random(),
        speed: 0.009 + Math.random() * 0.015,
        angle: Math.PI * (0.12 + Math.random() * 0.76),
        color: Math.random() > 0.4 ? '#38bdf8' : (Math.random() > 0.5 ? '#818cf8' : '#c084fc')
      });
    }

    const spawnPacket = () => {
      if (packets.length >= maxPackets || nodes.length < 2) return;
      const a = Math.floor(Math.random() * nodes.length);
      let bestB = -1;
      let minDst = 150;
      for (let j = 0; j < nodes.length; j++) {
        if (j === a) continue;
        const dx = nodes[a].x - nodes[j].x;
        const dy = nodes[a].y - nodes[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < minDst) {
          bestB = j;
          break;
        }
      }

      if (bestB !== -1) {
        packets.push({
          nodeA: a,
          nodeB: bestB,
          progress: 0,
          speed: Math.random() * 0.01 + 0.008
        });
      }
    };

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      const maxDistance = 155;

      // Update and Draw Connections
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];

        n1.x += n1.vx;
        n1.y += n1.vy;

        if (n1.x < 0 || n1.x > width) n1.vx *= -1;
        if (n1.y < 0 || n1.y > height) n1.vy *= -1;

        // Mouse attraction
        const mdx = mouseX - n1.x;
        const mdy = mouseY - n1.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        let mouseInfluence = 0;

        if (mDist < 170 && mDist > 0) {
          mouseInfluence = (1 - mDist / 170);
          n1.x += (mdx / mDist) * mouseInfluence * 0.5;
          n1.y += (mdy / mDist) * mouseInfluence * 0.5;
        }

        // Connect nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.22 + mouseInfluence * 0.3;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = mouseInfluence > 0 ? 1.5 : 1.0;
            ctx.stroke();
          }
        }
      }

      // Draw Nodes with breathing pulse
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const pulse = Math.sin(tick * n.pulseSpeed + n.pulseOffset);
        const radius = Math.max(1.2, n.baseRadius + pulse * 0.8);
        const alpha = 0.75 + pulse * 0.25;
        const color = n.isCyan ? '#06b6d4' : (i % 3 === 0 ? '#c084fc' : '#818cf8');

        ctx.save();
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = Math.min(1, Math.max(0.3, alpha));
        ctx.shadowColor = color;
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.restore();
      }

      // Spawn & Draw Data Packets
      if (Math.random() < 0.28) spawnPacket();

      for (let pIdx = packets.length - 1; pIdx >= 0; pIdx--) {
        const p = packets[pIdx];
        p.progress += p.speed;

        if (p.progress >= 1) {
          packets.splice(pIdx, 1);
          continue;
        }

        const nA = nodes[p.nodeA];
        const nB = nodes[p.nodeB];
        if (!nA || !nB) continue;

        const px = nA.x + (nB.x - nA.x) * p.progress;
        const py = nA.y + (nB.y - nA.y) * p.progress;

        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 16;
        ctx.globalAlpha = 1.0;
        ctx.fill();
        ctx.restore();
      }

      // 4. Highway Speed Streaks Zooming Forward along Perspective
      const horizonX = width * 0.5;
      const horizonY = height * 0.25;
      const maxDist = Math.max(width, height) * 0.95;

      for (let s = 0; s < streaks.length; s++) {
        const stk = streaks[s];
        stk.z += stk.speed;
        if (stk.z >= 1) {
          stk.z = 0.05;
          stk.angle = Math.PI * (0.12 + Math.random() * 0.76);
          stk.speed = 0.009 + Math.random() * 0.015;
        }

        const currentDist = Math.pow(stk.z, 2.2) * maxDist;
        const tailDist = Math.pow(Math.max(0, stk.z - stk.speed * 2.2), 2.2) * maxDist;

        const hx = horizonX + Math.cos(stk.angle) * currentDist;
        const hy = horizonY + Math.sin(stk.angle) * currentDist * 0.65;

        const tx = horizonX + Math.cos(stk.angle) * tailDist;
        const ty = horizonY + Math.sin(stk.angle) * tailDist * 0.65;

        const alpha = Math.min(1, Math.max(0, stk.z * 1.2));
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(hx, hy);
        ctx.strokeStyle = stk.color;
        ctx.lineWidth = Math.max(1, stk.z * 3.5);
        ctx.shadowColor = stk.color;
        ctx.shadowBlur = 12 * stk.z;
        ctx.globalAlpha = alpha * 0.75;
        ctx.stroke();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
      
      {/* 1. 3D INFINITE MOVING CYBER HIGHWAY ROAD (JAISE ROAD CHALTI HAI) */}
      <div className="perspective-road-viewport">
        {/* Roadside perspective terrain grid */}
        <div className="road-terrain-grid" />
        {/* Center moving road with dashed highway lines */}
        <div className="infinite-highway-road" />
        {/* Horizon flare glow */}
        <div className="road-horizon-glow" />
      </div>

      {/* 2. CONTINUOUS MOVING CSS MATRIX & CIRCUIT PATTERN */}
      <div className="moving-pattern-bg absolute inset-0 opacity-40" />

      {/* 3. SWEEPING RADAR AMBIENT LIGHTS & LIGHT BEAM */}
      <div className="scanner-beam" />
      <div className="radar-glow-orb absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-indigo-600/18 via-purple-600/15 to-cyan-500/15 blur-[120px]" />
      
      <div className="aurora-orb-1 absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full bg-indigo-600/22 blur-[110px]" />
      
      <div className="aurora-orb-2 absolute top-1/2 -right-32 w-[550px] h-[550px] rounded-full bg-cyan-500/20 blur-[130px]" />

      {/* 4. 60FPS INTERACTIVE CANVAS (SPEED STREAKS + NEURAL NETWORK) */}
      <canvas
        ref={canvasRef}
        id="neural-network-canvas"
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};
