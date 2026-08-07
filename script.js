const els = {
    editor: document.getElementById("textEditor"),
    titleInput: document.getElementById("titleInput"),
    creatorInput: document.getElementById("creatorInput"),
    ratioSelect: document.getElementById("ratioSelect"),
    canvasWidth: document.getElementById("canvasWidth"),
    paddingY: document.getElementById("paddingY"),
    paddingX: document.getElementById("paddingX"),
    bgType: document.getElementById("bgType"),
    bgColor1: document.getElementById("bgColor1"),
    gradColor1: document.getElementById("gradColor1"),
    gradColor2: document.getElementById("gradColor2"),
    gradColor3: document.getElementById("gradColor3"),
    gradientDir: document.getElementById("gradientDir"),
    globalTextColor: document.getElementById("globalTextColor"),
    subTextColor: document.getElementById("subTextColor"),
    hlColorA: document.getElementById("hlColorA"),
    hlColorB: document.getElementById("hlColorB"),
    hlColorC: document.getElementById("hlColorC"),
    quoteLineColor: document.getElementById("quoteLineColor"),
    enableQuoteColor: document.getElementById("enableQuoteColor"),
    quoteColor: document.getElementById("quoteColor"),
    enableParenColor: document.getElementById("enableParenColor"),
    parenColor: document.getElementById("parenColor"),
    fontSelect: document.getElementById("fontSelect"),
    alignH: document.getElementById("alignH"),
    wordBreak: document.getElementById("wordBreak"),
    tabs: document.querySelectorAll(".tab-btn"),
    panels: document.querySelectorAll(".tab-panel"),
    fontSize: document.getElementById("fontSize"),
    letterSpacing: document.getElementById("letterSpacing"),
    lineHeight: document.getElementById("lineHeight"),
    paraSpacing: document.getElementById("paraSpacing"),
    fontScaleX: document.getElementById("fontScaleX"),
    infoFontSize: document.getElementById("infoFontSize"),
    columnToggle: document.getElementById("columnToggle"),
    columnSplitIndex: document.getElementById("columnSplitIndex"),
    columnGap: document.getElementById("columnGap"),
    captureArea: document.getElementById("captureArea"),
    headingTitleInput: document.getElementById("headingTitleInput"),
    headingSubtitleInput: document.getElementById("headingSubtitleInput"),
    headingTitleFont: document.getElementById("headingTitleFont"),
    headingTitleAlign: document.getElementById("headingTitleAlign"),
    headingTitleSize: document.getElementById("headingTitleSize"),
    headingTitleBold: document.getElementById("headingTitleBold"),
    headingSubtitleFont: document.getElementById("headingSubtitleFont"),
    headingSubtitleAlign: document.getElementById("headingSubtitleAlign"),
    headingSubtitleSize: document.getElementById("headingSubtitleSize"),
    headingSubtitleBold: document.getElementById("headingSubtitleBold")
};

function updateCanvas() {
    if (!els.captureArea) return;

    const ratio = els.ratioSelect.value;
    els.captureArea.style.width = "";
    els.captureArea.style.height = "";
    els.captureArea.style.aspectRatio = "";
    els.captureArea.style.maxWidth = "none";

    const headerEl = document.querySelector(".canvas-header");

    if (ratio === "free") {
        const customW = parseFloat(els.canvasWidth.value) || 520;
        els.captureArea.style.width = `${customW}px`;
        els.captureArea.style.maxWidth = "none";
        els.captureArea.style.height = "auto";
        els.captureArea.style.maxHeight = "none";
        els.captureArea.style.margin = "0 auto";
        els.captureArea.style.overflow = "hidden";
        delete els.captureArea.dataset.customWidthTarget;
        delete els.captureArea.dataset.fixedRatioW;
        delete els.captureArea.dataset.fixedRatioH;
    } else {
        const [wStr, hStr] = ratio.split(":");
        const w = parseInt(wStr), h = parseInt(hStr);
        const targetWidth = Math.min(420, (headerEl && headerEl.clientWidth) || 420);
        const targetHeight = Math.round((targetWidth * h) / w);
        els.captureArea.style.width = `${targetWidth}px`;
        els.captureArea.style.maxWidth = `${targetWidth}px`;
        els.captureArea.style.height = `${targetHeight}px`;
        els.captureArea.style.maxHeight = "none";
        els.captureArea.style.margin = "0 auto";
        els.captureArea.style.overflow = "hidden";
        els.captureArea.dataset.fixedRatioW = w;
        els.captureArea.dataset.fixedRatioH = h;
        delete els.captureArea.dataset.customWidthTarget;
    }

    els.captureArea.style.padding = `${els.paddingY.value}px ${els.paddingX.value}px`;

    if (els.bgType.value === "solid") {
        document.getElementById("solidColorArea").style.display = "grid";
        document.getElementById("gradientColorArea").style.display = "none";
        els.captureArea.style.background = els.bgColor1.value;
    } else {
        document.getElementById("solidColorArea").style.display = "none";
        document.getElementById("gradientColorArea").style.display = "flex";
        const gradModeActive = document.querySelector('input[name="gradMode"]:checked')?.value;
        const grad3Wrapper = document.getElementById("grad3Wrapper");
        if (gradModeActive === "3") {
            if (grad3Wrapper) grad3Wrapper.style.display = "flex";
            els.captureArea.style.background = `linear-gradient(${els.gradientDir.value}, ${els.gradColor1.value}, ${els.gradColor2.value}, ${els.gradColor3.value})`;
        } else {
            if (grad3Wrapper) grad3Wrapper.style.display = "none";
            els.captureArea.style.background = `linear-gradient(${els.gradientDir.value}, ${els.gradColor1.value}, ${els.gradColor2.value})`;
        }
    }

    renderCanvasHeading();

    const textWrapper = document.getElementById("canvasTextWrapper");
    if (textWrapper) {
        let rawHTML = els.editor.innerHTML || "<div><br></div>";
        textWrapper.innerHTML = rawHTML;
        normalizeParagraphs(textWrapper);

        textWrapper.style.setProperty("--quote-line-color", els.quoteLineColor.value);
        if (els.editor) els.editor.style.setProperty("--quote-line-color", els.quoteLineColor.value);

        applySmartHighlighting(textWrapper);

        const canvasSpans = textWrapper.getElementsByTagName("span");
        for (let span of canvasSpans) {
            if (span.style.backgroundColor && span.style.backgroundColor !== "transparent") {
                span.style.display = "inline";
                span.style.boxDecorationBreak = "clone";
                span.style.webkitBoxDecorationBreak = "clone";
            }
        }

        textWrapper.style.fontFamily = els.fontSelect.value;
        textWrapper.style.textAlign = els.alignH.value;
        textWrapper.style.whiteSpace = "pre-wrap";
        textWrapper.style.wordBreak = els.wordBreak.value;
        textWrapper.style.color = els.globalTextColor.value;
        textWrapper.style.fontSize = `${els.fontSize.value}px`;
        textWrapper.style.lineHeight = `${els.lineHeight.value}px`;
        textWrapper.style.letterSpacing = `${els.letterSpacing.value}px`;

        const scaleFactor = (parseInt(els.fontScaleX.value) || 100) / 100;
        textWrapper.style.display = "block";
        textWrapper.style.width = `${100 / scaleFactor}%`;
        textWrapper.style.transform = `scaleX(${scaleFactor})`;

        if (els.alignH.value === "center") {
            textWrapper.style.transformOrigin = "center top";
            textWrapper.style.marginLeft = `calc((100% - 100% / ${scaleFactor}) / 2)`;
        } else if (els.alignH.value === "right") {
            textWrapper.style.transformOrigin = "right top";
            textWrapper.style.marginLeft = `calc(100% - 100% / ${scaleFactor})`;
        } else {
            textWrapper.style.transformOrigin = "left top";
            textWrapper.style.marginLeft = "0";
        }

        const columnsEnabled = !!(els.columnToggle && els.columnToggle.checked);
        if (columnsEnabled) {
            const paragraphNodes = Array.from(textWrapper.children);
            if (paragraphNodes.length > 1) {
                const rawSplit = parseInt(els.columnSplitIndex?.value, 10) || 1;
                const splitIndex = Math.min(Math.max(rawSplit, 1), paragraphNodes.length - 1);

                const col1 = document.createElement("div");
                col1.className = "canvas-column";
                const col2 = document.createElement("div");
                col2.className = "canvas-column";

                paragraphNodes.forEach((p, idx) => {
                    (idx < splitIndex ? col1 : col2).appendChild(p);
                });

                textWrapper.innerHTML = "";
                textWrapper.appendChild(col1);
                textWrapper.appendChild(col2);

                textWrapper.style.display = "flex";
                textWrapper.style.flexDirection = "row";
                textWrapper.style.alignItems = "flex-start";
                textWrapper.style.gap = `${parseFloat(els.columnGap?.value) || 32}px`;
                col1.style.flex = "1 1 0";
                col2.style.flex = "1 1 0";
                col1.style.minWidth = "0";
                col2.style.minWidth = "0";
            }
        }
    }

    const columnsActive = !!(els.columnToggle && els.columnToggle.checked && textWrapper.querySelector(".canvas-column"));
    const paragraphGroups = columnsActive
        ? Array.from(textWrapper.querySelectorAll(".canvas-column")).map((col) =>
              Array.from(col.querySelectorAll(":scope > div, :scope > p, :scope > .dialogue-line"))
          )
        : [Array.from(textWrapper.querySelectorAll("#canvasTextWrapper > div, #canvasTextWrapper > p, #canvasTextWrapper > .dialogue-line"))];

    paragraphGroups.forEach((group) => {
        group.forEach((p, idx) => {
            if (idx === group.length - 1) {
                p.style.marginBottom = "0px";
                p.style.paddingBottom = "0px";
            } else {
                p.style.marginBottom = `${els.paraSpacing.value}px`;
            }
        });
    });

    const infoContainer = document.getElementById("canvasInfo");
    const textContainer = document.getElementById("canvasTextContainer");

    if (infoContainer && textContainer) {
        if (infoContainer.parentNode !== textContainer) textContainer.appendChild(infoContainer);

        infoContainer.style.justifyContent = "flex-end";

        const bodyFontSize = parseFloat(els.fontSize.value) || 16;
        const bodyLineHeight = parseFloat(els.lineHeight.value) || 1.6;
        infoContainer.style.marginTop = `${bodyFontSize * bodyLineHeight}px`;

        const baseColor = els.globalTextColor.value;
        const fontName = els.fontSelect.value;
        const infoSize = parseFloat(els.infoFontSize?.value) || Math.max(10, parseFloat(els.fontSize.value) * 0.65);

        const titleVal = els.titleInput.value.trim();
        const creatorVal = els.creatorInput.value.trim();
        let infoHTML = "";

        if (titleVal || creatorVal) {
            infoHTML += `<span class="info-dash" style="color: ${baseColor}; font-size: ${infoSize}px; margin-right: 6px;">ⓐ</span>`;
            if (titleVal && creatorVal) {
                infoHTML +=
                    `<span class="info-text-node" style="color: ${baseColor}; font-family: ${fontName}; font-size: ${infoSize}px;">${titleVal}</span>` +
                    `<span class="info-divider" style="color: ${baseColor}; font-size: ${infoSize}px; margin: 0 6px;">x</span>` +
                    `<span class="info-text-node" style="color: ${baseColor}; font-family: ${fontName}; font-size: ${infoSize}px;">${creatorVal}</span>`;
            } else if (titleVal) {
                infoHTML += `<span class="info-text-node" style="color: ${baseColor}; font-family: ${fontName}; font-size: ${infoSize}px;">${titleVal}</span>`;
            } else {
                infoHTML += `<span class="info-text-node" style="color: ${baseColor}; font-family: ${fontName}; font-size: ${infoSize}px;">${creatorVal}</span>`;
            }
        }

        infoContainer.innerHTML = infoHTML;
        infoContainer.style.display = (titleVal || creatorVal) ? "flex" : "none";
    }

    if (ratio !== "free") {
        fitTextToCanvas();
    }

    if (typeof syncLiveHighlights === "function") {
        try { syncLiveHighlights(); } catch (e) {}
    }

    applyPreviewScale();
}

function applyPreviewScale() {
    const wrapper = document.getElementById("captureAreaScaleWrapper");
    const headerEl = document.querySelector(".canvas-header");
    if (!wrapper || !els.captureArea) return;

    if (els.ratioSelect.value !== "free") {
        wrapper.style.width = "";
        wrapper.style.height = "";
        els.captureArea.style.transform = "none";
        els.captureArea.style.transformOrigin = "";
        return;
    }

    // 실제 크기(스케일 없이)를 정확히 측정하기 위해 우선 변형을 해제
    els.captureArea.style.transform = "none";
    const naturalW = els.captureArea.offsetWidth;
    const naturalH = els.captureArea.scrollHeight;
    const availableW = (headerEl ? headerEl.clientWidth : naturalW) || naturalW;
    const scale = naturalW > 0 ? Math.min(1, availableW / naturalW) : 1;

    els.captureArea.style.transformOrigin = "0 0";
    els.captureArea.style.transform = scale < 1 ? `scale(${scale})` : "none";
    wrapper.style.width = `${Math.round(naturalW * scale)}px`;
    wrapper.style.height = `${Math.round(naturalH * scale)}px`;
}

function renderCanvasHeading() {
    const headingContainer = document.getElementById("canvasHeading");
    if (!headingContainer) return;

    const titleText = (els.headingTitleInput?.value || "").trim();
    const subtitleText = (els.headingSubtitleInput?.value || "").trim();

    headingContainer.innerHTML = "";

    if (!titleText && !subtitleText) {
        headingContainer.style.display = "none";
        return;
    }
    headingContainer.style.display = "block";

    if (titleText) {
        const titleEl = document.createElement("div");
        titleEl.className = "canvas-heading-title";
        titleEl.textContent = titleText;
        titleEl.style.fontFamily = els.headingTitleFont ? els.headingTitleFont.value : els.fontSelect.value;
        titleEl.style.textAlign = els.headingTitleAlign ? els.headingTitleAlign.value : "left";
        titleEl.style.fontSize = `${parseFloat(els.headingTitleSize?.value) || 24}px`;
        titleEl.style.fontWeight = els.headingTitleBold && els.headingTitleBold.checked ? "700" : "400";
        titleEl.style.color = els.globalTextColor.value;
        headingContainer.appendChild(titleEl);
    }

    if (subtitleText) {
        const subtitleEl = document.createElement("div");
        subtitleEl.className = "canvas-heading-subtitle";
        subtitleEl.textContent = subtitleText;
        subtitleEl.style.fontFamily = els.headingSubtitleFont ? els.headingSubtitleFont.value : els.fontSelect.value;
        subtitleEl.style.textAlign = els.headingSubtitleAlign ? els.headingSubtitleAlign.value : "left";
        subtitleEl.style.fontSize = `${parseFloat(els.headingSubtitleSize?.value) || 15}px`;
        subtitleEl.style.fontWeight = els.headingSubtitleBold && els.headingSubtitleBold.checked ? "700" : "400";
        subtitleEl.style.color = els.subTextColor ? els.subTextColor.value : els.globalTextColor.value;
        subtitleEl.style.marginTop = titleText ? "6px" : "0";
        headingContainer.appendChild(subtitleEl);
    }
}

function fitTextToCanvas() {
    const area = els.captureArea;
    const w = parseFloat(area.dataset.fixedRatioW);
    const h = parseFloat(area.dataset.fixedRatioH);
    if (!w || !h) return;

    const textWrapper = document.getElementById("canvasTextWrapper");
    if (!textWrapper) return;

    const baseFontSize = parseFloat(els.fontSize.value) || 16;
    const baseLineHeight = parseFloat(els.lineHeight.value) || 28;
    const lhRatio = baseLineHeight / baseFontSize;

    const areaW = area.getBoundingClientRect().width || parseFloat(area.style.width) || 420;
    const targetH = (areaW * h) / w;

    textWrapper.style.fontSize = `${baseFontSize}px`;
    textWrapper.style.lineHeight = `${baseLineHeight}px`;
    area.style.height = "auto";
    area.style.overflow = "visible";
    void area.offsetHeight;

    const naturalH = area.scrollHeight;

    if (naturalH <= targetH + 2) {
        area.style.height = `${Math.round(targetH)}px`;
        area.style.overflow = "hidden";
        return;
    }

    const scale = targetH / naturalH;
    const newFontSize = Math.max(4, baseFontSize * scale * 0.97);
    const newLineHeight = newFontSize * lhRatio;

    textWrapper.style.fontSize = `${newFontSize}px`;
    textWrapper.style.lineHeight = `${newLineHeight}px`;
    void area.offsetHeight;

    const checkH = area.scrollHeight;
    if (checkH > targetH + 2) {
        const scale2 = targetH / checkH;
        const finalSize = Math.max(4, newFontSize * scale2 * 0.97);
        textWrapper.style.fontSize = `${finalSize}px`;
        textWrapper.style.lineHeight = `${finalSize * lhRatio}px`;
    }

    area.style.height = `${Math.round(targetH)}px`;
    area.style.overflow = "hidden";
}

function applySmartHighlighting(container) {
    const hasQuotes = els.enableQuoteColor.checked;
    const hasParens = els.enableParenColor.checked;
    if (!hasQuotes && !hasParens) return;

    const textNodes = [];
    const walk = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
    let n;
    while ((n = walk.nextNode())) textNodes.push(n);

    let fullText = "";
    const nodeOffsets = [];
    textNodes.forEach((node) => {
        nodeOffsets.push({ node, start: fullText.length, end: fullText.length + node.nodeValue.length });
        fullText += node.nodeValue;
    });

    const intervals = [];
    if (hasQuotes) {
        const quoteRegex = /("[^"\n]*"|"[^"\n]*"|「[^」\n]*」|『[^』\n]*』|‹[^›\n]*›|«[^»\n]*»)/g;
        let match;
        while ((match = quoteRegex.exec(fullText)) !== null)
            intervals.push({ start: match.index, end: match.index + match[0].length, color: els.quoteColor.value });
    }
    if (hasParens) {
        const parenRegex = /(\([^)\n]*\)|\[[^\]\n]*\]|\{[^}\n]*\}|〈[^〉\n]*〉|《[^》\n]*\s*》)/g;
        let match;
        while ((match = parenRegex.exec(fullText)) !== null)
            intervals.push({ start: match.index, end: match.index + match[0].length, color: els.parenColor.value });
    }

    intervals.sort((a, b) => b.start - a.start);
    intervals.forEach((item) => {
        for (let i = nodeOffsets.length - 1; i >= 0; i--) {
            const info = nodeOffsets[i];
            const overlapStart = Math.max(item.start, info.start);
            const overlapEnd = Math.min(item.end, info.end);
            if (overlapStart < overlapEnd) {
                const localStart = overlapStart - info.start;
                const localEnd = overlapEnd - info.start;
                const node = info.node;
                const text = node.nodeValue;
                const p3 = text.substring(localEnd);
                const p2 = text.substring(localStart, localEnd);
                const p1 = text.substring(0, localStart);
                const parent = node.parentNode;
                const span = document.createElement("span");
                span.style.color = item.color;
                span.style.fontWeight = "inherit";
                span.style.fontFamily = "inherit";
                span.style.backgroundColor = "transparent";
                span.textContent = p2;
                let nextSibling = node.nextSibling;
                if (p3.length > 0) { const t3 = document.createTextNode(p3); parent.insertBefore(t3, nextSibling); nextSibling = t3; }
                parent.insertBefore(span, nextSibling);
                if (p1.length > 0) node.nodeValue = p1;
                else parent.removeChild(node);
            }
        }
    });
}

let lastHlColors = { A: "#fef08a", B: "#bbf7d0", C: "#bfdbfe" };
let lastSubTextColor = "#64748b";

function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : "";
}

function syncLiveHighlights(overrideColors = null) {
    const textWrapper = document.getElementById("canvasTextWrapper");
    if (!textWrapper) return;

    let baseA = lastHlColors.A, baseB = lastHlColors.B, baseC = lastHlColors.C, baseSub = lastSubTextColor;

    if (overrideColors) {
        if (overrideColors.hlColorA && els.hlColorA) els.hlColorA.value = overrideColors.hlColorA;
        if (overrideColors.hlColorB && els.hlColorB) els.hlColorB.value = overrideColors.hlColorB;
        if (overrideColors.hlColorC && els.hlColorC) els.hlColorC.value = overrideColors.hlColorC;
        if (overrideColors.subTextColor && els.subTextColor) els.subTextColor.value = overrideColors.subTextColor;
    }

    const oldRgbA = hexToRgb(baseA).replace(/\s+/g, "");
    const oldRgbB = hexToRgb(baseB).replace(/\s+/g, "");
    const oldRgbC = hexToRgb(baseC).replace(/\s+/g, "");
    const oldRgbSub = hexToRgb(baseSub).replace(/\s+/g, "");
    const targetColorA = els.hlColorA ? els.hlColorA.value : baseA;
    const targetColorB = els.hlColorB ? els.hlColorB.value : baseB;
    const targetColorC = els.hlColorC ? els.hlColorC.value : baseC;
    const targetColorSub = els.subTextColor ? els.subTextColor.value : baseSub;

    const updateSpansColor = (container) => {
        if (!container) return;
        const spans = container.getElementsByTagName("span");
        for (let span of spans) {
            const bg = span.style.backgroundColor;
            if (bg && bg !== "transparent" && bg !== "initial") {
                const normalizedBg = bg.replace(/\s+/g, "");
                if (normalizedBg === oldRgbA) span.style.backgroundColor = targetColorA;
                else if (normalizedBg === oldRgbB) span.style.backgroundColor = targetColorB;
                else if (normalizedBg === oldRgbC) span.style.backgroundColor = targetColorC;
                span.style.display = "inline";
                span.style.boxDecorationBreak = "clone";
                span.style.webkitBoxDecorationBreak = "clone";
            }
            const fg = span.style.color;
            if (fg && fg !== "transparent" && fg !== "initial") {
                if (fg.replace(/\s+/g, "") === oldRgbSub) span.style.color = targetColorSub;
            }
        }
        const fonts = container.getElementsByTagName("font");
        for (let font of fonts) {
            const fontColor = font.color || font.style.color;
            if (fontColor) {
                const currentFontRgb = (fontColor.startsWith("#") ? hexToRgb(fontColor) : fontColor).replace(/\s+/g, "");
                if (currentFontRgb === oldRgbSub) { font.color = targetColorSub; font.style.color = targetColorSub; }
            }
        }
    };

    updateSpansColor(els.editor);
    updateSpansColor(textWrapper);
    if (els.hlColorA) lastHlColors.A = els.hlColorA.value;
    if (els.hlColorB) lastHlColors.B = els.hlColorB.value;
    if (els.hlColorC) lastHlColors.C = els.hlColorC.value;
    if (els.subTextColor) lastSubTextColor = els.subTextColor.value;
}

function prepareCanvasForCapture(container) {
    const currentFont = els.fontSelect ? els.fontSelect.value : "inherit";
    container.querySelectorAll("span").forEach((span) => {
        const bg = span.style.backgroundColor;
        if (bg && bg !== "transparent" && bg !== "initial") {
            span.setAttribute("data-original-html", span.innerHTML);
            const chars = Array.from(span.textContent);
            span.innerHTML = chars.map((char) => char === "\n" ? "\n" : `<span style="background-color: ${bg}; display: inline; color: inherit; font-family: ${currentFont}; font-weight: inherit;">${char}</span>`).join("");
            span.style.backgroundColor = "transparent";
        }
    });
}

function restoreCanvasAfterCapture(container) {
    container.querySelectorAll("span[data-original-html]").forEach((span) => {
        const originalHTML = span.getAttribute("data-original-html");
        const restoredBg = span.querySelector("span")?.style.backgroundColor || "transparent";
        span.innerHTML = originalHTML;
        span.style.backgroundColor = restoredBg;
        span.removeAttribute("data-original-html");
    });
}

document.getElementById("btnBold").addEventListener("click", () => { document.execCommand("bold", false, null); updateCanvas(); });
document.getElementById("btnItalic").addEventListener("click", () => { document.execCommand("italic", false, null); updateCanvas(); });

document.getElementById("btnQuoteWrap").addEventListener("click", () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    document.execCommand("insertText", false, `"${range.toString()}"`);
    updateCanvas();
});

document.getElementById("btnSubText").addEventListener("click", () => {
    document.execCommand("foreColor", false, els.subTextColor?.value || "#64748b");
    if (typeof syncLiveHighlights === "function") syncLiveHighlights();
    updateCanvas();
});

// rgb(...)/rgba(...) 문자열을 받아 밝기를 계산해 대비되는 흑/백을 반환
function getContrastColor(colorStr) {
    const nums = (colorStr || "").match(/[\d.]+/g);
    if (!nums || nums.length < 3) return "#ffffff";
    const [r, g, b] = nums.map(Number);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.55 ? "#000000" : "#ffffff";
}

// 선택 영역의 각 글자가 가진 "현재 글자색"을 그대로 배경색으로 바꾸고,
// 글자색은 그 배경과 대비되는 색(흰/검)으로 반전시킨다.
function applyInvertToSelection() {
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.isCollapsed) return false;
    if (!els.editor.contains(selection.anchorNode)) return false;

    document.execCommand("fontSize", false, "7");

    const markers = els.editor.querySelectorAll('font[size="7"]');
    markers.forEach((marker) => {
        const walker = document.createTreeWalker(marker, NodeFilter.SHOW_TEXT, null, false);
        const textNodes = [];
        let node;
        while ((node = walker.nextNode())) textNodes.push(node);

        textNodes.forEach((textNode) => {
            if (!textNode.nodeValue || !textNode.parentElement) return;
            const computedColor = window.getComputedStyle(textNode.parentElement).color;
            const span = document.createElement("span");
            span.style.backgroundColor = computedColor;
            span.style.color = getContrastColor(computedColor);
            span.style.display = "inline";
            span.style.boxDecorationBreak = "clone";
            span.style.webkitBoxDecorationBreak = "clone";
            textNode.parentNode.insertBefore(span, textNode);
            span.appendChild(textNode);
        });

        const parent = marker.parentNode;
        while (marker.firstChild) parent.insertBefore(marker.firstChild, marker);
        parent.removeChild(marker);
    });

    return true;
}

document.getElementById("btnInvertHighlight").addEventListener("click", () => {
    if (applyInvertToSelection()) updateCanvas();
    else alert("먼저 본문에서 글자를 드래그해 선택해 주세요.");
});

document.getElementById("selHighlight").addEventListener("change", function () {
    const val = this.value;
    if (!val) return;

    let color = "#fef08a";
    if (val === "A") color = els.hlColorA.value;
    if (val === "B") color = els.hlColorB.value;
    if (val === "C") color = els.hlColorC.value;
    document.execCommand("backColor", false, color);
    this.value = "";
    for (let span of els.editor.getElementsByTagName("span")) {
        if (span.style.backgroundColor && span.style.backgroundColor !== "transparent") {
            span.style.display = "inline";
            span.style.boxDecorationBreak = "clone";
            span.style.webkitBoxDecorationBreak = "clone";
        }
    }
    updateCanvas();
});

const selAlignEl = document.getElementById("selAlign");
if (selAlignEl) {
    selAlignEl.addEventListener("change", function () {
        const val = this.value;
        if (!val) return;
        const cmd = val === "left" ? "justifyLeft" : val === "center" ? "justifyCenter" : "justifyRight";
        document.execCommand(cmd, false, null);
        this.value = "";
        updateCanvas();
    });
}

// 선택 영역에만 인라인 스타일(서체/크기 등)을 적용하는 헬퍼.
// execCommand("fontSize", false, "7")로 선택 영역을 <font size="7"> 로 감싼 뒤,
// 그 마커를 원하는 CSS가 적용된 <span>으로 치환한다. (여러 블록/노드에 걸친
// 선택에도 안정적으로 동작하도록 브라우저 내장 로직을 활용)
function applyStyleToSelection(cssProp, cssValue) {
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.isCollapsed) return false;
    if (!els.editor.contains(selection.anchorNode)) return false;

    document.execCommand("fontSize", false, "7");

    const markers = els.editor.querySelectorAll('font[size="7"]');
    markers.forEach((marker) => {
        const span = document.createElement("span");
        span.style[cssProp] = cssValue;
        while (marker.firstChild) span.appendChild(marker.firstChild);
        marker.parentNode.replaceChild(span, marker);
    });
    return true;
}

const selFontFamilyEl = document.getElementById("selFontFamily");
if (selFontFamilyEl) {
    selFontFamilyEl.addEventListener("change", function () {
        const val = this.value;
        this.value = "";
        if (!val) return;
        if (applyStyleToSelection("fontFamily", val)) updateCanvas();
        else alert("먼저 본문에서 글자를 드래그해 선택해 주세요.");
    });
}

const selFontSizeEl = document.getElementById("selFontSize");
if (selFontSizeEl) {
    selFontSizeEl.addEventListener("change", function () {
        const val = this.value;
        this.value = "";
        if (!val) return;
        if (applyStyleToSelection("fontSize", `${val}px`)) updateCanvas();
        else alert("먼저 본문에서 글자를 드래그해 선택해 주세요.");
    });
}

document.getElementById("btnQuoteLine").addEventListener("click", () => {
    let selection = window.getSelection();
    if (!selection.rangeCount) return;
    let range = selection.getRangeAt(0);
    let block = range.commonAncestorContainer;
    while (block && block.nodeType !== Node.ELEMENT_NODE) block = block.parentNode;
    if (block && block.id !== "textEditor") {
        block.classList.toggle("dialogue-line");
    } else {
        let div = document.createElement("div");
        div.classList.add("dialogue-line");
        div.appendChild(range.extractContents());
        range.insertNode(div);
    }
    updateCanvas();
});

els.editor.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        const node = selection.anchorNode;
        const inDialogue = (node.nodeType === 3 ? node.parentNode : node).closest(".dialogue-line");
        if (inDialogue) { e.preventDefault(); document.execCommand("insertLineBreak"); }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    els.tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const targetId = tab.getAttribute("data-target");
            const targetPanel = document.getElementById(targetId);
            const subWindow = document.querySelector(".adaptive-settings-window");
            if (tab.classList.contains("active")) {
                tab.classList.remove("active");
                if (targetPanel) targetPanel.classList.remove("active");
                if (subWindow) subWindow.classList.remove("active");
            } else {
                els.tabs.forEach((t) => t.classList.remove("active"));
                els.panels.forEach((p) => p.classList.remove("active"));
                tab.classList.add("active");
                if (targetPanel) targetPanel.classList.add("active");
                if (subWindow) subWindow.classList.add("active");
            }
        });
    });

    document.querySelectorAll(".segmented-control button").forEach((btn) => {
        btn.addEventListener("click", () => {
            const parent = btn.parentElement;
            parent.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            const hiddenInput = document.getElementById(parent.getAttribute("data-target"));
            if (hiddenInput) { hiddenInput.value = btn.getAttribute("data-value"); updateCanvas(); }
        });
    });

    document.querySelectorAll('input[name="gradMode"]').forEach((radio) => {
        radio.addEventListener("change", () => updateCanvas());
    });

    els.ratioSelect.addEventListener("change", () => {
        const customArea = document.getElementById("customWidthArea");
        const customHint = document.getElementById("customWidthHint");
        const isFree = els.ratioSelect.value === "free";
        if (customArea) customArea.style.display = isFree ? "flex" : "none";
        if (customHint) customHint.style.display = isFree ? "block" : "none";
        updateCanvas();
    });

    els.editor.addEventListener("input", () => {
        if (typeof currentImageBlock !== "undefined" && currentImageBlock && !els.editor.contains(currentImageBlock)) {
            deselectImageBlock();
        }
        updateCanvas();
    });
    if (typeof renderPresets === "function") renderPresets();

    if (els.columnToggle) {
        const toggleColumnRows = () => {
            const show = els.columnToggle.checked ? "flex" : "none";
            const splitArea = document.getElementById("columnSplitArea");
            const gapArea = document.getElementById("columnGapArea");
            if (splitArea) splitArea.style.display = show;
            if (gapArea) gapArea.style.display = show;
        };
        toggleColumnRows();
        els.columnToggle.addEventListener("change", () => {
            toggleColumnRows();
            updateCanvas();
        });
    }

    const autoTriggers = [
        els.titleInput, els.creatorInput, els.canvasWidth, els.paddingY, els.paddingX,
        els.bgType, els.bgColor1, els.gradColor1, els.gradColor2, els.gradColor3, els.gradientDir,
        els.globalTextColor, els.subTextColor, els.hlColorA, els.hlColorB, els.hlColorC,
        els.quoteLineColor, els.enableQuoteColor, els.quoteColor, els.enableParenColor, els.parenColor,
        els.fontSelect, els.wordBreak, els.fontSize, els.letterSpacing, els.lineHeight,
        els.paraSpacing, els.fontScaleX, els.infoFontSize,
        els.columnSplitIndex, els.columnGap,
        els.headingTitleInput, els.headingSubtitleInput,
        els.headingTitleFont, els.headingTitleSize, els.headingTitleBold,
        els.headingSubtitleFont, els.headingSubtitleSize, els.headingSubtitleBold
    ];
    autoTriggers.forEach((el) => {
        if (el) { el.addEventListener("input", updateCanvas); el.addEventListener("change", updateCanvas); }
    });

    setTimeout(() => updateCanvas(), 50);
});

document.getElementById("btnCopy").addEventListener("click", () => {
    if (!els.captureArea) return;
    const originalHeight = els.captureArea.style.height;
    const originalOverflow = els.captureArea.style.overflow;
    const originalTransform = els.captureArea.style.transform;
    els.captureArea.style.transform = "none";
    if (els.ratioSelect.value === "free") {
        els.captureArea.style.height = els.captureArea.scrollHeight + "px";
    }
    els.captureArea.style.overflow = "visible";
    prepareCanvasForCapture(els.captureArea);
    html2canvas(els.captureArea, { useCORS: true, allowTaint: true, backgroundColor: null, scale: 2 })
        .then((canvas) => {
            restoreCanvasAfterCapture(els.captureArea);
            els.captureArea.style.height = originalHeight;
            els.captureArea.style.overflow = originalOverflow;
            els.captureArea.style.transform = originalTransform;
            applyPreviewScale();
            canvas.toBlob((blob) => {
                if (!blob) { alert("이미지 변환 실패"); return; }
                const item = new ClipboardItem({ "image/png": blob });
                navigator.clipboard.write([item])
                    .then(() => alert("발췌문 이미지가 클립보드에 복사되었습니다!"))
                    .catch(() => alert("보안 정책으로 이미지 복사가 실패했습니다. 저장 버튼을 이용해 주세요."));
            }, "image/png");
        })
        .catch(() => {
            restoreCanvasAfterCapture(els.captureArea);
            els.captureArea.style.height = originalHeight;
            els.captureArea.style.overflow = originalOverflow;
            els.captureArea.style.transform = originalTransform;
            applyPreviewScale();
        });
});

document.getElementById("btnSave").addEventListener("click", () => {
    if (!els.captureArea) return;
    const originalHeight = els.captureArea.style.height;
    const originalOverflow = els.captureArea.style.overflow;
    const originalTransform = els.captureArea.style.transform;
    els.captureArea.style.transform = "none";
    if (els.ratioSelect.value === "free") {
        els.captureArea.style.height = els.captureArea.scrollHeight + "px";
    }
    els.captureArea.style.overflow = "visible";
    prepareCanvasForCapture(els.captureArea);
    html2canvas(els.captureArea, { useCORS: true, allowTaint: true, backgroundColor: null, scale: 2 })
        .then((canvas) => {
            restoreCanvasAfterCapture(els.captureArea);
            els.captureArea.style.height = originalHeight;
            els.captureArea.style.overflow = originalOverflow;
            els.captureArea.style.transform = originalTransform;
            applyPreviewScale();
            canvas.toBlob((blob) => {
                if (!blob) { alert("이미지 변환 실패"); return; }
                const blobURL = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = blobURL;
                link.download = `excerpt_${Date.now()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setTimeout(() => URL.revokeObjectURL(blobURL), 1000);
            }, "image/png");
        })
        .catch(() => {
            restoreCanvasAfterCapture(els.captureArea);
            els.captureArea.style.height = originalHeight;
            els.captureArea.style.overflow = originalOverflow;
            els.captureArea.style.transform = originalTransform;
            applyPreviewScale();
        });
});

document.getElementById("bgImageInput").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            document.getElementById("bgImageLayer").style.backgroundImage = `url(${event.target.result})`;
            updateBgImageStyles();
        };
        reader.readAsDataURL(file);
    }
});

function updateBgImageStyles() {
    const bgLayer = document.getElementById("bgImageLayer");
    const overlayLayer = document.getElementById("bgOverlayLayer");
    bgLayer.style.backgroundSize = `${document.getElementById("bgImageSize").value}%`;
    bgLayer.style.backgroundPosition = `${document.getElementById("bgImageX").value}% ${document.getElementById("bgImageY").value}%`;
    bgLayer.style.filter = `blur(${document.getElementById("bgImageBlur").value}px)`;
    const color = document.getElementById("bgOverlayColor").value;
    const opacity = document.getElementById("bgOverlayOpacity").value;
    overlayLayer.style.backgroundColor = `rgba(${color}, ${opacity})`;
}

["bgImageSize", "bgImageX", "bgImageY", "bgImageBlur", "bgOverlayColor", "bgOverlayOpacity"].forEach((id) => {
    document.getElementById(id).addEventListener("input", updateBgImageStyles);
});

document.getElementById("textEditor").addEventListener("paste", function (e) {
    e.preventDefault();
    const text = (e.originalEvent || e).clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
});

function normalizeParagraphs(container) {
    const paragraphs = [];
    const paragraphAligns = [];
    let currentParagraphNodes = [];
    let currentAlign = null;

    function flushParagraph() {
        if (currentParagraphNodes.length > 0) {
            paragraphs.push(currentParagraphNodes);
            paragraphAligns.push(currentAlign);
            currentParagraphNodes = [];
        }
    }

    function parseNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            currentParagraphNodes.push(node.cloneNode(true));
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName;
            if (tagName === "BR") {
                if (currentParagraphNodes.length > 0) flushParagraph();
                else { paragraphs.push([]); paragraphAligns.push(currentAlign); }
            } else if (node.classList.contains("dialogue-line")) {
                flushParagraph();
                paragraphs.push(node.cloneNode(true));
                paragraphAligns.push(node.style.textAlign || null);
                flushParagraph();
            } else if (node.classList.contains("editor-image-block")) {
                flushParagraph();
                const imgClone = node.cloneNode(true);
                imgClone.classList.remove("selected");
                paragraphs.push(imgClone);
                paragraphAligns.push(null);
                flushParagraph();
            } else if (tagName === "DIV" || tagName === "P" || /^H[1-6]$/.test(tagName)) {
                flushParagraph();
                const prevAlign = currentAlign;
                if (node.style.textAlign) currentAlign = node.style.textAlign;
                Array.from(node.childNodes).forEach(parseNodes);
                flushParagraph();
                currentAlign = prevAlign;
            } else {
                if (node.querySelector("div, p, br, .dialogue-line")) Array.from(node.childNodes).forEach(parseNodes);
                else currentParagraphNodes.push(node.cloneNode(true));
            }
        }
    }

    Array.from(container.childNodes).forEach(parseNodes);
    flushParagraph();

    while (paragraphs.length > 0) {
        const lastPara = paragraphs[paragraphs.length - 1];
        if (!(lastPara instanceof HTMLElement)) {
            if (lastPara.every((node) => node.textContent.trim() === "")) { paragraphs.pop(); paragraphAligns.pop(); continue; }
        }
        break;
    }

    container.innerHTML = "";
    paragraphs.forEach((pNodes, idx) => {
        const align = paragraphAligns[idx];
        if (pNodes instanceof HTMLElement && (pNodes.classList.contains("dialogue-line") || pNodes.classList.contains("editor-image-block"))) {
            if (align && !pNodes.classList.contains("editor-image-block")) pNodes.style.textAlign = align;
            container.appendChild(pNodes);
        } else {
            const newDiv = document.createElement("div");
            if (align) newDiv.style.textAlign = align;
            if (pNodes.length === 0) newDiv.appendChild(document.createElement("br"));
            else pNodes.forEach((n) => newDiv.appendChild(n));
            container.appendChild(newDiv);
        }
    });

    if (container.childNodes.length === 0) container.innerHTML = "<div><br></div>";
}

/* ========================================================================
   본문 내 사진 삽입 기능
   - 편집기(#textEditor) 안에 이미지 블록을 삽입하고,
   - 너비/높이/채우기 방식/정렬/모서리 둥글기를 자유롭게 조절할 수 있게 함.
   - 삽입된 블록은 normalizeParagraphs()에서 dialogue-line과 동일하게
     "그대로 보존해야 하는 블록"으로 취급되어 미리보기(canvas)에도 그대로 반영됨.
   ======================================================================== */

let currentImageBlock = null;

function applyImageAlign(block, align) {
    block.dataset.align = align;
    if (align === "left") {
        block.style.marginLeft = "0";
        block.style.marginRight = "auto";
    } else if (align === "right") {
        block.style.marginLeft = "auto";
        block.style.marginRight = "0";
    } else {
        block.style.marginLeft = "auto";
        block.style.marginRight = "auto";
    }
}

function selectImageBlock(block) {
    if (currentImageBlock && currentImageBlock !== block) {
        currentImageBlock.classList.remove("selected");
    }
    currentImageBlock = block;
    block.classList.add("selected");

    const panel = document.getElementById("imageBlockPanel");
    if (!panel) return;
    panel.style.display = "flex";

    const widthInput = document.getElementById("imgBlockWidth");
    const heightInput = document.getElementById("imgBlockHeight");
    const fitSelect = document.getElementById("imgBlockFit");
    const radiusInput = document.getElementById("imgBlockRadius");
    const lockRatio = document.getElementById("imgBlockLockRatio");

    if (widthInput) widthInput.value = parseInt(block.style.width, 10) || block.offsetWidth || 240;
    if (heightInput) heightInput.value = parseInt(block.style.height, 10) || block.offsetHeight || 240;
    if (fitSelect) fitSelect.value = block.dataset.fit || "cover";
    if (radiusInput) radiusInput.value = parseInt(block.style.borderRadius, 10) || 0;
    if (lockRatio) lockRatio.checked = block.dataset.lockRatio === "1";

    const align = block.dataset.align || "center";
    document.querySelectorAll("#imgBlockAlignGroup button").forEach((b) => {
        b.classList.toggle("active", b.getAttribute("data-value") === align);
    });
}

function deselectImageBlock() {
    if (currentImageBlock) currentImageBlock.classList.remove("selected");
    currentImageBlock = null;
    const panel = document.getElementById("imageBlockPanel");
    if (panel) panel.style.display = "none";
}

function applyLockedRatio(changedProp) {
    const lockRatio = document.getElementById("imgBlockLockRatio");
    if (!currentImageBlock || !lockRatio || !lockRatio.checked) return;
    const ratio = parseFloat(currentImageBlock.dataset.naturalRatio) || 1;
    const widthInput = document.getElementById("imgBlockWidth");
    const heightInput = document.getElementById("imgBlockHeight");
    if (changedProp === "width") {
        heightInput.value = Math.max(20, Math.round((parseFloat(widthInput.value) || 0) / ratio));
    } else if (changedProp === "height") {
        widthInput.value = Math.max(20, Math.round((parseFloat(heightInput.value) || 0) * ratio));
    }
}

function applyPanelToBlock() {
    if (!currentImageBlock) return;

    const widthInput = document.getElementById("imgBlockWidth");
    const heightInput = document.getElementById("imgBlockHeight");
    const w = Math.max(20, parseInt(widthInput.value, 10) || 20);
    const h = Math.max(20, parseInt(heightInput.value, 10) || 20);
    currentImageBlock.style.width = `${w}px`;
    currentImageBlock.style.height = `${h}px`;

    const fitSelect = document.getElementById("imgBlockFit");
    if (fitSelect) {
        currentImageBlock.dataset.fit = fitSelect.value;
        const img = currentImageBlock.querySelector("img");
        if (img) img.style.objectFit = fitSelect.value;
    }

    const radiusInput = document.getElementById("imgBlockRadius");
    if (radiusInput) {
        const radius = Math.max(0, parseInt(radiusInput.value, 10) || 0);
        currentImageBlock.style.borderRadius = `${radius}px`;
    }

    updateCanvas();
}

function insertImageBlock(dataURL, naturalW, naturalH) {
    const editor = els.editor;
    editor.focus();

    const editorWidth = editor.clientWidth || 300;
    const maxW = Math.min(editorWidth - 4, 320);
    let w = naturalW ? Math.min(maxW, naturalW) : maxW;
    let h = naturalW && naturalH ? Math.round((w * naturalH) / naturalW) : w;

    const block = document.createElement("div");
    block.className = "editor-image-block";
    block.setAttribute("contenteditable", "false");
    block.dataset.fit = "cover";
    block.dataset.align = "center";
    block.dataset.lockRatio = "0";
    block.dataset.naturalRatio = naturalW && naturalH ? (naturalW / naturalH).toFixed(6) : "1";
    block.style.width = `${w}px`;
    block.style.height = `${h}px`;
    block.style.borderRadius = "8px";
    applyImageAlign(block, "center");

    const img = document.createElement("img");
    img.src = dataURL;
    img.alt = "";
    img.draggable = false;
    img.style.objectFit = "cover";
    block.appendChild(img);

    const selection = window.getSelection();
    let range;
    if (selection && selection.rangeCount && editor.contains(selection.anchorNode)) {
        range = selection.getRangeAt(0);
    } else {
        range = document.createRange();
        range.selectNodeContents(editor);
        range.collapse(false);
    }
    range.deleteContents();
    range.insertNode(block);

    if (!block.nextSibling) {
        const spacer = document.createElement("div");
        spacer.appendChild(document.createElement("br"));
        block.after(spacer);
    }

    const newRange = document.createRange();
    newRange.setStartAfter(block);
    newRange.collapse(true);
    if (selection) {
        selection.removeAllRanges();
        selection.addRange(newRange);
    }

    updateCanvas();
    selectImageBlock(block);
}

document.addEventListener("DOMContentLoaded", () => {
    const btnInsertImage = document.getElementById("btnInsertImage");
    const imageInsertInput = document.getElementById("imageInsertInput");

    if (btnInsertImage && imageInsertInput) {
        btnInsertImage.addEventListener("click", () => {
            imageInsertInput.value = "";
            imageInsertInput.click();
        });

        imageInsertInput.addEventListener("change", function (e) {
            const file = e.target.files[0];
            if (!file) return;
            if (!file.type || !file.type.startsWith("image/")) {
                alert("이미지 파일만 삽입할 수 있어요.");
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                const dataURL = event.target.result;
                const tempImg = new Image();
                tempImg.onload = () => insertImageBlock(dataURL, tempImg.naturalWidth, tempImg.naturalHeight);
                tempImg.onerror = () => insertImageBlock(dataURL, 0, 0);
                tempImg.src = dataURL;
            };
            reader.readAsDataURL(file);
        });
    }

    els.editor.addEventListener("click", (e) => {
        const block = e.target.closest(".editor-image-block");
        if (block && els.editor.contains(block)) {
            selectImageBlock(block);
        } else {
            deselectImageBlock();
        }
    });

    document.addEventListener("click", (e) => {
        const panel = document.getElementById("imageBlockPanel");
        if (!panel || panel.style.display === "none") return;
        if (panel.contains(e.target) || els.editor.contains(e.target)) return;
        deselectImageBlock();
    });

    ["imgBlockWidth", "imgBlockHeight", "imgBlockFit", "imgBlockRadius"].forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener("input", () => {
            if (id === "imgBlockWidth") applyLockedRatio("width");
            if (id === "imgBlockHeight") applyLockedRatio("height");
            applyPanelToBlock();
        });
        el.addEventListener("change", applyPanelToBlock);
    });

    const lockRatioEl = document.getElementById("imgBlockLockRatio");
    if (lockRatioEl) {
        lockRatioEl.addEventListener("change", function () {
            if (!currentImageBlock) return;
            currentImageBlock.dataset.lockRatio = this.checked ? "1" : "0";
        });
    }

    document.querySelectorAll('[data-img-step]').forEach((btn) => {
        btn.addEventListener("click", () => {
            if (!currentImageBlock) return;
            const prop = btn.getAttribute("data-img-step");
            const step = parseInt(btn.getAttribute("data-step"), 10) || 0;
            const inputId = prop === "width" ? "imgBlockWidth" : prop === "height" ? "imgBlockHeight" : "imgBlockRadius";
            const input = document.getElementById(inputId);
            if (!input) return;
            const minVal = prop === "radius" ? 0 : 20;
            const newVal = Math.max(minVal, (parseInt(input.value, 10) || 0) + step);
            input.value = newVal;
            input.dispatchEvent(new Event("input", { bubbles: true }));
        });
    });

    document.querySelectorAll("#imgBlockAlignGroup button").forEach((btn) => {
        btn.addEventListener("click", () => {
            if (!currentImageBlock) return;
            document.querySelectorAll("#imgBlockAlignGroup button").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            applyImageAlign(currentImageBlock, btn.getAttribute("data-value"));
            updateCanvas();
        });
    });

    const btnRemoveImageBlock = document.getElementById("btnRemoveImageBlock");
    if (btnRemoveImageBlock) {
        btnRemoveImageBlock.addEventListener("click", () => {
            if (!currentImageBlock) return;
            const toRemove = currentImageBlock;
            deselectImageBlock();
            toRemove.remove();
            updateCanvas();
        });
    }
});
