import { QuoteTemplate, AspectRatio, TypographyCustomization, PageTemplateCustomization } from '../types';

export interface RenderCanvasOptions {
  canvas: HTMLCanvasElement;
  image?: HTMLImageElement | null;
  backgroundImageUrl?: string;
  quoteText: string;
  author?: string;
  authorText?: string;
  template: QuoteTemplate;
  aspectRatio: AspectRatio;
  watermarkText?: string;
  watermarkPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'bottom-center';
  watermarkOpacity?: number;
  customOverlayOpacity?: number;
  customFontSize?: number;
  typography?: PageTemplateCustomization | TypographyCustomization;
}

export function getCanvasDimensions(aspect: AspectRatio): { width: number; height: number } {
  switch (aspect) {
    case '1:1':
      return { width: 1080, height: 1080 };
    case '4:5':
      return { width: 1080, height: 1350 };
    case '9:16':
      return { width: 1080, height: 1920 };
    case '16:9':
      return { width: 1920, height: 1080 };
    default:
      return { width: 1080, height: 1080 };
  }
}

export async function renderQuoteToCanvas(options: RenderCanvasOptions): Promise<void> {
  const {
    canvas,
    quoteText,
    template,
    aspectRatio,
    watermarkText = '',
    watermarkPosition = 'bottom-center',
    watermarkOpacity = 0.8,
    customOverlayOpacity,
    customFontSize,
  } = options;

  const author = options.author || options.authorText || '';
  let image = options.image || null;

  // If backgroundImageUrl is supplied and no image element, load it
  if (!image && options.backgroundImageUrl) {
    try {
      image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(img);
        img.src = options.backgroundImageUrl!;
      });
    } catch {
      image = null;
    }
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Make sure fonts are loaded
  if ('fonts' in document) {
    await document.fonts.ready;
  }

  const { width, height } = getCanvasDimensions(aspectRatio);
  canvas.width = width;
  canvas.height = height;

  const isPaperTemplate = template.overlayType === 'paper-texture' || template.id.includes('paper');

  // 1. Clear canvas
  ctx.fillStyle = isPaperTemplate ? '#f6f5f1' : '#050811';
  ctx.fillRect(0, 0, width, height);

  // 2. Draw Background Image
  if (image && image.complete && image.naturalWidth > 0) {
    const imgWidth = image.naturalWidth;
    const imgHeight = image.naturalHeight;
    const canvasAspect = width / height;
    const imgAspect = imgWidth / imgHeight;

    let sx = 0, sy = 0, sWidth = imgWidth, sHeight = imgHeight;

    if (imgAspect > canvasAspect) {
      // Image is wider than canvas
      sWidth = imgHeight * canvasAspect;
      sx = (imgWidth - sWidth) / 2;
    } else {
      // Image is taller than canvas
      sHeight = imgWidth / canvasAspect;
      sy = (imgHeight - sHeight) / 2;
    }

    ctx.drawImage(image, sx, sy, sWidth, sHeight, 0, 0, width, height);
  } else if (isPaperTemplate) {
    // Procedural watercolor paper background with subtle fibers
    ctx.fillStyle = '#f7f6f2';
    ctx.fillRect(0, 0, width, height);

    // Add subtle soft paper grain
    ctx.save();
    const paperGrad = ctx.createRadialGradient(width * 0.5, height * 0.45, width * 0.2, width * 0.5, height * 0.5, width * 0.85);
    paperGrad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
    paperGrad.addColorStop(0.7, 'rgba(245, 243, 237, 0.4)');
    paperGrad.addColorStop(1, 'rgba(235, 232, 224, 0.7)');
    ctx.fillStyle = paperGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle tactile fiber speckles
    ctx.fillStyle = 'rgba(0, 0, 0, 0.025)';
    for (let i = 0; i < 400; i++) {
      const rx = ((i * 137.5) % width);
      const ry = ((i * 269.3) % height);
      ctx.fillRect(rx, ry, 1.5, 1);
    }
    ctx.restore();
  } else {
    // Fallback atmospheric gradient background
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.5, '#1e1b4b');
    grad.addColorStop(1, '#090d16');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  // 3. Draw Overlay
  const typo = options.typography || {};
  const overlayOpacity = customOverlayOpacity !== undefined
    ? customOverlayOpacity
    : (typo.overlayOpacity !== undefined ? typo.overlayOpacity : template.overlayOpacity);

  const effectiveOverlayType = typo.overlayType || template.overlayType;
  const effectiveVignetteStrength = typo.vignetteStrength !== undefined ? typo.vignetteStrength : (template.vignetteStrength || 0.7);
  
  if (effectiveOverlayType === 'paper-texture') {
    // Light paper tone - minimal warm vignette
    if (overlayOpacity > 0) {
      const radius = Math.max(width, height) * (0.9 - effectiveVignetteStrength * 0.2);
      const vignette = ctx.createRadialGradient(width / 2, height / 2, width * 0.25, width / 2, height / 2, radius);
      vignette.addColorStop(0, `rgba(245, 243, 238, 0)`);
      vignette.addColorStop(1, `rgba(40, 35, 30, ${overlayOpacity * (0.3 + effectiveVignetteStrength * 0.4)})`);
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);
    }
  } else if (effectiveOverlayType === 'radial-vignette') {
    const radius = Math.max(width, height) * (0.95 - effectiveVignetteStrength * 0.35);
    const innerRadius = width * Math.max(0.05, 0.35 - effectiveVignetteStrength * 0.25);
    const vignette = ctx.createRadialGradient(width / 2, height / 2, innerRadius, width / 2, height / 2, radius);
    vignette.addColorStop(0, `rgba(0, 0, 0, ${overlayOpacity * Math.max(0, 0.4 - effectiveVignetteStrength * 0.2)})`);
    vignette.addColorStop(0.65, `rgba(0, 0, 0, ${overlayOpacity * (0.55 + effectiveVignetteStrength * 0.35)})`);
    vignette.addColorStop(1, `rgba(0, 0, 0, ${Math.min(1, overlayOpacity + 0.15 + effectiveVignetteStrength * 0.25)})`);
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  } else if (effectiveOverlayType === 'gradient-bottom') {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, `rgba(0, 0, 0, ${overlayOpacity * 0.2})`);
    grad.addColorStop(0.5, `rgba(0, 0, 0, ${overlayOpacity * (0.5 + effectiveVignetteStrength * 0.3)})`);
    grad.addColorStop(1, `rgba(0, 0, 0, ${Math.min(0.98, overlayOpacity + 0.25 + effectiveVignetteStrength * 0.2)})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  } else if (effectiveOverlayType === 'cinematic-cinemascope') {
    ctx.fillStyle = `rgba(0, 0, 0, ${overlayOpacity})`;
    ctx.fillRect(0, 0, width, height);
    // Cinema letterbox bars
    const barHeight = height * 0.08;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, barHeight);
    ctx.fillRect(0, height - barHeight, width, barHeight);
  } else {
    // Default solid / blur tint
    ctx.fillStyle = `rgba(0, 0, 0, ${overlayOpacity})`;
    ctx.fillRect(0, 0, width, height);
  }

  const effectiveAccentColor = typo.accentColor || template.accentColor;

  // 4. Border Ornaments
  if (template.borderOrnament === 'double-frame') {
    ctx.save();
    const margin = width * 0.045;
    ctx.strokeStyle = effectiveAccentColor || 'rgba(217, 119, 6, 0.6)';
    ctx.lineWidth = 2;
    ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

    const innerMargin = margin + 8;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(innerMargin, innerMargin, width - innerMargin * 2, height - innerMargin * 2);
    ctx.restore();
  } else if (template.borderOrnament === 'corner-accents') {
    ctx.save();
    const cornerSize = 36;
    const pad = width * 0.05;
    ctx.strokeStyle = effectiveAccentColor || '#38bdf8';
    ctx.lineWidth = 3;

    // Top-Left
    ctx.beginPath();
    ctx.moveTo(pad, pad + cornerSize);
    ctx.lineTo(pad, pad);
    ctx.lineTo(pad + cornerSize, pad);
    ctx.stroke();

    // Top-Right
    ctx.beginPath();
    ctx.moveTo(width - pad - cornerSize, pad);
    ctx.lineTo(width - pad, pad);
    ctx.lineTo(width - pad, pad + cornerSize);
    ctx.stroke();

    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(pad, height - pad - cornerSize);
    ctx.lineTo(pad, height - pad);
    ctx.lineTo(pad + cornerSize, height - pad);
    ctx.stroke();

    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(width - pad - cornerSize, height - pad);
    ctx.lineTo(width - pad, height - pad);
    ctx.lineTo(width - pad, height - pad - cornerSize);
    ctx.stroke();
    ctx.restore();
  } else if (template.borderOrnament === 'top-bottom-lines') {
    ctx.save();
    const lineMargin = width * 0.1;
    ctx.strokeStyle = template.accentColor || '#facc15';
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.moveTo(lineMargin, height * 0.12);
    ctx.lineTo(width - lineMargin, height * 0.12);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(lineMargin, height * 0.88);
    ctx.lineTo(width - lineMargin, height * 0.88);
    ctx.stroke();
    ctx.restore();
  } else if (template.borderOrnament === 'tactical-brackets') {
    ctx.save();
    const pad = width * 0.06;
    const bracketLen = width * 0.14;
    ctx.strokeStyle = template.accentColor || '#eab308';
    ctx.lineWidth = 4;
    ctx.lineCap = 'square';

    // Top Left bracket
    ctx.beginPath();
    ctx.moveTo(pad, pad + bracketLen);
    ctx.lineTo(pad, pad);
    ctx.lineTo(pad + bracketLen, pad);
    ctx.stroke();

    // Top Right bracket
    ctx.beginPath();
    ctx.moveTo(width - pad - bracketLen, pad);
    ctx.lineTo(width - pad, pad);
    ctx.lineTo(width - pad, pad + bracketLen);
    ctx.stroke();

    // Bottom Left bracket
    ctx.beginPath();
    ctx.moveTo(pad, height - pad - bracketLen);
    ctx.lineTo(pad, height - pad);
    ctx.lineTo(pad + bracketLen, height - pad);
    ctx.stroke();

    // Bottom Right bracket
    ctx.beginPath();
    ctx.moveTo(width - pad - bracketLen, height - pad);
    ctx.lineTo(width - pad, height - pad);
    ctx.lineTo(width - pad, height - pad - bracketLen);
    ctx.stroke();

    // Small tactical crosshairs in center top & bottom
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)';
    ctx.beginPath();
    ctx.moveTo(width / 2 - 15, pad);
    ctx.lineTo(width / 2 + 15, pad);
    ctx.moveTo(width / 2, pad - 8);
    ctx.lineTo(width / 2, pad + 8);
    ctx.stroke();

    ctx.restore();
  } else if (template.borderOrnament === 'military-stencil-frame') {
    ctx.save();
    const margin = width * 0.05;
    ctx.strokeStyle = template.accentColor || '#f59e0b';
    ctx.lineWidth = 3;
    ctx.setLineDash([30, 15, 60, 15]);
    ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);
    ctx.restore();
  }

  // 5. Card Background (if glassmorphic enabled)
  const contentWidth = width * 0.82;
  let cardX = (width - contentWidth) / 2;
  let cardPadding = 48;

  // 6. Text layout setup with optional typography customizations
  const baseSize = typo.fontSize || customFontSize || template.fontSize || 34;
  // Scale dynamically based on canvas width (1080 standard)
  const scale = width / 1080;
  const quoteFontSize = Math.round(baseSize * scale);
  const authorFontSize = Math.round(Math.max(16, typo.authorFontSize ? typo.authorFontSize * scale : quoteFontSize * 0.48));

  const fontFamily = typo.fontFamily || template.fontFamily || 'Playfair Display';
  const fontWeight = typo.fontWeight || template.fontWeight || '600';
  const fontStyle = (typo.fontStyle || template.fontStyle) === 'italic' ? 'italic ' : '';
  const textAlign = typo.textAlign || template.textAlign || 'center';
  const textColor = typo.textColor || template.textColor || (isPaperTemplate ? '#18181b' : '#ffffff');
  const lineHeightMultiplier = typo.lineHeight || template.lineHeight || 1.45;
  const letterSpacingVal = typo.letterSpacing ?? template.letterSpacing ?? 0;
  const verticalOffset = (typo.verticalOffset || 0) * scale;

  ctx.font = `${fontStyle}${fontWeight} ${quoteFontSize}px "${fontFamily}", serif, sans-serif`;
  ctx.fillStyle = textColor;
  ctx.textAlign = textAlign;
  if ('letterSpacing' in ctx) {
    (ctx as any).letterSpacing = `${letterSpacingVal * scale}px`;
  }

  const hasDropShadow = typo.dropShadow !== undefined ? typo.dropShadow : template.dropShadow;
  const shadowBlurVal = typo.dropShadowBlur !== undefined ? typo.dropShadowBlur : (template.dropShadowBlur || 8);

  if (hasDropShadow && !isPaperTemplate) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = shadowBlurVal * scale;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4 * scale;
  } else {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }

  // Word wrap logic with multi-line poetic stanza support
  const maxTextWidth = contentWidth - (template.cardBackground?.enabled ? cardPadding * 2 : 0);
  const paragraphs = quoteText.split(/\r?\n/);
  const lines: string[] = [];

  for (let p = 0; p < paragraphs.length; p++) {
    const rawPara = paragraphs[p];
    const trimmed = rawPara.trim();
    if (!trimmed) {
      // Empty line indicates deliberate poetic stanza break
      if (lines.length > 0 && lines[lines.length - 1] !== '') {
        lines.push('');
      }
      continue;
    }
    const words = trimmed.split(/\s+/);
    let currentLine = '';
    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxTextWidth && currentLine) {
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
  }

  const lineSpacing = quoteFontSize * lineHeightMultiplier;
  const stanzaGap = lineSpacing * 0.85;
  const totalTextHeight = lines.reduce((acc, line) => acc + (line === '' ? stanzaGap : lineSpacing), 0);
  const authorSpacing = author ? authorFontSize * (isPaperTemplate ? 3.6 : 2.8) : 0;
  const quoteMarkHeight = template.quoteMarkStyle === 'classic-giant' ? quoteFontSize * 1.4 : 0;
  const totalContentHeight = totalTextHeight + authorSpacing + quoteMarkHeight;

  let startY = (height - totalContentHeight) / 2 + (quoteMarkHeight > 0 ? quoteMarkHeight * 0.4 : 0) + verticalOffset;
  if (typo.verticalPosition === 'top') {
    startY = height * 0.22 + (quoteMarkHeight > 0 ? quoteMarkHeight * 0.4 : 0) + verticalOffset;
  } else if (typo.verticalPosition === 'bottom') {
    startY = height * 0.72 - totalContentHeight / 2 + verticalOffset;
  }

  // If card is enabled, draw frosted rectangle behind text
  if (template.cardBackground?.enabled) {
    ctx.save();
    const cardHeight = totalContentHeight + cardPadding * 2;
    const cardY = (height - cardHeight) / 2 + verticalOffset;
    const radius = template.cardBackground.borderRadius || 20;

    ctx.fillStyle = template.cardBackground.color || 'rgba(15, 23, 42, 0.7)';
    ctx.strokeStyle = template.cardBackground.borderColor || 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = template.cardBackground.borderWidth || 1;

    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(cardX, cardY, contentWidth, cardHeight, radius);
    } else {
      ctx.rect(cardX, cardY, contentWidth, cardHeight);
    }
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // Draw Giant Classic Quote Mark
  if (template.quoteMarkStyle === 'classic-giant') {
    ctx.save();
    ctx.font = `italic 700 ${quoteFontSize * 2.2}px "Playfair Display", Georgia, serif`;
    ctx.fillStyle = template.accentColor ? `${template.accentColor}66` : 'rgba(255, 255, 255, 0.25)';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 0;
    ctx.fillText('“', width / 2, startY - quoteFontSize * 0.4);
    ctx.restore();
  } else if (template.quoteMarkStyle === 'subtle-corner') {
    ctx.save();
    ctx.font = `italic 700 ${quoteFontSize * 1.5}px "Playfair Display", Georgia, serif`;
    ctx.fillStyle = template.accentColor || '#38bdf8';
    ctx.textAlign = 'left';
    ctx.fillText('“', cardX + (template.cardBackground?.enabled ? cardPadding : 0), startY - quoteFontSize * 0.2);
    ctx.restore();
  }

  // Draw Quote Lines with text alignment
  let textX = width / 2;
  if (textAlign === 'left') {
    textX = cardX + (template.cardBackground?.enabled ? cardPadding : 0);
  } else if (textAlign === 'right') {
    textX = width - cardX - (template.cardBackground?.enabled ? cardPadding : 0);
  }

  // Re-verify font & color for text
  ctx.font = `${fontStyle}${fontWeight} ${quoteFontSize}px "${fontFamily}", serif, sans-serif`;
  ctx.fillStyle = textColor;
  ctx.textAlign = textAlign;

  let currentY = startY;
  lines.forEach((line) => {
    if (line === '') {
      currentY += stanzaGap;
      return;
    }
    ctx.fillText(line, textX, currentY);
    currentY += lineSpacing;
  });

  // Draw Author
  if (author) {
    const authorY = currentY + authorSpacing * 0.7;
    const authorText = `${template.authorPrefix || '— '}${author.toUpperCase()}`;

    ctx.save();
    const effectiveAuthorColor = typo.authorColor || template.accentColor || (isPaperTemplate ? '#27272a' : '#fcd34d');
    if (template.authorStyle === 'typewriter-minimal') {
      // Clean typewriter author / watermark style (like Untold Feelings)
      ctx.font = `700 ${authorFontSize * 1.15}px "Special Elite", "Courier Prime", "Courier New", monospace`;
      ctx.fillStyle = effectiveAuthorColor;
      ctx.shadowBlur = 0;
      ctx.textAlign = textAlign;
      const cleanAuthor = template.authorPrefix ? `${template.authorPrefix}${author}` : author;
      ctx.fillText(cleanAuthor, textX, authorY);
    } else if (template.authorStyle === 'typewriter-tag') {
      ctx.font = `700 ${authorFontSize * 0.9}px "Courier Prime", "Special Elite", monospace`;
      const cleanAuthor = author.toUpperCase();
      const authMetrics = ctx.measureText(cleanAuthor);
      const tagWidth = authMetrics.width + 36;
      const tagHeight = authorFontSize * 1.7;
      const tagX = textX - tagWidth / 2;
      const tagY = authorY - tagHeight * 0.72;

      ctx.fillStyle = '#f4f4f5';
      ctx.strokeStyle = '#d4d4d8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(tagX, tagY, tagWidth, tagHeight, 4);
      } else {
        ctx.rect(tagX, tagY, tagWidth, tagHeight);
      }
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#18181b';
      ctx.fillText(cleanAuthor, textX, authorY);
    } else if (template.authorStyle === 'sans-caps-spaced') {
      ctx.font = `600 ${authorFontSize}px "Space Grotesk", "Inter", sans-serif`;
      ctx.fillStyle = template.accentColor || '#38bdf8';
      ctx.shadowBlur = 4;
      ctx.fillText(authorText, textX, authorY);
    } else if (template.authorStyle === 'gold-accent') {
      ctx.font = `700 ${authorFontSize}px "Cinzel", Georgia, serif`;
      ctx.fillStyle = template.accentColor || '#d97706';
      ctx.shadowBlur = 6;
      ctx.fillText(authorText, textX, authorY);
    } else if (template.authorStyle === 'mono-dash') {
      ctx.font = `500 ${authorFontSize}px "JetBrains Mono", monospace`;
      ctx.fillStyle = template.accentColor || '#34d399';
      ctx.shadowBlur = 2;
      ctx.fillText(authorText, textX, authorY);
    } else if (template.authorStyle === 'pill-badge') {
      ctx.font = `800 ${authorFontSize * 0.9}px "Bebas Neue", sans-serif`;
      const authMetrics = ctx.measureText(authorText);
      const pillWidth = authMetrics.width + 36;
      const pillHeight = authorFontSize * 1.8;
      const pillX = textX - pillWidth / 2;
      const pillY = authorY - pillHeight * 0.75;

      ctx.fillStyle = template.accentColor || '#facc15';
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 8);
      } else {
        ctx.rect(pillX, pillY, pillWidth, pillHeight);
      }
      ctx.fill();

      ctx.fillStyle = '#000000';
      ctx.fillText(authorText, textX, authorY);
    } else if (template.authorStyle === 'tactical-gold-tag') {
      ctx.font = `900 ${authorFontSize * 0.95}px "Bebas Neue", "Montserrat", sans-serif`;
      const authMetrics = ctx.measureText(authorText);
      const tagWidth = authMetrics.width + 42;
      const tagHeight = authorFontSize * 1.85;
      const tagX = textX - tagWidth / 2;
      const tagY = authorY - tagHeight * 0.72;

      // Dark tactical plate with gold border
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.strokeStyle = template.accentColor || '#f59e0b';
      ctx.lineWidth = 2;

      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(tagX, tagY, tagWidth, tagHeight, 4);
      } else {
        ctx.rect(tagX, tagY, tagWidth, tagHeight);
      }
      ctx.fill();
      ctx.stroke();

      // Gold text with subtle glow
      ctx.fillStyle = template.accentColor || '#fbbf24';
      ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';
      ctx.shadowBlur = 6;
      ctx.fillText(authorText, textX, authorY);
    } else {
      // Default serif italic
      ctx.font = `italic 400 ${authorFontSize}px "Playfair Display", serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fillText(authorText, textX, authorY);
    }
    ctx.restore();
  }

  // 7. Watermark / Page Handle
  if (watermarkText) {
    ctx.save();
    const wmFontSize = Math.round(18 * scale);

    if (isPaperTemplate) {
      // Typewriter brand watermark on pressed paper
      ctx.font = `700 ${wmFontSize * 1.15}px "Special Elite", "Courier Prime", "Courier New", monospace`;
      ctx.fillStyle = `rgba(24, 24, 27, ${watermarkOpacity})`;
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    } else {
      ctx.font = `600 ${wmFontSize}px "Space Grotesk", "Inter", sans-serif`;
      ctx.fillStyle = `rgba(255, 255, 255, ${watermarkOpacity})`;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
    }

    const pad = width * 0.05;
    let wmX = width / 2;
    let wmY = height - pad;

    if (watermarkPosition === 'top-left') {
      ctx.textAlign = 'left';
      wmX = pad;
      wmY = pad + wmFontSize;
    } else if (watermarkPosition === 'top-right') {
      ctx.textAlign = 'right';
      wmX = width - pad;
      wmY = pad + wmFontSize;
    } else if (watermarkPosition === 'bottom-left') {
      ctx.textAlign = 'left';
      wmX = pad;
      wmY = height - pad;
    } else if (watermarkPosition === 'bottom-right') {
      ctx.textAlign = 'right';
      wmX = width - pad;
      wmY = height - pad;
    } else {
      ctx.textAlign = 'center';
      wmX = width / 2;
      wmY = height - pad;
    }

    ctx.fillText(watermarkText, wmX, wmY);
    ctx.restore();
  }
}
